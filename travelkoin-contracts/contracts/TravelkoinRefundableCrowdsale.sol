pragma solidity ^0.4.18;


import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./TravelkoinFinalizableCrowdsale.sol";
import "./TravelkoinRefundVault.sol";


/**
 * @title RefundableCrowdsale
 * @dev Extension of Crowdsale contract that adds a funding goal, and
 * the possibility of users getting a refund if goal is not met.
 * Uses a TravelkoinRefundVault as the crowdsale's vault.
 */
contract TravelkoinRefundableCrowdsale is TravelkoinFinalizableCrowdsale {
    using SafeMath for uint256;

    // minimum amount of funds to be raised in weis
    uint256 public goal;

    // refund vault used to hold funds while crowdsale is running
    TravelkoinRefundVault public vault;

    function TravelkoinRefundableCrowdsale(uint256 _goal) public {
        require(_goal > 0);
        vault = new TravelkoinRefundVault(wallet);
        goal = _goal;
    }

    // if crowdsale is unsuccessful, investors can claim refunds here
    function claimRefund() public {
        require(isFinalized);
        require(!goalReached());

        vault.refund(msg.sender);
    }

    function goalReached() public constant returns (bool) {
        return weiRaised >= goal;
    }

    // We're overriding the fund forwarding from Crowdsale.
    // If the goal is reached forward the fund to the wallet,
    // otherwise in addition to sending the funds, we want to
    // call the TravelkoinRefundVault deposit function
    function forwardFunds(uint256 weiAmount) internal {
        if (goalReached())
            wallet.transfer(weiAmount);
        else
            vault.deposit.value(weiAmount)(msg.sender);
    }

    // vault finalization task, called when owner calls finalize()
    function finalization() internal {
        if (goalReached()) {
            vault.close();
        } else {
            vault.enableRefunds();
        }

        super.finalization();
    }

}