pragma solidity ^0.4.2;

contract SampleToken {

  // ERC20 variables
  // name is ERC20 optional
  string public name = "Sample Token";
  // symbol is ERC20 optional
  string public symbol = "SAM";

  // Not ERC20
  // standard is not part of ERC20
  string public standard = "Sample Token v1.0";
  uint256 public totalSupply;

  mapping(address => uint256) public balanceOf;

  function SampleToken (uint256 _initialSupply) public {
    // allocate the initial supply
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }
}
