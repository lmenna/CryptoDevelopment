var SampleToken = artifacts.require("./SampleToken.sol");

contract('SampleToken', function(accounts) {
  var tokenInstance;

  it('Initializes the contract with the correct values', function() {
      return SampleToken.deployed().then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.name();
      }).then(function(name) {
        assert.equal(name, 'Sample Token', 'has the correct name')
        return tokenInstance.symbol();
      }).then(function(symbol) {
        assert.equal(symbol, 'SAM', 'has the correct symbol');
        return tokenInstance.standard();
      }).then(function(standard) {
        assert.equal(standard, 'Sample Token v1.0', 'has the correct standard');
      });
  });


  it('Allocates the initial token supply upon deployment', function() {
    return SampleToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 1000000, 'Expected total supply to be 1,000,000');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(adminBalance) {
      assert.equal(adminBalance.toNumber(), 1000000, 'Expected initial supply to be in the admin account')
    });
  });
});
