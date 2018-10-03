App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,
  tokensAvailable: 750000,

  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function() {
    console.log("initWeb3");
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      console.log("Using metamask.")
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      var localhost = 'http://localhost:7545';
      console.log("Using " + localhost)
      App.web3Provider = new Web3.providers.HttpProvider(localhost);
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    console.log("BEGIN: initContracts");
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
          App.listenForEvents();
          console.log("END: initContracts");
          return App.render();
      });
    });
},

// Listen for events emitted from the contract
listenForEvents: function() {
    App.contracts.SampleTokenSale.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("Event triggered ", event);
        App.render();
      })
    })
},

render: function() {
  if(App.loading) {
    return;
  }
  App.loading = true;

  var loader = $('#loader');
  var content = $('#content');

  loader.show();
  content.hide();

  // Load account data
  web3.eth.getCoinbase(function(err, account) {
    if(err === null) {
      App.account = account;
      $('#accountAddress').html("Your Account:" + account);
    }
  });

  // Load token sale contract
  App.contracts.SampleTokenSale.deployed().then(function(instance) {
    SampleTokenSaleInstance = instance;
    return SampleTokenSaleInstance.tokenPrice();
  }).then(function(tokenPrice) {
    App.tokenPrice = tokenPrice;
    console.log("tokenPrice:", tokenPrice);
    $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
    return SampleTokenSaleInstance.tokensSold();
  }).then(function(tokensSold) {
    App.tokensSold = tokensSold.toNumber();
    $('.tokens-sold').html(App.tokensSold);
    $('.tokens-available').html(App.tokensAvailable);

    var progressPercent = 100*(App.tokensSold / App.tokensAvailable);
    $('#progress').css('width', progressPercent+'%');
    console.log('Progress percentage: ' + progressPercent+'%');

    // Load token contract
    App.contracts.SampleToken.deployed().then(function(instance){
      SampleTokenInstance = instance;
      return SampleTokenInstance.balanceOf(App.account);
    }).then(function(balance) {
      $('.sample-token-balance').html(balance.toNumber());
      // Update screen state only when all of the async activity is finished.
      console.log("All async methods are done.  Update the screen.")
      App.loading = false;
      loader.hide();
      content.show();
    });
  });
},

buyTokens: function() {
  console.log("BEGIN: buyTokens()");
  $('#content').hide();
  $('#loader').show();
  var numberOfTokens = $('#numberOfTokens').val();
  console.log("About to buy: " + numberOfTokens + " tokens");
  console.log("Account: " + App.account);
  App.contracts.SampleTokenSale.deployed().then(function(instance) {
    return instance.buyTokens(numberOfTokens, {
      from: App.account,
      value: numberOfTokens * App.tokenPrice,
      gas: 500000
    });
  }).then(function(result) {
    console.log("Tokens bought...");
    $('form').trigger('reset');
  })
  .catch((err) => {
    console.log("Caught an error while buying tokens: " + err);
    $('form').trigger('reset');
    App.render();
  })
  console.log("END: buyTokens()");
}
}


$(function() {
  $(window).load(function() {
    App.init();
  })
});
