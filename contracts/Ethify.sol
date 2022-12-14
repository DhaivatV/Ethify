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
        uint numReceivedMessages;
        mapping(uint => Message) sentMessages;
        mapping(uint => Message) receivedMessages;
    }

    mapping (address => Inbox) userInboxes;
    mapping (address => bool) hasRegistered;

    
    Message newMessage;
    
    ContractProperties contractProperties;

    function ethify() public{
         
         contractProperties.EthifyOwner = msg.sender;
    }

    function checkUserRegistration() public view returns(bool){
        return hasRegistered[msg.sender];
    }

    function clearInbox() public view {
        Inbox storage newInbox;
        newInbox = userInboxes[msg.sender];
    }

    function registerUser() public {
        if (!hasRegistered[msg.sender]){
            Inbox storage newInbox;
            newInbox = userInboxes[msg.sender];
            hasRegistered[msg.sender] = true;
            contractProperties.registeredUserAdderss.push(msg.sender);
        }
    }


    function getContractProperties() public view returns(address, address[] memory){

        return (contractProperties.EthifyOwner, contractProperties.registeredUserAdderss);
    }

    function sendMessage(address _receiver, bytes32 _content) public {
        newMessage.content = _content;
        newMessage.timestamp = block.timestamp;
        newMessage.sender = msg.sender;
        // Update senders inbox
        Inbox storage sendersInbox = userInboxes[msg.sender];
        sendersInbox.sentMessages[sendersInbox.numSentMessages] = newMessage;
        sendersInbox.numSentMessages++;

        // Update receivers inbox
        Inbox storage receiversInbox = userInboxes[_receiver];
        receiversInbox.receivedMessages[receiversInbox.numReceivedMessages] = newMessage;
        receiversInbox.numReceivedMessages++;
        return;
    }
    
    function receiveMessages() public view returns (bytes32[16] memory, uint[] memory, address[] memory) {
        Inbox storage receiversInbox = userInboxes[msg.sender];
        bytes32[16] memory content;
        address[] memory sender = new address[](16);
        uint[] memory timestamp = new uint[](16);
        for (uint m = 0; m < 15; m++) {
            Message memory message = receiversInbox.receivedMessages[m];
            content[m] = message.content;
            sender[m] = message.sender;
            timestamp[m] = message.timestamp;
        }
        return (content, timestamp, sender);
    }

    function getMyInboxSize() public view returns (uint, uint) {
        return (userInboxes[msg.sender].numSentMessages, userInboxes[msg.sender].numReceivedMessages);
    }

}