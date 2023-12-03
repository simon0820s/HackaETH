// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

library Address {
    /*****************************************
     *                Errors                 *
     *****************************************/
    error Address_ZeroAddress();

    function throwOnZero(address addr) internal pure returns (bool) {
        if (addr == address(0)) revert Address_ZeroAddress();
        return false;
    }
}
