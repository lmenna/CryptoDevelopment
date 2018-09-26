pragma solidity ^0.4.2;

import "./SampleToken.sol";

contract SampleTokenSale {

  address admin;
  SampleToken public tokenContract;
  uint256 public tokenPrice;
  uint256 public tokensSold;

  // Events
  event Sell(address _buyer, uint256 _amount);

  constructor(SampleToken _tokenContract, uint256 _tokenPrice) public {
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }

  // safe multiply
  function multiply(uint x, uint y) internal pure returns(uint z) {
    require(y == 0 || (z = x * y) / y == x);
  }

  function buyTokens(uint256 _numberOfTokens) public payable {
    require(msg.value == multiply(_numberOfTokens, tokenPrice));
    require(tokenContract.balanceOf(this) >= _numberOfTokens);
    // This is where the msg.sender actually buys the tokens
    require(tokenContract.transfer(msg.sender, _numberOfTokens));
    tokensSold += _numberOfTokens;
    emit Sell(msg.sender, _numberOfTokens);
  }

  function endSale() public {
    require(msg.sender == admin);
    require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
    admin.transfer(address(this).balance);
  }
}
