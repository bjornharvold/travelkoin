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

    // after reaching {weiRaised} >= {softCap}, there is {softCapTime} seconds until the sale closes
    // {softCapClose} contains the closing time
    uint256 public rate = 1000;
    uint256 public softCap = 5555 ether;
    uint256 public softCapTime = 120 hours;
    uint256 public softCapClose;
    uint256 public cap = 55555 ether;

    // total token sold and undistributed token count
    uint256 public tokenSold;
    uint256 public tokenBalance;

    // contributing above {maxGasPrice} results in 
    // calculating stakes on {maxGasPricePenalty} / 100
    // eg. 80 {maxGasPricePenalty} means 80%, sending 5 ETH with more than 100gwei gas price will be calculated as 4 ETH
    uint256 public maxGasPrice = 100 * 10 ** 9;
    uint256 public maxGasPricePenalty = 80;

    // minimum contribution, 0.1ETH
    uint256 public minContribution = 0.1 ether;

    // first {whitelistDayCount} days of token sale is exclusive for whitelisted addresses
    // {whitelistDayMaxStake} contains the max stake limits per address for each whitelist sales day
    // {whitelist} contains who can contribute during whitelist period
    uint8 public whitelistDayCount;
    mapping(address => bool) public whitelist;
    mapping(uint8 => uint256) public whitelistDayMaxStake;

    // stakes contains contribution stake in wei
    // contributed ETH is calculated on 80% when sending funds with gasprice above maxGasPrice
    mapping(address => uint256) public stakes;
    uint256 totalStakes;

    // addresses of contributors to handle finalization after token sale end (refunds or token claims)
    address[] public contributorsKeys;

    // events for token purchase during sale and claiming tokens after sale
    event TokenClaimed(address indexed _claimer, address indexed _beneficiary, uint256 _stake, uint256 _amount);
    event TokenPurchase(address indexed _purchaser, address indexed _beneficiary, uint256 _value, uint256 _stake, uint256 _participants, uint256 _weiRaised);
    event TokenSoftCapReached(uint256 _closeTime);

    // whitelist events for adding days with maximum stakes and addresses
    event WhitelistAddressAdded(address indexed _whitelister, address indexed _beneficiary);
    event WhitelistAddressRemoved(address indexed _whitelister, address indexed _beneficiary);
    event WhitelistSetDay(address indexed _whitelister, uint8 _day, uint256 _maxStake);


    ////////////////
    // Constructor and inherited function overrides
    ////////////////

    /// @notice Constructor to create PreSale contract
    /// @param _travelkoinController Address of travelkoinController
    /// @param _startTime The start time of token sale in seconds.
    /// @param _endTime The end time of token sale in seconds.
    /// @param _minContribution The minimum contribution per transaction in wei (0.1 ETH)
    /// @param _rate Number of TKT tokens per 1 ETH
    /// @param _softCap Softcap in wei, reaching it ends the sale in _softCapTime seconds
    /// @param _softCapTime Seconds until the sale remains open after reaching _softCap
    /// @param _cap Maximum cap in wei, we can't raise more funds
    /// @param _gasPrice Maximum gas price
    /// @param _gasPenalty Penalty in percentage points for calculating stakes, eg. 80 means calculating 
    ///  stakes on 80% if gasprice was higher than _gasPrice
    /// @param _wallet Address of multisig wallet, which will get all the funds after successful sale
    function TravelkoinNormalSale(
        address _travelkoinController,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _minContribution,
        uint256 _rate,
        uint256 _softCap,
        uint256 _softCapTime,
        uint256 _cap,
        uint256 _gasPrice,
        uint256 _gasPenalty,
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

        // caps have to be consistent with each other
        require(_softCap <= _cap);

        softCap = _softCap;
        softCapTime = _softCapTime;

        // this is needed since super constructor wont overwrite overriden variables
        cap = _cap;
        rate = _rate;

        maxGasPrice = _gasPrice;
        maxGasPricePenalty = _gasPenalty;

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

    /// @dev Overriding Crowdsale#buyTokens to add partial refund and softcap logic 
    /// @param _beneficiary Beneficiary of the token purchase
    function buyTokens(address _beneficiary) public payable whenNotPaused {
        require(_beneficiary != address(0));

        uint256 weiToCap = howMuchCanXContributeNow(_beneficiary);
        uint256 weiAmount = uint256Min(weiToCap, msg.value);

        buyTokens(_beneficiary, weiAmount);

        // close sale in softCapTime seconds after reaching softCap
        if (weiRaised >= softCap && softCapClose == 0) {
            softCapClose = now.add(softCapTime);
            TokenSoftCapReached(uint256Min(softCapClose, endTime));
        }

        // handle refund
        uint256 refund = msg.value.sub(weiAmount);
        if (refund > 0) {
            msg.sender.transfer(refund);
        }
    }

    /// @dev Overriding Crowdsale#hasEnded to add soft cap logic
    /// @return true if crowdsale event has ended or a softCapClose time is set and passed
    function hasEnded() public constant returns (bool) {
        return super.hasEnded() || softCapClose > 0 && now > softCapClose;
    }

    ////////////////
    // BEFORE token sale
    ////////////////

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
        uint8 j = 0;
        // access max daily stakes

        // we override whiteListLimits only if it was supplied as an argument
        if (_whitelistLimits.length > 0) {
            // saving whitelist max stake limits for each day -> uint256 maxStakeLimit
            whitelistDayCount = uint8(_whitelistLimits.length);

            for (i = 0; i < _whitelistLimits.length; i++) {
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

    /// @notice Sets max gas price and penalty before sale
    function setMaxGas(uint256 _maxGas, uint256 _penalty) public onlyOwner beforeSale {
        maxGasPrice = _maxGas;
        maxGasPricePenalty = _penalty;
    }

    /// @notice Sets min contribution before sale
    function setMinContribution(uint256 _minContribution) public onlyOwner beforeSale {
        minContribution = _minContribution;
    }

    /// @notice Sets soft and max cap
    function setCaps(uint256 _softCap, uint256 _softCapTime, uint256 _cap) public onlyOwner beforeSale {
        require(0 < _cap && _softCap <= _cap);
        softCap = _softCap;
        softCapTime = _softCapTime;
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
        uint256 tokens;
        if (weiRaised < softCap) {
            // not reaching softcap means we sell for fixed rate of 1000 heal / eth
            tokens = stake.mul(rate);
        } else {
            // we sell all tokens based on stakes
            tokens = tokenSold.mul(stakes[_beneficiary]).div(totalStakes);
        }

        // set the stake 0 for beneficiary
        stakes[_beneficiary] = 0;

        // decrease tokenBalance, to make it possible to withdraw excess TKT funds
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

    /// @notice Returns stake multiplyer for now
    function getStakeMultiplyerNow() view public returns (uint256) {
        return getStakeMultiplyer(now);
    }

    /// @notice Returns the stake multiplyer in percentage, eg 80 means 80%
    function getStakeMultiplyer(uint256 _time) view public returns (uint256 _multiply) {
        _multiply = 100;

        // gas price penalty
        if (maxGasPrice > 0 && tx.gasprice > maxGasPrice) {
            _multiply = _multiply.mul(maxGasPricePenalty).div(100);
        }

        // calculate bonus based on sale day
        uint256 _day = uint256(getSaleDay(_time));

        // adjust for whitelist days
        if (whitelistDayCount > 0 && _day <= whitelistDayCount) {
            // if it is currently a whitelist day, we calculate as it is the first sale day
            _day = 1;
        } else if (whitelistDayCount > 0) {
            // after whitelist days are over, we start counting days from 1
            _day = _day.sub(whitelistDayCount);
        }

        // 40% bonus for first day, 20% for second, 15% for rest of the first week, 10% for second week, 5% for third week
        if (_day == 1) {
            _multiply = _multiply.mul(140).div(100);
        } else if (_day == 2) {
            _multiply = _multiply.mul(120).div(100);
        } else if (3 <= _day && _day <= 7) {
            _multiply = _multiply.mul(115).div(100);
        } else if (8 <= _day && _day <= 14) {
            _multiply = _multiply.mul(110).div(100);
        } else if (15 <= _day && _day <= 21) {
            _multiply = _multiply.mul(105).div(100);
        }
    }

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

        if (!hasStarted() || hasEnded())
            return 0;

        // wei to hard cap
        uint256 weiToCap = cap.sub(weiRaised);

        // if this is a whitelist limited period
        uint8 _saleDay = getSaleDayNow();
        if (_saleDay <= whitelistDayCount) {
            // address can't contribute if it is not whitelisted
            if (!whitelist[_beneficiary])
                return 0;

            // personal cap is the daily whitelist limit minus the stakes the address already has
            uint256 weiToPersonalCap = whitelistDayMaxStake[_saleDay].sub(stakes[_beneficiary]);

            // calculate for maxGasPrice penalty and sale bonus
            uint256 _mul = getStakeMultiplyerNow();
            if (_mul != 100)
                weiToPersonalCap = weiToPersonalCap.mul(100).div(_mul);

            weiToCap = uint256Min(weiToCap, weiToPersonalCap);
        }

        return weiToCap;
    }

    /// @notice For a give date how many 24 hour blocks have ellapsed since token sale start
    /// @dev _time has to be bigger than the startTime of token sale, otherwise SafeMath's div will throw.
    ///  Within 24 hours of token sale it will return 1, 
    ///  between 24 and 48 hours it will return 2, etc.
    /// @param _time Date in seconds for which we want to know which sale day it is
    /// @return Number of 24 hour blocks ellapsing since token sale start starting from 1
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

        // if didn't reach the soft cap we refund excess tokens
        if (weiRaised < softCap) {
            uint256 _sold = totalStakes.mul(rate);

            if (tokenSold > _sold) {
                uint256 _excess = tokenSold.sub(_sold);

                tokenSold = _sold;

                travelkoinController.token().transfer(travelkoinController.SALE(), _excess);
            }
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
        // adjust with stake multiplyer
        uint256 _mul = getStakeMultiplyerNow();
        if (_mul != 100)
            _stake = _stake.mul(_mul).div(100);

        // saving total stakes to be able to distribute tokens at the end
        totalStakes = totalStakes.add(_stake);

        if (stakes[_beneficiary] == 0)
            contributorsKeys.push(_beneficiary);

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
}