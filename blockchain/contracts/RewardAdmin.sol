// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./StakerReward.sol";

contract RewardAdmin is AccessControl {
    /*****************************************
     *             Custom Type               *
     *****************************************/

    enum RewardType {
        Bronze,
        Silver,
        Gold
    }

    struct Reward {
        string uri;
        uint256 threshold;
    }

    /*****************************************
     *               Storage                 *
     *****************************************/

    uint256 private constant MAX_UINT256 = 2 ** 256 - 1;

    mapping(RewardType => Reward) public rewards;
    StakerReward public stakerReward;

    constructor(
        address initialAdmin,
        string memory goldUri,
        string memory silverUri,
        string memory bronzeUri
    ) {
        stakerReward = new StakerReward(address(this));

        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _setUri(RewardType.Gold, goldUri);
        _setUri(RewardType.Silver, silverUri);
        _setUri(RewardType.Bronze, bronzeUri);
    }

    /*****************************************
     *                Public                 *
     *****************************************/

    function setThreshold(
        RewardType rewardType,
        uint256 threshold
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        rewards[rewardType].threshold = threshold;
    }

    function setUri(
        RewardType rewardType,
        string memory uri
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setUri(rewardType, uri);
    }

    function _setUri(RewardType rewardType, string memory uri) internal {
        rewards[rewardType].uri = uri;
    }

    /*****************************************
     *               Internal                *
     *****************************************/

    function _mintReward(address to, uint256 amount) internal {
        uint256 rewardType = _getRewardType(amount);

        if (rewardType == MAX_UINT256) {
            return;
        }

        stakerReward.safeMint(to, rewards[RewardType(rewardType)].uri);
    }

    function _getRewardType(
        uint256 stakedBalance
    ) internal view returns (uint256) {
        uint256 goldTrheshold = rewards[RewardType.Gold].threshold;
        uint256 silverTrheshold = rewards[RewardType.Silver].threshold;
        uint256 bronzeTrheshold = rewards[RewardType.Bronze].threshold;

        if (stakedBalance >= goldTrheshold) {
            return uint256(RewardType.Gold); // 0
        } else if (stakedBalance >= silverTrheshold) {
            return uint256(RewardType.Silver); // 1
        } else if (stakedBalance >= bronzeTrheshold) {
            return uint256(RewardType.Bronze); // 2
        } else {
            /**
             * If the staked balance is less than the bronze threshold,
             * the user is not eligible for a reward.
             */
            return MAX_UINT256;
        }
    }
}
