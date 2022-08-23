// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

contract Ethify{

    struct ContractProperties{
        address EthifyOwner;
        address[] registeredUserAdderss;
    }

    ContractProperties contractProperties;

    function ethify() public{
         
         contractProperties.EthifyOwner = msg.sender;
    }

    function getContractProperties() public view returns(address, address[] memory){

        return (contractProperties.EthifyOwner, contractProperties.registeredUserAdderss);
    }
}