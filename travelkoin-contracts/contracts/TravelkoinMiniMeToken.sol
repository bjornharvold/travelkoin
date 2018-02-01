pragma solidity ^0.4.18;

import "./minime_0.2.0/MiniMeToken.sol";


/**
 * @title TravelkoinMiniMeToken
 * @dev Basic MiniMe token
 */
contract TravelkoinMiniMeToken is MiniMeToken {
    function TravelkoinMiniMeToken(address _controller, address _tokenFactory)
    MiniMeToken(
        _tokenFactory,
        0x0, // no parent token
        0, // no snapshot block number from parent
        "Travelkoin Token", // Token name
        18, // Decimals
        "TKT", // Symbol
        true                // Enable transfers
    ) public
    {
        changeController(_controller);
    }
}