const {web3} = require('web3');
var myInboxSize = 0;


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
      
      
    checkUserRegistration: function(){
      var self = this;
    self.setStatus("Checking user registration...please wait");
    var meta;
    App.contracts.Ethify.deployed().then(async function(instance) {
      meta = instance;
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      return meta.checkUserRegistration.call({from: account});
    }).then(function(value) {
      if (value) {
        self.setStatus("User is registered...ready");
      } else {
        if (confirm("New user: we need to setup an inbox for you on the Ethereum blockchain. For this you will need to submit a transaction in MetaMask. You will only need to do this once.")) {
          App.registerUser();
        } else {
          return null;
        }
      }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error checking user registration; see log");
    });
    return App.getMyInboxSize();

    },


    registerUser: function(){

      var self = this;
      self.setStatus("User registration:(open MetaMask->submit->wait)");
      var meta;
      App.contracts.Ethify.deployed().then(async function(instance) {
        meta = instance;
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        return meta.registerUser({}, {
          from: account,
          gas: 6385876,
          gasPrice: 20000000000
        });
      }).then(function(result) {
        var gasUsedWei = result.receipt.gasUsed;
        var gasUsedEther = ether.utils.formatEther(gasUsedWei);
        self.setStatus("User is registered...gas spent: " + gasUsedEther + "(ethers)");
        alert("A personal inbox has been established for you on the Ethereum blockchain. You're all set!");
      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error logging in; see log");
      });
      return null;
    },

    getMyInboxSize: function(){

      var self = this;
      var meta;
      App.contracts.Ethify.deployed().then(async function(instance) {
        meta = instance;
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0]; 
        return meta.getMyInboxSize.call({from: account});
      }).then(function(value) {
        // Set global variable
        myInboxSize = value[1];
        if (myInboxSize > 0) {
          document.getElementById("receivedTable").style.display = "inline";
          return App.receiveMessages();
        } else {
          document.getElementById("receivedTable").style.display = "none";
          return null;
        }
      }).catch(function(e) {
        console.log(e);
        self.setStatus("");
      });
    },

    sendMessage: function() {
      var self = this;
      var receiver = document.getElementById("receiver").value;
      if (receiver == "") {
        App.setStatus("Send address cannot be empty");
        return null;
      }
      if (!ethers.utils.isAddress(receiver)) {
        App.setStatus("You did not enter a valid Ethereum address");
        return null;
      }
      var myAddress = document.getElementById("myAdderss").innerHTML;
      
      var newMessage = document.getElementById("message").value;
      if (newMessage == "") {
        App.setStatus("Oops! Message is empty");
        return null;
      }
      document.getElementById("message").value = "";
      document.getElementById("sendMessageButton").disabled = true;
      this.setStatus("Sending message:(open MetaMask->submit->wait)");
      var meta;
      App.contracts.Ethify.deployed().then(async function(instance) {
        meta = instance;
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0]; 
        return meta.sendMessage(receiver, newMessage, {
          from: account,
          gas: 6385876,
          gasPrice: 20000000000
        });
      }).then(function(result) {
        console.log(result);
        var gasUsedWei = result.receipt.gasUsed;
        var gasUsedEther = ethers.utils.formatEther(gasUsedWei);
        self.setStatus("Message successfully sent...gas spent: " + gasUsedWei + " Wei");
        document.getElementById("sendMessageButton").disabled = false;
        document.getElementById("message").value = "";
      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error sending message; see log");
      });

    },

    receiveMessages: function() {
      var self = this;
      var meta;
      App.contracts.Ethify.deployed().then(async function(instance) {
        meta = instance;
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0]; 
        return meta.receiveMessages.call({}, {from: account});
      }).then(function(value) {
        var content = value[0];
        var timestamp = value[1];
        var sender = value[2];
        for (var m = 0; m < myInboxSize; m++) {
          var tbody = document.getElementById("mytable-tbody");
          var row = tbody.insertRow();
          var cell1 = row.insertCell();
          cell1.innerHTML = timestamp[m];
          var cell2 = row.insertCell();
          cell2.innerHTML = sender[m];
          var cell3 = row.insertCell();
  
          var thisRowReceivedText = content[m].toString();
          var receivedAscii = ethers.utils.parseBytes32String(thisRowReceivedText);
          var thisRowSenderAddress = sender[m];
          console.log(receivedAscii);
          cell3.innerHTML = receivedAscii;
          cell3.hidden = true;
        }
        var table = document.getElementById("mytable");
        var rows = table.rows;
        for (var i = 1; i < rows.length; i++) {
          rows[i].onclick = (function(e) {
            replyToAddress = this.cells[1].innerHTML;
            var thisRowContent = (this.cells[2].innerHTML);
            document.getElementById("reply").innerHTML = thisRowContent;
          });
        }
        // create inbox clear all button
        var clearInboxButton = document.createElement("button");
        clearInboxButton.id = "clearInboxButton";
        clearInboxButton.type = "clearInboxButton";
        clearInboxButton.disabled = false;
        clearInboxButton.style.width = "100%";
        clearInboxButton.style.height = "30px";
        clearInboxButton.style.margin = "15px 0px";
        clearInboxButton.innerHTML = "Clear inbox";
        document.getElementById("receivedTable").appendChild(clearInboxButton);
        clearInboxButton.addEventListener("click", function() {
          document.getElementById("clearInboxButton").disabled = true;
          App.clearInbox();
        });
      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error getting messages; see log");
      });
      return;
    },

    clearInbox: function() {
      var self = this;
      var meta;
      this.setStatus("Clearing inbox:(open MetaMask->submit->wait)");
      App.contracts.Ethify.deployed().then(async function(instance) {
        meta = instance;
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0]; 
        return meta.clearInbox({}, {
          from: account,
          gas: 6385876,
          gasPrice: 20000000000
        });
      }).then(function(value) {
        var clearInboxButton = document.getElementById("clearInboxButton");
        clearInboxButton.parentNode.removeChild(clearInboxButton);
        $("#mytable tr").remove();
        document.getElementById("receivedTable").style.display = "none";
        alert("Your inbox was cleared");
        self.setStatus("Inbox cleared");
      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error clearing inbox; see log");
      });
    },

    replyToMessage: function() {
      document.getElementById("message").focus();
      document.getElementById("message").select();
      document.getElementById("receiver").value = replyToAddress;
    },
  
    copyAddressToSend: function() {
      var sel = document.getElementById("registeredUsersAddressMenu");
      var copyText = sel.options[sel.selectedIndex];
      document.getElementById("receiver").value = copyText.innerHTML;
      document.getElementById("message").focus();
      document.getElementById("message").select();
    },
  
  




    

    
    

    setStatus: function(message) {
        document.getElementById("status").innerHTML = message;
       
        },


        
      };

$(document).ready(function(){
    
    App.init();

});