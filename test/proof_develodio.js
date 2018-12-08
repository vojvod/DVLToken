const ProofDevelodio = artifacts.require("./ProofDevelodio.sol");

contract("ProofDevelodio", accounts => {

    const firstname = 'MyFirstName';
    const lastname = 'MyLastName';
    const email = 'Myemail';
    const comments = 'MyComments';
    const fileHash = '0xdd870fa1b7c4700f2bd7f44238821c26f7392148';
    const ipfsHash = "Qmb1E7YpmnQYEqRKcr6WjTFgKubYkWtN4PzdwKp6Tud3TA";
    const ipfsFileType = "test.pdf";

    it('should add new file if value is 5000000000000000', () => {
        let ProofDevelodioInstance;
        return ProofDevelodio.deployed()
            .then(instance => {
                ProofDevelodioInstance = instance;
                return ProofDevelodioInstance.setFile(firstname, lastname, email, fileHash, ipfsHash, ipfsFileType, comments, {from: accounts[0], value: 5000000000000000});
            })
            .then(setfile => {
                return ProofDevelodioInstance.getFile(fileHash);
            })
            .then(getfile => {
                assert.equal(getfile.ipfsHash, ipfsHash, "file has not been added");
            });
    });

    it('should addOwner if sender is the main file owner', () => {
        let ProofDevelodioInstance;
        return ProofDevelodio.deployed()
            .then(instance => {
                ProofDevelodioInstance = instance;
                return ProofDevelodioInstance.setFile(firstname, lastname, email, fileHash, ipfsHash, ipfsFileType, comments, {from: accounts[0], value: 5000000000000000});
            })
            .then(setFile => {
                return ProofDevelodioInstance.addOwner(firstname, lastname, email, fileHash, {from: accounts[0], value: 5000000000000000})
            })
            .then(addOner => {
                return ProofDevelodioInstance.getFileOwner(fileHash, 1)
            })
            .then(newOwner => {
                assert.equal(firstname, newOwner.ownerFirstName, "owner has not been added");
            });
    });

    it('should removeOwner if sender is the main file owner', () => {
        let ProofDevelodioInstance;
        return ProofDevelodio.deployed()
            .then(instance => {
                ProofDevelodioInstance = instance;
                return ProofDevelodioInstance.setFile(firstname, lastname, email, fileHash, ipfsHash, ipfsFileType, comments, {from: accounts[0], value: 5000000000000000});
            })
            .then(setFile => {
                return ProofDevelodioInstance.addOwner(firstname, lastname, email, fileHash, {from: accounts[0], value: 5000000000000000})
            })
            .then(addOner => {
                return ProofDevelodioInstance.removeOwner(fileHash, 1)
            })
            // .then(removeOwner => {
            //     return ProofDevelodioInstance.getFileOwner(fileHash, 1)
            // })
            .then(getFileOwner => {
                assert.notEqual(firstname, getFileOwner.ownerFirstName, "owner has not been removed");
            });
    });

});

// ProofDevelodio.web3.eth.getGasPrice(function(error, result){
//     var gasPrice = Number(result);
//     console.log("Gas Price is " + gasPrice + " wei"); // "10000000000000"
// });