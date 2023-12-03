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
        uint256 payedQuotas;
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

    uint256 public INTERESTS_RATE = 12 * 10 ** 15;

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
    error LendingManager_InvalidQuotas();
    error LendingManager_InvalidId();
    error LendingManager_LendAlreadyPayed();
    error LendingManager_MinThresholdNotReached();
    error LendingManager_InvalidWithdraw();

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

    function calcEarnestInterest(address user) public view returns (uint256) {
        uint256 stakedAmount = stakedAmountPerUser[user];
        uint256 totalStaked = stakedBalance;
        uint256 totalInterests = collectedInterests;

        if (totalStaked == 0 || totalInterests == 0 || stakedAmount == 0) {
            return 0;
        }

        return
            FixedPointMathLib.mulDivDown(
                totalInterests,
                stakedAmount,
                totalStaked * SCALE
            );
    }

    function calcCompoundInterest(
        uint256 amount,
        uint256 quotas
    ) public view returns (uint256) {
        uint256 SCALE_DOWN = 1e9;

        return
            FixedPointMathLib.mulDivDown(
                amount,
                ((SCALE /** 1 */ + INTERESTS_RATE) / SCALE_DOWN) ** quotas,
                SCALE * SCALE_DOWN
            ) / (SCALE * SCALE_DOWN);
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

        uint256 lendId = lendsPerUser[user].length;
        uint256 netAmount = calcCompoundInterest(amount, quotas);
        Lend memory newLend = Lend({
            id: lendId,
            payed: false,
            amount: amount,
            netAmount: netAmount,
            quotas: quotas,
            payedQuotas: 0,
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

        _checkLendState(_lend);
        uint256 minPayment = _getMinPayment(_lend);

        if (amount < minPayment) revert LendingManager_MinThresholdNotReached();

        uint256 remainingInterests = _lend.netAmount - _lend.payedAmount;
        if (amount > remainingInterests) {
            uint256 remainingPayment = amount - remainingInterests;
            _payInterests(_lend, remainingInterests);
            _payPrincipal(_lend, remainingPayment);
        } else {
            _payInterests(_lend, amount);
        }

        bool isPayed = _updatedLendState(_lend);

        if (isPayed) {
            emit LendingManager_LendPayed(user, id);
        } else {
            emit LendingManager_QuotaPayed(user, amount, id);
        }

        return true;
    }

    function withdraw() external returns (bool) {
        address user = msg.sender;

        uint256 userStakedAmount = stakedAmountPerUser[user];

        if (userStakedAmount == 0) revert LendingManager_InvalidWithdraw();

        uint256 earnedInterests = calcEarnestInterest(user);

        stakedBalance -= userStakedAmount;
        collectedInterests -= earnedInterests;

        uint256 withdrawAmount = userStakedAmount + earnedInterests;
        uint256 currentBalance = cUSD.balanceOf(address(this));

        if (withdrawAmount > currentBalance)
            revert LendingManager_InvalidWithdraw();

        stakedAmountPerUser[user] = 0;

        cUSD.transfer(user, withdrawAmount);

        return true;
    }

    function lendsByUser(address user) external view returns (Lend[] memory) {
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

    function _checkLendState(Lend storage _lend) internal view {
        if (_lend.payed) revert LendingManager_LendAlreadyPayed();
    }

    function _takeTokensFromUser(address user, uint256 amount) internal {
        cUSD.safeTransferFrom(user, address(this), amount);
    }

    function _getMinPayment(Lend memory _lend) internal pure returns (uint256) {
        uint256 interest = _lend.netAmount - _lend.amount;
        uint256 minPayment = FixedPointMathLib.mulDivDown(
            interest,
            SCALE,
            _lend.quotas * SCALE
        );

        return minPayment;
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

    function _payInterests(Lend storage _lend, uint256 amount) internal {
        _lend.payedAmount += amount;
        collectedInterests += amount;
    }

    function _payPrincipal(Lend storage _lend, uint256 amount) internal {
        _lend.payedAmount += amount;
        _lend.payedQuotas += 1;
    }

    function _increaseUserBalance(address user, uint256 amount) internal {
        stakedAmountPerUser[user] += amount;
    }

    function _validateQuotas(uint256 amount) internal view {
        if (amount < MIN_QUOTAS || amount > MAX_QUOTAS)
            revert LendingManager_InvalidQuotas();
    }
}
