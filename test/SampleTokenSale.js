var SampleTokenSale = artifacts.require('./SampleTokenSale.sol');

contract('SampleTokenSale', function(accounts) {
  var tokenSaleInstance;
  var tokenPrice = 1000000000000000;  // In wei, this is 0.001 ETH

  it('initializes the contract with the correct values', function() {
      return SampleTokenSale.deployed().then(function(instance) {
        tokenSaleInstance = instance;
        return tokenSaleInstance.address;
      }).then(function(address) {
        assert.notEqual(address, 0x0, 'has contract address');
        return tokenSaleInstance.tokenContract();
      }).then(function(address) {
        assert.notEqual(address, 0x0, 'has a token contract');
        return tokenSaleInstance.tokenPrice();
      }).then(function(price) {
        assert.equal(price, tokenPrice, 'token price is correct');
      });
    });
});
