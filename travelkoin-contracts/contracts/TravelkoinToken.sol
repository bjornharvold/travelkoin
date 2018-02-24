pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title TravelkoinMiniMeToken
 * @dev Basic MiniMe token
 */
contract TravelkoinToken is Ownable, BurnableToken, StandardToken, DetailedERC20 {
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