pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";

/**
 * @title TravelkoinToken
 * @dev Basic token
 */
contract TravelkoinToken is StandardToken, DetailedERC20 {
    function TravelkoinToken(
        string name,
        string symbol,
        uint8 decimals,
        uint256 initialSupply
    )
    DetailedERC20(name, symbol, decimals)
    public
    {
        totalSupply_ = initialSupply;
        balances[msg.sender] = initialSupply;
        Transfer(0x0, msg.sender, initialSupply);
    }
}