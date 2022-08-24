// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.16;

contract Ethify{


    struct Message{
        address sender;
        bytes32 content;
        uint timestamp;
    }

    struct ContractProperties{
        address EthifyOwner;
        address[] registeredUserAdderss;
    }

    struct Inbox{
        uint numSentMessages;
        uint numRecievedMessages;
        mapping(uint => Message) sentMessages;
        mapping(uint => Message) recievedMessages;
    }

    mapping (address => Inbox) userInboxes;
    mapping (address => bool) hasRegistered;

    Inbox newInbox;
    Message newMessage;
    
    ContractProperties contractProperties;

    function ethify() public{
         
         contractProperties.EthifyOwner = msg.sender;
    }

    function getContractProperties() public view returns(address, address[] memory){

        return (contractProperties.EthifyOwner, contractProperties.registeredUserAdderss);
    }
}