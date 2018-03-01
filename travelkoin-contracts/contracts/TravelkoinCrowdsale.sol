pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/crowdsale/distribution/PostDeliveryCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "./TravelkoinToken.sol";


/**
 * @title TravelkoinCrowdsale
 * @author Bjorn Harvold
 * @notice Travelkoin Token Sale round one normal sale contract with hard cap
 */
contract TravelkoinCrowdsale is WhitelistedCrowdsale, PostDeliveryCrowdsale, CappedCrowdsale {
    using SafeMath for uint256;

    // minimum contribution, 0.1ETH
    uint256 public minContribution = 0.1 ether;
    uint256 public dayOneMaxContribution = 1 ether;

    event InsufficientAmount(address indexed _beneficiary, uint256 _amount);
    event ExceededAmount(address indexed _beneficiary, uint256 _amount);

    // makes sure the user is only sending the amount allowed for any given day
    modifier minContributionOk(address _beneficiary, uint256 _weiAmount) {
        if (_weiAmount < minContribution) {
            InsufficientAmount(_beneficiary, _weiAmount);
        }
        require(_weiAmount >= minContribution);
        _;
    }

    // makes sure the user is only sending the amount allowed for any given day
    modifier amountOk(address _beneficiary, uint256 _weiAmount) {
        if (balances[_beneficiary] + _weiAmount > _howMuchCanXContributeNow(_beneficiary)) {
            ExceededAmount(_beneficiary, _weiAmount);
        }
        require(balances[_beneficiary] + _weiAmount <= _howMuchCanXContributeNow(_beneficiary));
        _;
    }

    ////////////////
    // Constructor and inherited function overrides
    ////////////////

    /// @notice Constructor to create TravelkoinNormalSale contract
    /// @param _startTime The start time of token sale in seconds.
    /// @param _endTime The end time of token sale in seconds.
    /// @param _minContribution The minimum contribution per transaction in wei (0.1 ETH)
    /// @param _dayOneMaxContribution The minimum contribution per transaction in wei (0.1 ETH)
    /// @param _rate Number of TKT tokens per 1 ETH
    /// @param _cap Maximum cap in wei, we can't raise more funds
    /// @param _wallet Address of owner wallet
    /// @param _token Our ERC20 token
    function TravelkoinCrowdsale(
        uint256 _startTime,
        uint256 _endTime,
        uint256 _minContribution,
        uint256 _dayOneMaxContribution,
        uint256 _rate,
        uint256 _cap,
        address _wallet,
        TravelkoinToken _token
    )
    Crowdsale(_rate, _wallet, _token)
    CappedCrowdsale(_cap)
    TimedCrowdsale(_startTime, _endTime)
    public
    {
        minContribution = _minContribution;
        dayOneMaxContribution = _dayOneMaxContribution;
    }

    /// @notice How many wei can the msg.sender contribute now.
    function howMuchCanIContributeNow() view public returns (uint256) {
        return _howMuchCanXContributeNow(msg.sender);
    }

    /// @notice How many 24 hour blocks have elapsed since token sale start
    /// @return Number of 24 hour blocks elapsed since token sale start starting from 1
    function getSaleDayNow() view public returns (uint8) {
        return _getSaleDay(now);
    }

    /// @notice How many wei can an Ethereum address contribute now.
    /// @param _beneficiary Ethereum address
    /// @return Number of wei the _beneficiary can contribute now.
    function _howMuchCanXContributeNow(address _beneficiary) view internal returns (uint256) {
        // wei to hard cap
        uint256 weiToCap = cap.sub(weiRaised);

        uint8 _saleDay = _getSaleDay(now);
        // limit to 1 ETH for the first day
        if (_saleDay == 1) {

            // personal cap is the daily whitelist limit minus the stakes the address already has
            uint256 weiToPersonalCap = dayOneMaxContribution.sub(balances[_beneficiary]);

            weiToCap = uint256Min(weiToCap, weiToPersonalCap);
        }

        return weiToCap;
    }

    /// @notice For a give date how many 24 hour blocks have elapsed since token sale start
    /// @dev _time has to be bigger than the startTime of token sale, otherwise SafeMath's div will throw.
    ///  Within 24 hours of token sale it will return 1, 
    ///  between 24 and 48 hours it will return 2, etc.
    /// @param _time Date in seconds for which we want to know which sale day it is
    /// @return Number of 24 hour blocks elapsing since token sale start starting from 1
    function _getSaleDay(uint256 _time) view internal returns (uint8) {
        return uint8(_time.sub(openingTime).div(60 * 60 * 24).add(1));
    }

    /// @notice Minimum between two uint8 numbers
    function uint8Min(uint8 a, uint8 b) pure internal returns (uint8) {
        return a > b ? b : a;
    }

    /// @notice Minimum between two uint256 numbers
    function uint256Min(uint256 a, uint256 b) pure internal returns (uint256) {
        return a > b ? b : a;
    }

    /**
   * @dev Override from Crowdsale to make sure the user sends the correct amount
   * @param _beneficiary Token beneficiary
   * @param _weiAmount Amount of wei contributed
   */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal minContributionOk(_beneficiary, _weiAmount) amountOk(_beneficiary, _weiAmount) {
        super._preValidatePurchase(_beneficiary, _weiAmount);
    }
}