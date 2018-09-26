var SampleToken = artifacts.require("./SampleToken.sol");
var SampleTokenSale = artifacts.require("./SampleTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(SampleToken, 1000000).then(function(){
    var tokenPrice = 1000000000000000;  // In wei, this is 0.001 ETH
    return deployer.deploy(SampleTokenSale, SampleToken.address, tokenPrice);
  });
};
