var Ethify = artifacts.require("./Ethify.sol")


module.exports  = function(deployer){

    deployer.deploy(Ethify);
};