const ProofDevelodio = artifacts.require("./ProofDevelodio.sol");

contract("ProofDevelodio", accounts => {

    const firstname = 'MyFirstName';
    const lastname = 'MyLastName';
    const email = 'Myemail';
    const comments = 'MyComments';
    const fileHash = '0xdd870fa1b7c4700f2bd7f44238821c26f7392148';
    const ipfsHash = "Qmb1E7YpmnQYEqRKcr6WjTFgKubYkWtN4PzdwKp6Tud3TA";
    const ipfsFileType = "test.pdf";

    const payValue = 5000000000000000;

    it('should add new file if value is payValue', () => {
        let ProofDevelodioInstance;
        return ProofDevelodio.deployed()
            .then(instance => {
                ProofDevelodioInstance = instance;
                return ProofDevelodioInstance.setFile(firstname, lastname, email, fileHash, ipfsHash, ipfsFileType, comments, {from: accounts[0], value: payValue});
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
                return ProofDevelodioInstance.setFile(firstname, lastname, email, fileHash, ipfsHash, ipfsFileType, comments, {from: accounts[0], value: payValue});
            })
            .then(setFile => {
                return ProofDevelodioInstance.addOwner('simos', 'taskaris', email, fileHash, {from: accounts[0], value: payValue})
            })
            .then(addOner => {
                return ProofDevelodioInstance.getFileOwner(fileHash, 1)
            })
            .then(newOwner => {
                assert.equal('simos', newOwner.ownerFirstName, "owner has not been added");
            });
    });

    it('should removeOwner if sender is the main file owner', () => {
        let ProofDevelodioInstance;
        return ProofDevelodio.deployed()
            .then(instance => {
                ProofDevelodioInstance = instance;
                return ProofDevelodioInstance.setFile(firstname, lastname, email, fileHash, ipfsHash, ipfsFileType, comments, {from: accounts[0], value: payValue});
            })
            .then(setFile => {
                return ProofDevelodioInstance.addOwner('simos', lastname, email, fileHash, {from: accounts[0], value: payValue})
            })
            .then(addOwner0 => {
                return ProofDevelodioInstance.addOwner('elpis', lastname, email, fileHash, {from: accounts[0], value: payValue})
            })
            .then(addOwner1 => {
                return ProofDevelodioInstance.removeOwner(fileHash, 1, {from: accounts[0], value: payValue})
            })
            .then(removeOwner => {
                return ProofDevelodioInstance.getFileOwner(fileHash, 1)
            })
            .then(results => {
                assert.equal('simos', results.ownerFirstName, "owner has not been removed");
            });
    });

});

// ProofDevelodio.web3.eth.getGasPrice(function(error, result){
//     var gasPrice = Number(result);
//     console.log("Gas Price is " + gasPrice + " wei"); // "10000000000000"
// });