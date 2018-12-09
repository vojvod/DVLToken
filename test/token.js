const DVLToken = artifacts.require("./DVLToken.sol");

contract("DVLToken", accounts => {

  it('should put 1000000000000 DVLToken in the first account', () => {
    return DVLToken.deployed().then(function(instance) {
      return instance.balanceOf(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 1000000000000, "1000000000000 wasn't in the first account");
    });
  });

  it("should send coin correctly", function() {
    var dvl;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return DVLToken.deployed().then(function(instance) {
      dvl = instance;
      return dvl.balanceOf(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return dvl.balanceOf(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return dvl.transfer(account_two, amount, {
        from: account_one
      });
    }).then(function() {
      return dvl.balanceOf(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return dvl.balanceOf(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();
      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });

})