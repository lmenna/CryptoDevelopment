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


  it('tranfers token ownership', function() {
    return SampleToken.deployed().then(function(instance) {
      tokenInstance = instance;
      // Test `require` statement first by transferring something larger than the sender's balance
      return tokenInstance.transfer.call(accounts[1], 9999999999999999);
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'error message expected to contain `revert` but does not.');
      return tokenInstance.transfer.call(accounts[1], 25, { from: accounts[0] });
    }).then(function(success) {
      assert.equal(success, true, 'it returns true');
      return tokenInstance.transfer(accounts[1], 25, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account tokens are transfered FROM');
      assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account tokens are transfered TO');
      assert.equal(receipt.logs[0].args._value, 25, 'logs the transfer amount');
      return tokenInstance.balanceOf(accounts[1]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 25, 'adds the amount to the receiving account')
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 1000000-25, 'deducts the amount from the sending account');
    });
  });
});
