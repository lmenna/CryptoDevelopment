App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function() {
    console.log("initWeb3");
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    console.log("initContracts");
    $.getJSON("SampleTokenSale.json", function(SampleTokenSale) {
        App.contracts.SampleTokenSale = TruffleContract(SampleTokenSale);
        App.contracts.SampleTokenSale.setProvider(App.web3Provider);
        App.contracts.SampleTokenSale.deployed().then(function(SampleTokenSale) {
         console.log("Sample Token Sale Address:", SampleTokenSale.address);
       });
     }).done(function() {
       $.getJSON("SampleToken.json", function(SampleToken) {
          App.contracts.SampleToken = TruffleContract(SampleToken);
          App.contracts.SampleToken.setProvider(App.web3Provider);
          App.contracts.SampleToken.deployed().then(function(SampleToken) {
          console.log("Sample Token Address:", SampleToken.address);
          });
      });
    });
    return App.render();
},

render: function() {
  // Load account data
  web3.eth.getCoinbase(function(err, account) {
    if(err === null) {
      App.account = account;
      $('#accountAddress').html("Your Account:" + account);
    }
  })
}
}

$(function() {
  $(window).load(function() {
    App.init();
  })
});
