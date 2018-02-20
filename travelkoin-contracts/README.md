# Travelkoin
Solidity contract for [travelkoin](https://travelkoin.io) token and sale rounds

## Contract Structure

### Basic contracts
All custom contracts extend and / or leverage OpenZeppelin, Consensys and MiniMe contracts.

### Unique contracts
1. TravelkoinController: controlling the Travelkoin MiniMeToken
2. TravelkoinHodler: managing the HODLer reward fund
3. TravelkoinNormalSale: managing normal sale
4. TravelkoinMiniMeToken: is a very basic MiniMe token
5. TravelkoinHasNoTokens: basic token to implement extraction of mistakenly sent tokens
6. TravelkoinMiniMeCrowdsale: basic OpenZeppelin Crowdsale with 3 small modifications
    * ERC20 token replaced with ERC20MiniMe token
    * Distinct tokenTransfer function to make it extensible
    * hasStarted function to know whether the crowdsale is started
7. TravelkoinCappedCrowdsale: basic OpenZeppelin CappedCrowdsale contract
    * implementing partial refund (https://github.com/OpenZeppelin/zeppelin-solidity/pull/499)
8. TravelkoinFinalizableCrowdsale extends OpenZeppelin Ownable and TravelkoinMiniMeCrowdsale contract
9. TravelkoinRefundableCrowdsale extends TravelkoinFinalizableCrowdsale contract
    * with a modification to forward funds to multisig wallet after reaching the cap, thus securing the funds as soon as it makes sense
10. TravelkoinRefundVault extends OpenZeppelin Ownable, TravelkoinHasNoTokens to recover mistakenly sent tokens

### MiniMe contracts
* ERC20MiniMe: is an ERC20 interface for MiniMe token
* Controlled: basic Controlled contract needed for MiniMe
* MiniMeToken: basic 0.2 version of MiniMe token
* TokenController: token controller interface needed to control the Travelkoin MiniMe token


### TravelkoinController
Controlls the TravelkoinMiniMeToken contract, the initial TKT token distribution, handles Grants (vesting tokens for team and advisors), HODLer reward and crowdsale.

It is a pausable contract, which is paused at initialization. While paused only this contract and crowdsale contracts can move funds of TKT token.

It implements HasNoTokens to recover mistakenly sent tokens to this contract.

All the tokens it holds can be used to create and revoke grants, transfer tokens to existing but not started grants.

Tokens for future crowdsales are held at the address of 0x1, which can be only moved to a crowdsale contract. Crowdsale contracts send excess TKT tokens back to address 0x1. If there is no active crowdsale (which has started but not ended), then it can set a new crowdsale contract and transfer tokens to it.

We have decided to handle crowdsales in separate contract to the TravelkoinController, because there will be several rounds of sales, and the exact timing of round 2 and 3 is unknown yet.

![Token Distribution](https://s3.amazonaws.com/traveliko.com/travelkoin_token_sale.png "Token Distribution")

Token distribution:
* SALE address (0x1): 35M TKT tokens for future sales rounds
* HODLER reward contract: 3.5M TKT tokens
* Deployer of contracts: 500K TKT tokens for bounty tokens
  * excess tokens will be sent to the HODLER reward contract
* Multisig Wallet: 17M TKT tokens for Community Fund
* TravelkoinController: 18M TKT tokens for founders, team and advisors
  * it can be only withdrawn through grants
    * team: 4 years vesting with one year cliff
    * advisors: 6 months vesting with three months cliff
* Early contributors: 3M TKT tokens

Only the multisig wallet can burn tokens of the TravelkoinController (which belongs to the team and advisors), or burn not yet assigned crowdsale tokens. In the future, the controller may be used to burn some of its own profit.

Also the multisig wallet can replace the TravelkoinController with a new one, which can be used for future updates. This transfers the controller rights of TravelkoinToken and HODLer reward contract to the new controller, and transfers all ETH and TKT tokens to the new controller. Previously issued and revoked grants will transfer excess TKT tokens to the old controller, which can be retrieved after a newController is set.

It also implements proxy functions to HODLer reward, which enables crowdsale contracts to set HODLer stakes.

It implements proxy functions to our TravelkoinMiniMeToken, which stops transferring TKT tokens when TravelkoinController is stopped, refuses ETH transfers to the TravelkoinMiniMeToken contract, invalidates HODLer stakes whenever any amount of TKT token is moved from an address, and helps to recover accidentally sent tokens (other than the TravelkoinMiniMeToken) to the TravelkoinMiniMeToken contract.


### HODLer
Only crowdsale contracts can interact with it, and it accepts modifications until its start time.

Implements HODLer reward logic:
Keep tokens intact (can’t move any portion of it) on your wallet for 3/6/9 months after two weeks of ending the normal sale, and 3.5M TKT token HODLER reward will be distributed sale HODLERs in the ratio of their intact stakes to the total amount.

* HODLER lot 3 months: 500,000 TKT
* HODLER lot 6 months: 900,000 TKT
* HODLER lot 9 months: 2,100,000 TKT

Moving any portion of TKT tokens from an address invalidates its stakes within the HODLer reward.

### TravelkoinNormalSale
This is our crowdsale contract. It has a hard cap of 31000 ETH.

## Deployment

### Testing
1. ``npm install -g truffle``
2. ``npm install within this directory``
3. ``truffle compile``
4. ``truffle develop``
5. ``test test/NormalSale.js``
5. ``test test/TravelkoinController.js``

### Initial deployment
1. deploy multisig wallet
2) deploy MiniMeTokenFactory
3) deploy TravelkoinController
4) deploy TravelkoinToken with TravelkoinController address and MiniMeTokenFactory address
5) TravelkoinController -> setTravelkoinToken(TravelkoinToken.address, 0)
  * 0 is for the Hodler reward contract address, it means the controller will create and assign to itself a new HODLer contract
6) deploy PreSale -> TravelkoinController.address
7) TravelkoinController -> setCrowdsaleTransfer PreSale.address

### Deploying a new crowdsale
*only when no active crowdsale is present*
1) deploy Crowdsale with the address of TravelkoinController
2) send funds and set address with TravelkoinController.setCrowdsaleTransfer

### Deploying a new TravelkoinToken fork
1) TravelkoinToken -> createCloneToken
2) TravelkoinController -> setTravelkoinToken(new TravelkoinToken.address, 0)

### Deploying a new TravelkoinController
*multisig wallet is needed*
1) deploy new TravelkoinController
2) new TravelkoinController -> setTravelkoinToken(TravelkoinToken.address, Hodler.address)
3) old TravelkoinController -> setNewController(new TravelkoinController.address)

