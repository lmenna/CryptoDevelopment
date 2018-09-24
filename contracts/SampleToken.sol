pragma solidity ^0.4.2;

contract SampleToken {

  uint256 public totalSupply;

  function SampleToken (uint256 _initialSupply) public {
    totalSupply = _initialSupply;
  }
}
