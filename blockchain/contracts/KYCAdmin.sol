// SPDX-License-Identifier: SEE LICENSE IN LICENSE
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

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function validateUser(
        address userAddress
    )
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        notZeroAddress(userAddress)
        returns (bool)
    {
        address user = userAddress;

        if (isUserValidated[user]) revert KYCAdmin_UserAlreadyValidated(user);
        isUserValidated[user] = true;

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
