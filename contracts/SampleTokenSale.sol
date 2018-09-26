pragma solidity ^0.4.2;

import "./SampleToken.sol";

contract SampleTokenSale {

  address admin;
  SampleToken public tokenContract;
  uint256 public tokenPrice;

  constructor(SampleToken _tokenContract, uint256 _tokenPrice) public {
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }
}
