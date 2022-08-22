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
            console.log(accounts[0])
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

    initContract: function(){},

    getCOntractProperties: function(){},

    setStatus: function(message) {
        document.getElementById("status").innerHTML = message;
    }

    

}

$(document).ready(function(){
    App.init();

});