[![PR's Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com) 

# Ethify
<br></br>
## Approach-:
Ethify is an ethereum messenger which users can use to send and recieve messages. This messenger contains two parts:


Smart Contract -: These contracts have different methods defined in them which helps
helps the user to interact with the blockchain, send - recieve messages, get a user registered 
and much more.
  

Web Interface -:  For users to interact with the contract a web interface is created using languages like javascript,
html and css. Libraries like web3.js and ether.js are used to allow the web-interface interact 
with the smart contract.

<br></br>      


## Requirements -: 

One of the basic requirements is node.js which you download and install from https://nodejs.org/en/. Node.js will 
be used to install all the further requirements. Follow the procedure given below to install them and
interact with the application.

<br></br>



## How to Use
<br></br>

* Clone the repository using :

        $ git clone https://github.com/DhaivatV/Ethify.git
                
* Enter the directory using:

        $ cd  Ethify/
        
* Install the truffle using:

        $ npm install -g truffle
      
* Install the requirements using:

        $ npm i
       
* From below link download and install Ganache :

        https://trufflesuite.com/ganache/
        * Open Ganache
        * Click on Quickstart
        
<img align="center" alt="coding" width=400 src="https://media.geeksforgeeks.org/wp-content/uploads/20200726165245/ganacheintro-660x439.png">
        
* Now you will get 10 default accounts for your blockchain at a local RPC server HTTP://127.0.0.1:7545 as below- :

<img align="center" alt="coding" width=400 src="https://media.geeksforgeeks.org/wp-content/uploads/20200726165547/ganachelogin-660x437.png">

* Import one one of the default accounts in your MetaMask wallet using the given private key.

* Go to the Ethify directory where you cloned the repository and open command prompt:
<br></br>
        * Now to deploy the contracts do -:
        
        $ truffle deploy
       
* To start the server:

        $ npm run dev
        
* <h3> Now go to the localhost and playaround with the Ethify Messenger.</h3>

* <h3> Enjoy!! 😌😌</h3>

<br></br>

      

## Author
* Dhaivat Vipat


## Contribution 

Contributions are always welcome! You can contribute to this project in the following way:
- [ ] Bug fixes if any


