App = {

  
  
    web3Provider: null,
    contracts: {},
  
    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {
      // Initialize web3 and set the provider to the testRPC.
      if (window.ethereum) {
        // Use Mist/MetaMask's provider
        App.web3Provider = window.ethereum;
        App.setStatus("MetaMask detected");
        console.log("MetaMask Detected")
        
      } else {
        // set the provider you want from Web3.providers
        alert("Error: Please install MetaMask then refresh the page.")
        var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        return null;
      }

      async function onInit() {
        await window.ethereum.enable();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log(account)
         window.ethereum.on('accountsChanged', function (accounts) {
            // Time to reload your interface with accounts[0]!
            console.log(accounts[0]);
            return accounts[0];
           });
    }

    onInit();
  
      // Get the initial account balance so it can be displayed.
      // web3.eth(function(err, accs) {
      //   if (err != null) {
      //     alert("There was an error fetching your account, please try again later.");
      //     return;
      //   }
      //   account = accs[0];
      //   if (!account) {
      //     App.setStatus("Please login to MetaMask");
      //     alert("Could not fetch your account. Make sure you are logged in to MetaMask, then refresh the page.");
      //     return;
      //   }
      //   return App.initContract();
      // });
    },
   
    initContract: function() {
      $.getJSON('Ethify.json', function(EthifyArtifact) {
        // Get the necessary contract artifact file and use it to instantiate a truffle contract abstraction.
        App.contracts.Ethify = TruffleContract(EthifyArtifact);
        // Set the provider for our contract.
        App.contracts.Ethify.setProvider(App.web3Provider);
        return App.getContractProperties();
      });
    },
  
    getContractProperties: function() {
      var self = this;
      var meta;
      App.contracts.Ethify.deployed().then(function(instance) {
        meta = instance;
        return meta.getContractProperties.call({from: account});
      }).then(function(value) {
        var networkAddress = App.contracts.Ethify.address;
        document.getElementById("contractAddress").innerHTML = networkAddress;
        var by = value[0];
        var registeredUsersAddress = value[1];
        var numRegisteredUsers = registeredUsersAddress.length;
        var select = '';
        for (i = 0; i < numRegisteredUsers; i++) {
          select += '<option val=' + i + '>' + registeredUsersAddress[i] + '</option>';
        }
        $('#registeredUsersAddressMenu').html(select);
        document.getElementById("contractOwner").innerHTML = by;
      }).catch(function(e) {
        console.log(e);
        self.setStatus("");
      });
      return App.displayMyAccountInfo();
    },


    displayMyAccountInfo: function() {
      web3.eth.getAccounts(function(err, account) {
        if (err === null) {
          App.account = account;
          document.getElementById("myAddress").innerHTML = account;
          web3.eth.getBalance(account[0], function(err, balance) {
            if (err === null) {
              if (balance == 0) {
                alert("Your account has zero balance. You must transfer some Ether to your MetaMask account to be able to send messages with ChatWei. Just come back and refresh this page once you have transferred some funds.");
                App.setStatus("Please buy more Ether");
                return;
              } else {
                document.getElementById("myBalance").innerHTML = web3.fromWei(balance, "ether").toNumber() + " Ether";
                return App.checkUserRegistration();
              }
            } else {
              console.log(err);
            }
          });
        }
      });
      return null;
    },

    setStatus: function(message) {
        document.getElementById("status").innerHTML = message;
       
        },

    checkUserRegistration : function(){},

    copyAddressToSend: function(){},
        

$(document).ready(function(){
    App.init();

});