pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./minime_0.2.0/ERC20MiniMe.sol";
import "./minime_0.2.0/TokenController.sol";
import "./TravelkoinMiniMeCrowdsale.sol";
import "./TravelkoinHodler.sol";
import "./TravelkoinHasNoTokens.sol";
import "./TravelkoinTokenVesting.sol";


/**
 * @title TravelkoinController
 * @author Bjorn Harvold
 * @notice Controller of the Travelkoin Token
 * @dev Crowdsale can be only replaced when no active crowdsale is running.
 *  The contract is paused by default. It has to be unpaused to enable token transfer.
 */
contract TravelkoinController is Pausable, TravelkoinHasNoTokens, TokenController {
    using SafeMath for uint;

    // when migrating this contains the address of the new controller
    TokenController public newController;

    // token contract
    ERC20MiniMe public token;

    // distribution of tokens
    uint256 public constant TKT_UNIT = 10 ** 18;
    uint256 public constant THOUSAND = 10 ** 3;
    uint256 public constant MILLION = 10 ** 6;
    uint256 public constant TOKEN_SALE1_NORMAL = 31 * MILLION * TKT_UNIT;
    uint256 public constant TOKEN_SALE2 = 12 * MILLION * TKT_UNIT;
    uint256 public constant TOKEN_HODL_3M = 500 * THOUSAND * TKT_UNIT;
    uint256 public constant TOKEN_HODL_6M = 900 * THOUSAND * TKT_UNIT;
    uint256 public constant TOKEN_HODL_9M = 2100 * THOUSAND * TKT_UNIT;
    uint256 public constant TOKEN_BOUNTY = 500 * THOUSAND * TKT_UNIT;
    uint256 public constant TOKEN_COMMUNITY = 17 * MILLION * TKT_UNIT;
    uint256 public constant TOKEN_TEAM = 12 * MILLION * TKT_UNIT;
    uint256 public constant TOKEN_FOUNDERS = 6 * MILLION * TKT_UNIT;
    uint256 public constant TOKEN_EARLY_CONTRIBUTORS = 3 * MILLION * TKT_UNIT;

    // addresses only SALE will remain, the others will be real eth addresses
    address public SALE = 0x1;
    address public FOUNDER1 = 0x2;
    address public FOUNDER2 = 0x3;
    address public CONTRIBUTOR1 = 0x4;
    address public CONTRIBUTOR2 = 0x5;

    // addresses for multisig and crowdsale
    address public multiSigWallet;
    TravelkoinMiniMeCrowdsale public crowdsale;

    // hodler reward contract
    TravelkoinHodler public hodler;

    // token grants
    TravelkoinTokenVesting[] public tokenGrants;
    uint256 public constant VESTING_TEAM_CLIFF = 365 days;
    uint256 public constant VESTING_TEAM_DURATION = 4 * 365 days;
    uint256 public constant VESTING_ADVISOR_CLIFF = 3 * 30 days;
    uint256 public constant VESTING_ADVISOR_DURATION = 6 * 30 days;


    /// @dev only the crowdsale can call it
    modifier onlyCrowdsale() {
        require(msg.sender == address(crowdsale));
        _;
    }

    /// @dev only the crowdsale can call it
    modifier onlyMultiSig() {
        require(msg.sender == address(multiSigWallet));
        _;
    }


    ////////////////
    // Constructor, overrides
    ////////////////

    /// @notice Constructor for Travelkoin Controller
    function TravelkoinController(address _wallet) public {
        require(_wallet != address(0));

        paused = true;
        multiSigWallet = _wallet;
    }

    /// @dev overrides TravelkoinHasNoTokens#extractTokens to make it possible to extract any tokens after migration or before that any tokens except travelkoin
    function extractTokens(address _token, address _claimer) onlyOwner public {
        require(newController != address(0) || _token != address(token));

        super.extractTokens(_token, _claimer);
    }


    ////////////////
    // Manage crowdsale
    ////////////////

    /// @notice Set crowdsale address and transfer TKT tokens from travelkoinController's SALE address
    /// @dev Crowdsale can be only set when the current crowdsale is not active and token is set
    function setCrowdsaleTransfer(address _sale, uint256 _amount) public onlyOwner {
        require(_sale != address(0) && !isCrowdsaleOpen() && address(token) != address(0));

        crowdsale = TravelkoinMiniMeCrowdsale(_sale);

        // transfer TKT tokens to crowdsale account from the account of controller
        require(token.transferFrom(SALE, _sale, _amount));
    }

    /// @notice Is there a not ended crowdsale?
    /// @return true if there is no crowdsale or the current crowdsale is not yet ended but started
    function isCrowdsaleOpen() public view returns (bool) {
        return address(crowdsale) != address(0) && !crowdsale.hasEnded() && crowdsale.hasStarted();
    }


    ////////////////
    // Manage grants
    ////////////////

    /// @notice Grant vesting token to an address
    function createGrant(
        address _beneficiary,
        uint256 _start,
        uint256 _amount,
        bool _revocable,
        bool _advisor)
    public
    onlyOwner
    {
        require(_beneficiary != address(0) && _amount > 0 && _start >= now);

        // create token grant
        if (_advisor) {
            tokenGrants.push(new TravelkoinTokenVesting(_beneficiary, _start, VESTING_ADVISOR_CLIFF, VESTING_ADVISOR_DURATION, _revocable));
        } else {
            tokenGrants.push(new TravelkoinTokenVesting(_beneficiary, _start, VESTING_TEAM_CLIFF, VESTING_TEAM_DURATION, _revocable));
        }

        // transfer funds to the grant
        transferToGrant(tokenGrants.length.sub(1), _amount);
    }

    /// @notice Transfer tokens to a grant until it is starting
    function transferToGrant(uint256 _id, uint256 _amount) public onlyOwner {
        require(_id < tokenGrants.length && _amount > 0 && now <= tokenGrants[_id].start());

        // transfer funds to the grant
        require(token.transfer(address(tokenGrants[_id]), _amount));
    }

    /// @dev Revoking grant
    function revokeGrant(uint256 _id) public onlyOwner {
        require(_id < tokenGrants.length);

        tokenGrants[_id].revoke(token);
    }

    /// @notice Returns the token grant count
    function getGrantCount() view public returns (uint) {
        return tokenGrants.length;
    }


    ////////////////
    // BURN, handle ownership - only multsig can call these functions!
    ////////////////

    /// @notice contract can burn its own or its sale tokens
    function burn(address _where, uint256 _amount) public onlyMultiSig {
        require(_where == address(this) || _where == SALE);

        require(token.destroyTokens(_where, _amount));
    }

    /// @notice replaces controller when it was not yet replaced, only multisig can do it
    function setNewController(address _controller) public onlyMultiSig {
        require(_controller != address(0) && newController == address(0));

        newController = TokenController(_controller);
        token.changeController(_controller);
        hodler.transferOwnership(_controller);

        // send eth
        uint256 _stake = this.balance;
        if (_stake > 0)
            _controller.transfer(_stake);

        // send tokens
        _stake = token.balanceOf(this);
        if (_stake > 0)
            token.transfer(_controller, _stake);
    }

    /// @notice Set new multisig wallet, to make it upgradable.
    function setNewMultisig(address _wallet) public onlyMultiSig {
        require(_wallet != address(0));

        multiSigWallet = _wallet;
    }


    ////////////////
    // When PAUSED
    ////////////////

    /// @notice set the token, if no hodler provided then creates a hodler reward contract
    function setToken(address _token, address _hodler) public onlyOwner whenPaused {
        require(_token != address(0));

        token = ERC20MiniMe(_token);


        if (_hodler != address(0)) {
            // set hodler reward contract if provided
            hodler = TravelkoinHodler(_hodler);
        } else if (hodler == address(0)) {
            // create hodler reward contract if not yet created
            hodler = new TravelkoinHodler(TOKEN_HODL_3M, TOKEN_HODL_6M, TOKEN_HODL_9M);
        }

        // MINT tokens if not minted yet
        if (token.totalSupply() == 0) {
            // sale
            token.generateTokens(SALE, TOKEN_SALE1_NORMAL.add(TOKEN_SALE2));
            // hodler reward
            token.generateTokens(address(hodler), TOKEN_HODL_3M.add(TOKEN_HODL_6M).add(TOKEN_HODL_9M));
            // bounty
            token.generateTokens(owner, TOKEN_BOUNTY);
            // community fund
            token.generateTokens(address(multiSigWallet), TOKEN_COMMUNITY);
            // team -> grantable
            token.generateTokens(address(this), TOKEN_FOUNDERS.add(TOKEN_TEAM));
            // early contributors
            token.generateTokens(CONTRIBUTOR1, TOKEN_EARLY_CONTRIBUTORS.div(2));
            token.generateTokens(CONTRIBUTOR2, TOKEN_EARLY_CONTRIBUTORS.div(2));
        }
    }


    ////////////////
    // Proxy for TravelkoinHodler contract
    ////////////////

    /// @notice Proxy call for setting hodler start time
    function setHodlerTime(uint256 _time) public onlyCrowdsale {
        hodler.setHodlerTime(_time);
    }

    /// @notice Proxy call for adding hodler stake
    function addHodlerStake(address _beneficiary, uint256 _stake) public onlyCrowdsale {
        hodler.addHodlerStake(_beneficiary, _stake);
    }

    /// @notice Proxy call for setting hodler stake
    function setHodlerStake(address _beneficiary, uint256 _stake) public onlyCrowdsale {
        hodler.setHodlerStake(_beneficiary, _stake);
    }


    ////////////////
    // MiniMe Controller functions
    ////////////////

    /// @notice No eth payment to the token contract
    function proxyPayment(address _owner) payable public returns (bool) {
        revert();
    }

    /// @notice Before transfers are enabled for everyone, only this and the crowdsale contract is allowed to distribute TKT
    function onTransfer(address _from, address _to, uint256 _amount) public returns (bool) {
        // moving any funds makes hodl participation invalid
        hodler.invalidate(_from);

        return !paused || _from == address(this) || _to == address(this) || _from == address(crowdsale) || _to == address(crowdsale);
    }

    function onApprove(address _owner, address _spender, uint256 _amount) public returns (bool) {
        return !paused;
    }

    /// @notice Retrieve mistakenly sent tokens (other than the travelkoin token) from the token contract
    function claimTokenTokens(address _token) public onlyOwner {
        require(_token != address(token));

        token.claimTokens(_token);
    }
}