var SampleToken = artifacts.require('./SampleToken.sol');
var SampleTokenSale = artifacts.require('./SampleTokenSale.sol');

contract('SampleTokenSale', function(accounts) {
  var tokenInstance;
  var tokenSaleInstance;
  var tokenPrice = 1000000000000000;  // In wei, this is 0.001 ETH
  var admin = accounts[0];
  var buyer = accounts[1];
  var numberOfTokens;
  var tokensAvailable = 750000;

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

    it('facilitates token buying', function() {
      return SampleToken.deployed().then(function(instance) {
        tokenInstance = instance;
        return SampleTokenSale.deployed();
      }).then(function(instance) {
        tokenSaleInstance = instance;
        // Transfer some tokens to the TokenSale contract
        return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin} )
      }).then(function(receipt) {
        numberOfTokens = 10;
        return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice });
      }).then(function(receipt) {
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
        assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchasec the tokens');
        assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
        return tokenSaleInstance.tokensSold();
      }).then(function(amount) {
        assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
        return tokenInstance.balanceOf(buyer);
      }).then(function(balance) {
        assert.equal(balance.toNumber(), numberOfTokens);
        return tokenInstance.balanceOf(tokenSaleInstance.address);
      }).then(function(balance) {
        assert.equal(balance.toNumber(), tokensAvailable-numberOfTokens);
        return tokenSaleInstance.buyTokens(tokensAvailable+1, { from: buyer, value: numberOfTokens * tokenPrice });
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, 'can not purchase more tokens than available');
      });
    });

    it('end token sale', function() {
      return SampleToken.deployed().then(function(instance) {
        tokenInstance = instance;
        return SampleTokenSale.deployed();
      }).then(function(instance) {
        tokenSaleInstance = instance;
        // End sale from account other than the admin
        return tokenSaleInstance.endSale({ from: buyer });
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, 'must be admin to end sale');
        // end sale as admin
        return tokenSaleInstance.endSale({ from: admin });
      }).then(function(receipt) {
        return tokenInstance.balanceOf(admin);
      }).then(function(balance) {
        assert.equal(balance.toNumber(), 999990, 'returns all unsold dapp tokens to admin');
        // Check that the contract has no balance
        balance = web3.eth.getBalance(tokenSaleInstance.address)
        assert.equal(balance.toNumber(), 0);
      });
    });
  });
  
