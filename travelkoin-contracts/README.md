# Travelkoin
Solidity contract for [travelkoin](https://travelkoin.io).

## Contract Structure

### Basic contracts
All custom contracts extend and / or leverage OpenZeppelin and Consensys

### Unique contracts
4. TravelkoinToken: Our token contract
9. TravelkoinCrowdsale: Our crowdsale contract

### TravelkoinToken
This is our token. It leverages StandardToken and DetailedERC20.

### TravelkoinCrowdsale
This is our crowdsale contract. It leverages WhitelistedCrowdsale, TimedCrowdsale and CappedCrowdsale. 

## Deployment

### Testing
1. ``npm install -g truffle``
2. ``npm install``
3. ``truffle compile``
4. ``./test/test.sh``

### Initial deployment
1) Deploy TravelkoinToken with token data
2) Deploy TravelkoinCrowdsale with crowdsale data and injected token address

