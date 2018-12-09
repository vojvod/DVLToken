const DVLToken = artifacts.require("./DVLToken.sol");

contract("DVLToken", accounts => {

  it('should put 1000000000000 DVLToken in the first account', () => {
    return DVLToken.deployed().then(function(instance) {
      return instance.balanceOf.call(accounts[0]);
    }).then(function(balance) {
      console.log(balance);
      assert.equal(balance.valueOf(), 1000000000000, "1000000000000 wasn't in the first account");
    });
  });

})
