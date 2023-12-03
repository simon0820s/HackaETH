// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

import {Address} from "./utils/Address.sol";

contract KYCAdmin is AccessControl {
    using Address for address;

    /*****************************************
     *             Custom Type               *
     *****************************************/

    struct User {
        bool isValidated;
        uint256 approvedLimit;
    }

    /*****************************************
     *               Storage                 *
     *****************************************/

    mapping(address => bool) isUserValidated;
    mapping(address => uint256) public approvedLimit;
    mapping(address => User) public users;

    /*****************************************
     *                Events                 *
     *****************************************/

    event KYCAdmin_UserValidated(address userAddres);

    /*****************************************
     *                Errors                 *
     *****************************************/

    error KYCAdmin_UserNotValidated(address userAddress);
    error KYCAdmin_UserAlreadyValidated(address userAddress);

    /*****************************************
     *               Modifier                *
     *****************************************/

    modifier onlyValidated(address userAddress) {
        _isUserValidated(userAddress);
        _;
    }

    modifier notZeroAddress(address userAddress) {
        userAddress.throwOnZero();
        _;
    }

    constructor(address initialAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
    }

    function validateUser(
        address _userAddress,
        uint256 _approvedLimit
    )
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        notZeroAddress(_userAddress)
        returns (bool)
    {
        address user = _userAddress;

        if (isUserValidated[user]) revert KYCAdmin_UserAlreadyValidated(user);
        isUserValidated[user] = true;
        approvedLimit[user] = _approvedLimit;

        emit KYCAdmin_UserValidated(user);

        return true;
    }

    function _isUserValidated(
        address userAddress
    ) internal view notZeroAddress(userAddress) returns (bool) {
        if (isUserValidated[userAddress]) return true;
        return false;
    }
}
