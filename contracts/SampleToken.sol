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

  // ERC20 events
  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );
  event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  constructor (uint256 _initialSupply) public {
    // allocate the initial supply
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

  // Transfer
  function transfer(address _to, uint256 _value) public returns (bool success) {
    // Exception raised if account doesn't have enough tokens
    require(balanceOf[msg.sender] >= _value);
    // Transfer the balance
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    // Trigger transfer event
    emit Transfer(msg.sender, _to, _value);
    // If we made it here the function worked, return true
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success) {

    allowance[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }
}
