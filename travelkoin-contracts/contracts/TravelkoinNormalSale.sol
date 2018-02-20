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
    uint256 public cap = 31000 ether;

    // total token sold and undistributed token count
    uint256 public tokenSold;
    uint256 public tokenBalance;

    // minimum contribution, 0.1ETH
    uint256 public minContribution = 0.1 ether;

    // stakes contains contribution stake in wei
    mapping(address => uint256) public stakesPerUser;
    uint256 totalStakes;

    // first {whitelistDayCount} days of token sale is exclusive for whitelisted addresses
    // {whitelistDayMaxStake} contains the max stake limits per address for each whitelist sales day
    // {whitelist} contains who can contribute during whitelist period
    uint8 public whitelistDayCount;
    mapping (address => bool) public whitelist;
    mapping (uint8 => uint256) public whitelistDayMaxStake;

    // addresses of contributors to handle finalization after token sale end (refunds or token claims)
    address[] public contributorsKeys;

    // events for token purchase during sale and claiming tokens after sale
    event TokenClaimed(address indexed _claimer, address indexed _beneficiary, uint256 _stake, uint256 _amount);
    event TokenPurchase(address indexed _purchaser, address indexed _beneficiary, uint256 _value, uint256 _stake, uint256 _participants, uint256 _weiRaised);

    event WhitelistAddressAdded(address indexed _whitelister, address indexed _beneficiary);
    event WhitelistAddressRemoved(address indexed _whitelister, address indexed _beneficiary);
    event WhitelistSetDay(address indexed _whitelister, uint8 _day, uint256 _maxStake);


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
    }

    /// @notice claimToken() for multiple addresses
    /// @dev Anyone can call this function and distribute tokens after successful token sale
    /// @param _beneficiaries Array of addresses for which we want to claim tokens
    function claimTokensFor(address[] _beneficiaries) external afterSaleSuccess {
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            claimTokenFor(_beneficiaries[i]);
        }
    }

    /// @notice Modifier for before sale cases
    modifier beforeSale() {
        require(!hasStarted());
        _;
    }

    /// @notice Sets whitelist
    /// @dev The length of _whitelistLimits says that the first X days of token sale is
    ///  closed, meaning only for whitelisted addresses.
    /// @param _add Array of addresses to add to whitelisted ethereum accounts
    /// @param _remove Array of addresses to remove to whitelisted ethereum accounts
    /// @param _whitelistLimits Array of limits in wei, where _whitelistLimits[0] = 10 ETH means
    ///  whitelisted addresses can contribute maximum 10 ETH stakes on the first day
    ///  After _whitelistLimits.length days, there will be no limits per address (besides hard cap)
    function setWhitelist(address[] _add, address[] _remove, uint256[] _whitelistLimits) public onlyOwner beforeSale {
        uint256 i = 0;
        uint8 j = 0; // access max daily stakes

        // we override whiteListLimits only if it was supplied as an argument
        if (_whitelistLimits.length > 0) {
            // saving whitelist max stake limits for each day -> uint256 maxStakeLimit
            whitelistDayCount = uint8(_whitelistLimits.length);

            for (i = 0; i < _whitelistLimits.length; i++) {
                // instead of making the array day value 0-based we make it more logical so Day 1 = 1.
                j = uint8(i.add(1));
                if (whitelistDayMaxStake[j] != _whitelistLimits[i]) {
                    whitelistDayMaxStake[j] = _whitelistLimits[i];
                    WhitelistSetDay(msg.sender, j, _whitelistLimits[i]);
                }
            }
        }

        // adding whitelist addresses
        for (i = 0; i < _add.length; i++) {
            require(_add[i] != address(0));

            if (!whitelist[_add[i]]) {
                whitelist[_add[i]] = true;
                WhitelistAddressAdded(msg.sender, _add[i]);
            }
        }

        // removing whitelist addresses
        for (i = 0; i < _remove.length; i++) {
            require(_remove[i] != address(0));

            if (whitelist[_remove[i]]) {
                whitelist[_remove[i]] = false;
                WhitelistAddressRemoved(msg.sender, _remove[i]);
            }
        }
    }

    /// @notice Sets min contribution before sale
    function setMinContribution(uint256 _minContribution) public onlyOwner beforeSale {
        minContribution = _minContribution;
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
        uint256 stake = stakesPerUser[_beneficiary];
        require(stake > 0);

        // calculate token count
        uint256 tokens = stake.mul(rate);

        // set the stake 0 for beneficiary
        stakesPerUser[_beneficiary] = 0;

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
        if (_saleDay <= whitelistDayCount) {
            // address can't contribute if it is not whitelisted
            if (!whitelist[_beneficiary]) {
                return 0;
            }

            // personal cap is the daily whitelist limit minus the stakes the address already has
            uint256 weiToPersonalCap = whitelistDayMaxStake[_saleDay].sub(stakesPerUser[_beneficiary]);

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
            if (_pending && stakesPerUser[contributorsKeys[i]] > 0 || _claimed && stakesPerUser[contributorsKeys[i]] == 0) {
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

    /// @notice How many TKT tokens does this contract have
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

        uint256 _sold = totalStakes.mul(rate);

        if (tokenSold > _sold) {
            uint256 _excess = tokenSold.sub(_sold);

            tokenSold = _sold;

            travelkoinController.token().transfer(travelkoinController.SALE(), _excess);
        }

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

        if (stakesPerUser[_beneficiary] == 0) {
            contributorsKeys.push(_beneficiary);
        }

        stakesPerUser[_beneficiary] = stakesPerUser[_beneficiary].add(_stake);

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