pragma solidity ^0.4.18;

import "./minime_0.2.0/ERC20MiniMe.sol";
import "./minime_0.2.0/TokenController.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./TravelkoinCappedCrowdsale.sol";
import "./TravelkoinFinalizableCrowdsale.sol";

/**
 * @title TravelkoinNormalSale
 * @author Bjorn Harvold
 * @notice Travelkoin Token Sale round one normal sale contract, with softcap and hardcap (cap)
 * @dev This contract has to be finalized before refund or token claims are enabled
 */
contract TravelkoinNormalSale is Pausable, TravelkoinFinalizableCrowdsale, TravelkoinCappedCrowdsale {
    // the token is here
    TokenController public travelkoinController;

    uint256 public rate = 1000;
    uint256 public cap = 55555 ether;

    // total token sold and undistributed token count
    uint256 public tokenSold;
    uint256 public tokenBalance;

    // minimum contribution, 0.1ETH
    uint256 public minContribution = 0.1 ether;
    uint256 public maxContributionFirstTwentyFourHours = 1 ether;

    // stakes contains contribution stake in wei
    mapping(address => uint256) public stakes;
    uint256 totalStakes;

    // addresses of contributors to handle finalization after token sale end (refunds or token claims)
    address[] public contributorsKeys;

    // events for token purchase during sale and claiming tokens after sale
    event TokenClaimed(address indexed _claimer, address indexed _beneficiary, uint256 _stake, uint256 _amount);
    event TokenPurchase(address indexed _purchaser, address indexed _beneficiary, uint256 _value, uint256 _stake, uint256 _participants, uint256 _weiRaised);

    ////////////////
    // Constructor and inherited function overrides
    ////////////////

    /// @notice Constructor to create TravelkoinNormalSale contract
    /// @param _travelkoinController Address of travelkoinController
    /// @param _startTime The start time of token sale in seconds.
    /// @param _endTime The end time of token sale in seconds.
    /// @param _minContribution The minimum contribution per transaction in wei (0.1 ETH)
    /// @param _rate Number of TKT tokens per 1 ETH
    /// @param _cap Maximum cap in wei, we can't raise more funds
    /// @param _wallet Address of multisig wallet, which will get all the funds after successful sale
    function TravelkoinNormalSale(
        address _travelkoinController,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _minContribution,
        uint256 _maxContributionFirstTwentyFourHours,
        uint256 _rate,
        uint256 _cap,
        address _wallet
    )
    TravelkoinCappedCrowdsale(_cap)
    TravelkoinMiniMeCrowdsale(_startTime, _endTime, _rate, _wallet)
    TravelkoinFinalizableCrowdsale()
    public
    {
        // travelkoinController must be valid
        require(_travelkoinController != address(0));
        travelkoinController = TokenController(_travelkoinController);

        // this is needed since super constructor wont overwrite overridden variables
        cap = _cap;
        rate = _rate;

        minContribution = _minContribution;
        maxContributionFirstTwentyFourHours = _maxContributionFirstTwentyFourHours;
    }

    /// @notice claimToken() for multiple addresses
    /// @dev Anyone can call this function and distribute tokens after successful token sale
    /// @param _beneficiaries Array of addresses for which we want to claim tokens
    function claimTokensFor(address[] _beneficiaries) external afterSaleSuccess {
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            claimTokenFor(_beneficiaries[i]);
        }
    }

    ////////////////
    // BEFORE token sale
    ////////////////

    /// @notice Modifier for before sale cases
    modifier beforeSale() {
        require(!hasStarted());
        _;
    }

    /// @notice Sets min contribution before sale
    function setMinContribution(uint256 _minContribution) public onlyOwner beforeSale {
        minContribution = _minContribution;
    }

    /// @notice Sets min contribution before sale
    function setMaxContributionFirstTwentyFourHours(uint256 _maxContributionFirstTwentyFourHours) public onlyOwner beforeSale {
        maxContributionFirstTwentyFourHours = _maxContributionFirstTwentyFourHours;
    }

    /// @notice Sets soft and max cap
    function setCap(uint256 _cap) public onlyOwner beforeSale {
        require(0 < _cap);
        cap = _cap;
    }

    /// @notice Sets crowdsale start and end time
    function setTimes(uint256 _startTime, uint256 _endTime) public onlyOwner beforeSale {
        require(_startTime > now && _startTime < _endTime);
        startTime = _startTime;
        endTime = _endTime;
    }

    /// @notice Set rate
    function setRate(uint256 _rate) public onlyOwner beforeSale {
        require(_rate > 0);
        rate = _rate;
    }


    ////////////////
    // AFTER token sale
    ////////////////

    /// @notice Modifier for cases where sale is closed and was successful.
    /// @dev It checks whether the sale has ended AND whether the contract is finalized
    modifier afterSaleSuccess() {
        require(hasEnded() && isFinalized);
        _;
    }

    /// @notice Claim token for msg.sender after token sale based on stake.
    function claimToken() public afterSaleSuccess {
        claimTokenFor(msg.sender);
    }

    /// @notice Claim token after token sale based on stake.
    /// @dev Anyone can call this function and distribute tokens after successful token sale
    /// @param _beneficiary Address of the beneficiary who gets the token
    function claimTokenFor(address _beneficiary) public afterSaleSuccess whenNotPaused {
        uint256 stake = stakes[_beneficiary];
        require(stake > 0);

        // calculate token count
        uint256 tokens = tokenSold.mul(stakes[_beneficiary]).div(totalStakes);

        // set the stake 0 for beneficiary
        stakes[_beneficiary] = 0;

        // decrease tokenBalance
        tokenBalance = tokenBalance.sub(tokens);

        // distribute hodlr stake
        travelkoinController.addHodlerStake(_beneficiary, tokens);

        // distribute token
        require(travelkoinController.token().transfer(_beneficiary, tokens));
        TokenClaimed(
            msg.sender,
            _beneficiary,
            stake,
            tokens
        );
    }


    ////////////////
    // Constant, helper functions
    ////////////////

    /// @notice How many wei can the msg.sender contribute now.
    function howMuchCanIContributeNow() view public returns (uint256) {
        return howMuchCanXContributeNow(msg.sender);
    }

    /// @notice How many wei can an ethereum address contribute now.
    /// @dev This function can return 0 when the crowdsale is stopped
    ///  or the address has maxed the current day's whitelist cap,
    ///  it is possible, that next day he can contribute
    /// @param _beneficiary Ethereum address
    /// @return Number of wei the _beneficiary can contribute now.
    function howMuchCanXContributeNow(address _beneficiary) view public returns (uint256) {
        require(_beneficiary != address(0));

        if (!hasStarted() || hasEnded()) {
            return 0;
        }

        // wei to hard cap
        uint256 weiToCap = cap.sub(weiRaised);

        uint8 _saleDay = getSaleDayNow();
        if (_saleDay <= 1 && weiToCap > maxContributionFirstTwentyFourHours) {
            // set wei cap to 1 ether limit per person for the first 24 hours of our sale
            weiToCap = maxContributionFirstTwentyFourHours;
        }

        return weiToCap;
    }

    /// @notice For a give date how many 24 hour blocks have elapsed since token sale start
    /// @dev _time has to be bigger than the startTime of token sale, otherwise SafeMath's div will throw.
    ///  Within 24 hours of token sale it will return 1, 
    ///  between 24 and 48 hours it will return 2, etc.
    /// @param _time Date in seconds for which we want to know which sale day it is
    /// @return Number of 24 hour blocks elapsing since token sale start starting from 1
    function getSaleDay(uint256 _time) view public returns (uint8) {
        return uint8(_time.sub(startTime).div(60 * 60 * 24).add(1));
    }

    /// @notice How many 24 hour blocks have ellapsed since token sale start
    /// @return Number of 24 hour blocks ellapsing since token sale start starting from 1
    function getSaleDayNow() view public returns (uint8) {
        return getSaleDay(now);
    }

    ////////////////
    // Test and contribution web app, NO audit is needed
    ////////////////

    /// @notice How many contributors we have.
    /// @return Number of different contributor ethereum addresses
    function getContributorsCount() view public returns (uint256) {
        return contributorsKeys.length;
    }

    /// @notice Get contributor addresses to manage refunds or token claims.
    /// @dev If the sale is not yet successful, then it searches in the TravelkoinRefundVault.
    ///  If the sale is successful, it searches in contributors.
    /// @param _pending If true, then returns addresses which didn't get refunded or their tokens distributed to them
    /// @param _claimed If true, then returns already refunded or token distributed addresses
    /// @return Array of addresses of contributors
    function getContributors(bool _pending, bool _claimed) view public returns (address[] contributors) {
        uint256 i = 0;
        uint256 results = 0;
        address[] memory _contributors = new address[](contributorsKeys.length);


        for (i = 0; i < contributorsKeys.length; i++) {
            if (_pending && stakes[contributorsKeys[i]] > 0 || _claimed && stakes[contributorsKeys[i]] == 0) {
                _contributors[results] = contributorsKeys[i];
                results++;
            }
        }

        contributors = new address[](results);
        for (i = 0; i < results; i++) {
            contributors[i] = _contributors[i];
        }

        return contributors;
    }

    /// @notice How many TKT tokens do this contract have
    function getTravelkoinBalance() view public returns (uint256) {
        return travelkoinController.token().balanceOf(address(this));
    }

    /// @notice Minimum between two uint8 numbers
    function uint8Min(uint8 a, uint8 b) pure internal returns (uint8) {
        return a > b ? b : a;
    }

    /// @notice Minimum between two uint256 numbers
    function uint256Min(uint256 a, uint256 b) pure internal returns (uint256) {
        return a > b ? b : a;
    }


    /// @dev Overriding Crowdsale#validPurchase to add min contribution logic
    /// @param _weiAmount Contribution amount in wei
    /// @return true if contribution is okay
    function validPurchase(uint256 _weiAmount) internal constant returns (bool) {
        return super.validPurchase(_weiAmount) && _weiAmount >= minContribution;
    }

    /// @dev Extending RefundableCrowdsale#finalization sending back excess tokens to travelkoinController
    function finalization() internal {
        tokenSold = getTravelkoinBalance();

        // unclaimed tokens
        tokenBalance = tokenSold;

        // hodler stake counting starts 14 days after closing normal sale
        travelkoinController.setHodlerTime(now + 14 days);

        super.finalization();
    }

    /// @dev Overriding Crowdsale#transferToken, which keeps track of contributions DURING token sale
    /// @param _beneficiary Address of the recepient of the tokens
    /// @param _weiAmount Contribution in wei
    function transferToken(address _beneficiary, uint256 _weiAmount) internal {
        require(_beneficiary != address(0));

        uint256 _stake = _weiAmount;

        // saving total stakes to be able to distribute tokens at the end
        totalStakes = totalStakes.add(_stake);

        if (stakes[_beneficiary] == 0) {
            contributorsKeys.push(_beneficiary);
        }

        stakes[_beneficiary] = stakes[_beneficiary].add(_stake);

        TokenPurchase(
            msg.sender,
            _beneficiary,
            _weiAmount,
            _stake,
            contributorsKeys.length,
            weiRaised
        );
    }

    /// @dev Overriding Crowdsale#buyTokens to add partial refund
    /// @param _beneficiary Beneficiary of the token purchase
    function buyTokens(address _beneficiary) public payable whenNotPaused {
        require(_beneficiary != address(0));

        uint256 weiToCap = howMuchCanXContributeNow(_beneficiary);
        uint256 weiAmount = uint256Min(weiToCap, msg.value);

        require(weiAmount > 0);

        buyTokens(_beneficiary, weiAmount);

        // handle refund
        uint256 refund = msg.value.sub(weiAmount);
        if (refund > 0) {
            msg.sender.transfer(refund);
        }
    }
}