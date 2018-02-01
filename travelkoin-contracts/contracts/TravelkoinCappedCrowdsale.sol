pragma solidity ^0.4.18;

import "./TravelkoinMiniMeCrowdsale.sol";


/**
 * @author Bjorn Harvold
 * @title TravelkoinCappedCrowdsale
 * @dev Extension of CappedCrowdsale adding partial refund logic
 */
contract TravelkoinCappedCrowdsale is TravelkoinMiniMeCrowdsale {
    using SafeMath for uint256;

    uint256 public cap;

    function TravelkoinCappedCrowdsale(uint256 _cap) public {
        require(_cap > 0);
        cap = _cap;
    }

    // overriding Crowdsale#buyTokens to add partial refund logic
    function buyTokens(address beneficiary) public payable {
        uint256 weiToCap = cap.sub(weiRaised);
        uint256 weiAmount = weiToCap < msg.value ? weiToCap : msg.value;

        super.buyTokens(beneficiary, weiAmount);

        uint256 refund = msg.value.sub(weiAmount);
        if (refund > 0) {
            msg.sender.transfer(refund);
        }
    }

    // overriding Crowdsale#hasEnded to add cap logic
    // @return true if crowdsale event has ended
    function hasEnded() public constant returns (bool) {
        return super.hasEnded() || capReached();
    }

    // @return true if cap has been reached
    function capReached() internal constant returns (bool) {
        return weiRaised >= cap;
    }

    // overriding Crowdsale#validPurchase to add extra cap logic
    // @return true if investors can buy at the moment
    function validPurchase(uint256 weiAmount) internal constant returns (bool) {
        return super.validPurchase(weiAmount) && !capReached();
    }
}