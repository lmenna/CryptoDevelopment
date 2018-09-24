var SampleToken = artifacts.require("./SampleToken.sol");

module.exports = function(deployer) {
  deployer.deploy(SampleToken, 1000000);
};
