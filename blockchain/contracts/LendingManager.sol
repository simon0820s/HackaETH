// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "solmate/src/utils/FixedPointMathLib.sol";

import {KYCAdmin} from "./KYCAdmin.sol";
import {RewardAdmin} from "./RewardAdmin.sol";

contract LendingManager is KYCAdmin, RewardAdmin {
    using SafeERC20 for IERC20;
    using FixedPointMathLib for uint256;
    /*****************************************
     *             Custom Types              *
     *****************************************/

    struct Lend {
        uint256 id;
        uint256 amount;
        uint256 netAmount;
        uint256 quotas;
        uint256 quotaPayed;
        uint256 payedAmount;
        bool payed;
    }

    /*****************************************
     *               Storage                 *
     *****************************************/

    uint256 public constant SCALE = 1e18;

    uint256 public stakedBalance;
    uint256 public collectedInterests;

    uint256 public MIN_QUOTAS = 3;
    uint256 public MAX_QUOTAS = 32;

    uint256 public INTERESTS_RATE = 4 * 10 ** 17;

    mapping(address => uint256) public stakedAmountPerUser;
    mapping(address => Lend[]) public lendsPerUser;

    IERC20 cUSD;

    /*****************************************
     *                Events                 *
     *****************************************/

    event LendingManager_Deposit(
        address indexed userAddres,
        uint256 indexed amount
    );

    event LendingManager_Lend(
        address indexed userAddress,
        uint256 indexed amount
    );

    event LendingManager_QuotaPayed(
        address indexed userAddress,
        uint256 indexed amount,
        uint256 indexed lendId
    );

    event LendingManager_LendPayed(
        address indexed userAddress,
        uint256 indexed lendId
    );

    /*****************************************
     *                Errors                 *
     *****************************************/

    error LendingManager_LimitExceeded();
    error LendingManager_InvalidQuotes();
    error LendingManager_InvalidId();
    error LendingManager_LendAlreadyPayed();

    constructor(
        address initialAdmin,
        address _cUSD,
        string memory goldUri,
        string memory silverUri,
        string memory bronzeUri
    )
        KYCAdmin(initialAdmin)
        RewardAdmin(initialAdmin, goldUri, silverUri, bronzeUri)
    {
        cUSD = IERC20(_cUSD);
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
    }

    /*****************************************
     *                Public                 *
     *****************************************/

    function getEarnedInsterests(
        address user
    ) public view returns (uint256 earnedInterests) {
        uint256 stakedAmount = stakedAmountPerUser[user];
        uint256 totalStaked = stakedBalance;
        uint256 totalInterests = collectedInterests;

        if (totalStaked == 0 || totalInterests == 0 || stakedAmount == 0) {
            return 0;
        }

        earnedInterests = FixedPointMathLib.mulDivDown(
            totalInterests,
            stakedAmount,
            totalStaked
        );
    }

    /*****************************************
     *               External                *
     *****************************************/

    function deposit(uint256 amount) external returns (bool) {
        address user = msg.sender;

        _takeTokensFromUser(user, amount);
        _increaseStakedBalance(amount);
        _increaseUserBalance(user, amount);
        _mintReward(user, amount);

        emit LendingManager_Deposit(user, amount);

        return true;
    }

    function lend(
        uint256 amount,
        uint256 quotas
    ) external onlyValidated(msg.sender) returns (bool) {
        address user = msg.sender;

        _validateQuotas(quotas);
        if (approvedLimit[user] < amount) revert LendingManager_LimitExceeded();

        uint256 lendId = lendsPerUser[user].length == 0
            ? 0
            : lendsPerUser[user].length - 1;

        uint256 netAmount = _calcCompoundInterest(amount, quotas);
        Lend memory newLend = Lend({
            id: lendId,
            payed: false,
            amount: amount,
            netAmount: netAmount,
            quotas: quotas,
            quotaPayed: 0,
            payedAmount: 0
        });
        lendsPerUser[user].push(newLend);

        emit LendingManager_Lend(user, amount);

        return true;
    }

    function payLend(
        uint256 id,
        uint256 amount
    ) external onlyValidated(msg.sender) returns (bool) {
        address user = msg.sender;
        Lend storage _lend = _getLendById(user, id);

        bool isOverpaying = _lend.amount < _lend.payedAmount + amount;
        if (isOverpaying) {
            uint256 fixedAmount = _lend.amount - _lend.payedAmount;
            _takeTokensFromUser(user, fixedAmount);
            _lend.payedAmount += fixedAmount;
        } else {
            _takeTokensFromUser(user, amount);
            _lend.payedAmount += amount;
        }

        bool isPayed = _updatedLendState(_lend);

        if (isPayed) {
            emit LendingManager_LendPayed(user, id);
        } else {
            emit LendingManager_QuotaPayed(user, amount, id);
        }

        return true;
    }

    function withdraw() external returns (bool) {}

    function LendsByUser(address user) external view returns (Lend[] memory) {
        return lendsPerUser[user];
    }

    /*****************************************
     *               Internal                *
     *****************************************/

    function _updatedLendState(
        Lend storage _lend
    ) internal returns (bool isPayed) {
        uint256 amount = _lend.amount;
        uint256 payedAmount = _lend.payedAmount;

        if (amount == payedAmount) {
            _lend.payed = true;
            isPayed = true;
        }

        isPayed = false;
    }

    function _takeTokensFromUser(address user, uint256 amount) internal {
        cUSD.safeTransferFrom(user, address(this), amount);
    }

    function _increaseStakedBalance(uint256 amount) internal {
        stakedBalance += amount;
    }

    function _getLendById(
        address user,
        uint256 id
    ) internal view returns (Lend storage) {
        Lend[] memory lends = lendsPerUser[user];

        if (lends.length < id) revert LendingManager_InvalidId();
        if (lends[id].payed) revert LendingManager_LendAlreadyPayed();

        return lendsPerUser[user][id];
    }

    function _increaseUserBalance(address user, uint256 amount) internal {
        stakedAmountPerUser[user] += amount;
    }

    function _validateQuotas(uint256 amount) internal view {
        if (amount < MIN_QUOTAS || amount > MAX_QUOTAS)
            revert LendingManager_InvalidQuotes();
    }

    function _calcCompoundInterest(
        uint256 amount,
        uint256 quotas
    ) internal view returns (uint256) {
        return
            amount.mulDivDown(
                (SCALE /** 1 */ + INTERESTS_RATE) ** quotas,
                SCALE ** quotas
            );
    }
}
