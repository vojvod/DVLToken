let DVLToken = artifacts.require("./DVLToken.sol");

module.exports = function(deployer) {
  deployer.deploy(DVLToken);
};
