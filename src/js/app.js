const {web3} = require('web3');



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

      return App.getAccounts();

    },

    getAccounts: async function () {
      
      App.setStatus("Login to MetaMask and refresh the page.");
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }).catch(function(e){
        
        App.setStatus("Login to MetaMask and refresh the page")
        alert("Please Login to MetaMask")
      });
      
      const account = accounts[0];
      console.log(account)
      
      window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        // console.log(accounts[0]);
        return accounts[0]});

      App.setStatus("Welcome To Ethify")

      return App.initContract();
      
         
    },

   
   
    initContract: function(){
      
      $.getJSON('Ethify.json', function(EthifyArtifact) {
        App.contracts.Ethify = TruffleContract(EthifyArtifact);
        // Set the provider for our contract.
        App.contracts.Ethify.setProvider(App.web3Provider);
        console.log("Contract Executed");
        return App.getContractProperties();
      
      });

    },

     
   
    

    getContractProperties: function() {
      console.log("Contract Properties")
      var self = this;
      var meta;
      App.contracts.Ethify.deployed().then(async function(instance) {
        meta = instance;
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        
        return meta.getContractProperties.call({from: account});
      }).then(function(value) {
        
        var networkAddress = App.contracts.Ethify.address;
        document.getElementById("contractAddress").innerHTML = networkAddress;
        var by = value;
      
        var registeredUsersAddress = value;
        
        var numRegisteredUsers = registeredUsersAddress.length;
        var select = '';
        if (numRegisteredUsers > 1) {
          
          for (i = 0; i < numRegisteredUsers; i++) {
            select += '<option val=' + i + '>' + registeredUsersAddress[i] + '</option>';
          }
          $('#registeredUsersAddressMenu').html(select);
          document.getElementById("contractOwner").innerHTML = registeredUsersAddress[0];
        }
        else {
          $('#registeredUsersAddressMenu').html(select);
          document.getElementById("contractOwner").innerHTML = registeredUsersAddress[0];

        }
       
      }).catch(function(e) {
        console.log(e);
        self.setStatus("");
      });
      return App.displayMyAccountInfo();
    },


    displayMyAccountInfo: async function() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        
        document.getElementById("myAdderss").innerHTML = account;
        balanceInWei =await  window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']}) ;
        balance = ethers.utils.formatEther(balanceInWei)
        console.log(balance);
          
        if (balance == 0) {
          alert("Your account has zero balance. You must transfer some Ether to your MetaMask account to be able to send messages with ChatWei. Just come back and refresh this page once you have transferred some funds.");
          App.setStatus("Please buy more Ether");
          return;
      } else {
          document.getElementById("myBalance").innerHTML = balance + " Ether";
          return App.checkUserRegistration();
        }
     
        },
      
      
    checkUserRegistration: function(){},
    

    setStatus: function(message) {
        document.getElementById("status").innerHTML = message;
       
        },

    // checkUserRegistration : function(){},

    // copyAddressToSend: function(){},
        
      };

$(document).ready(function(){
    
    App.init();

});