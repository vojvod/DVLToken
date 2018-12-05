pragma solidity >=0.4.22 <0.6.0;

interface Token { 
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
}

contract tokenRecipient {
    event receivedTokens(address _from, uint256 _value, address _token, bytes _extraData);
    function receiveApproval(address _from, uint256 _value, address _token, bytes memory _extraData) public; 
}

contract ProofDevelodio
{
    address private _owner;

    // The stored balance of tokens associated with the user
    mapping (address => uint256) public payers;

    struct OwnerDetails {
        string firstname;
        string lastname;
        string email;
    }

    mapping(string => mapping(uint => OwnerDetails)) _owners;

    struct FileDetails {
        uint timestamp;
        uint blockNumber;
        uint ownerNumbers;
        address mainOwner;
        string ipfsHash;
        string ipfsFileType;
        string comments;
    }

    mapping(string => FileDetails) _files;

    modifier validOwner() {
        require(msg.sender == _owner);
        _;
    }

    modifier validValue() {
        require(msg.value >= 5000000000000000);
        _;
    }

    modifier validMainFileOwner(string memory fileHash) {
        require(msg.sender == _files[fileHash].mainOwner);
        _;
    }

    event logFileAddedStatus(bool status, uint timestamp, string firstname, string lastname, string email, string fileHash, string ipfsHash, string ipfsFileType);

    constructor() public {
        _owner = msg.sender;
    }

    function() external payable {}

    /**
     * Set allowance for other address and notify
     *
     * Allows user to pay for a service with approveAndCall()
     *
     * @param _from is the address of the user
     * @param _value is the tokens the user deposited to the service contract
     * @param _token is the address of the token contract
     * @param _extraData is additional data (optional)
     */
    function receiveApproval(address _from, uint256 _value, address _token, bytes memory _extraData) public {
        Token t = Token(_token);
        require(t.transferFrom(_from, address(this), _value));
        payers[_from] += _value;
        //ReceivedTokens(_from, _value, _token, _extraData);
    }

    function withdraw(address payable to, uint amount) validOwner public {
        require(address(this).balance >= amount);
        to.transfer(amount);
    }

    function setFile(string memory firstname, string memory lastname, string memory email, string memory fileHash, string memory ipfsHash, string memory ipfsFileType, string memory comments) validValue public payable {
        if (_files[fileHash].timestamp == 0) {
            _owners[fileHash][0] = OwnerDetails(firstname, lastname, email);
            _files[fileHash] = FileDetails(block.timestamp, block.number, 0, msg.sender, ipfsHash, ipfsFileType, comments);
            emit logFileAddedStatus(true, block.timestamp, firstname, lastname, email, fileHash, ipfsHash, ipfsFileType);
        }
        else {
            emit logFileAddedStatus(false, block.timestamp, firstname, lastname, email, fileHash, ipfsHash, ipfsFileType);
        }
    }

    function addOwner(string memory firstname, string memory lastname, string memory email, string memory fileHash) validValue validMainFileOwner(fileHash) public payable {
        if (_files[fileHash].timestamp != 0) {
            _files[fileHash].ownerNumbers++;
            _owners[fileHash][_files[fileHash].ownerNumbers] = OwnerDetails(firstname, lastname, email);
        }
    }

    function removeOwner(string memory fileHash, uint ownerNumber) validValue validMainFileOwner(fileHash) public payable {
        require(ownerNumber > 0);
        if (_files[fileHash].timestamp != 0) {
            require(_files[fileHash].ownerNumbers >= ownerNumber);
            uint8 replace = 0;
            uint length = _files[fileHash].ownerNumbers;
            for(uint i = 0; i <= length; i++) {
                if (1 == replace) {
                        _owners[fileHash][i-1] = _owners[fileHash][i];
                    } else if (keccak256(abi.encodePacked(_owners[fileHash][ownerNumber].firstname)) == keccak256(abi.encodePacked(_owners[fileHash][i].firstname))
                    && keccak256(abi.encodePacked(_owners[fileHash][ownerNumber].lastname)) == keccak256(abi.encodePacked(_owners[fileHash][i].lastname))
                    && keccak256(abi.encodePacked(_owners[fileHash][ownerNumber].email)) == keccak256(abi.encodePacked(_owners[fileHash][i].email))) {
                        replace = 1;
                }
            }
            assert(replace == 1);
            delete _owners[fileHash][length];
            _files[fileHash].ownerNumbers--;
        }
    }

    function getFile(string memory fileHash) public view returns (
        uint timestamp,
        uint blockNumber,
        string memory ipfsHash,
        string memory ipfsFileType,
        uint ownerNumbers,
        string memory comments)
    {
        FileDetails memory fileDetails = _files[fileHash];
        return (
            fileDetails.timestamp,
            fileDetails.blockNumber,
            fileDetails.ipfsHash,
            fileDetails.ipfsFileType,
            fileDetails.ownerNumbers,
            fileDetails.comments
        );
    }

    function getMainFileOwner(string memory fileHash) public view returns (
        address mainOwner,
        string memory firstname,
        string memory lastname,
        string memory email)
    {
        FileDetails memory fileDetails = _files[fileHash];
        OwnerDetails memory ownerDetails = _owners[fileHash][0];
        return (
            fileDetails.mainOwner,
            ownerDetails.firstname,
            ownerDetails.lastname,
            ownerDetails.email
        );
    }

    function getFileOwner(string memory fileHash, uint ownerNumber) public view returns (
        string memory ownerFirstName,
        string memory ownerLastName,
        string memory ownerEmail) {
        return (
            _owners[fileHash][ownerNumber].firstname,
            _owners[fileHash][ownerNumber].lastname,
            _owners[fileHash][ownerNumber].email
        );
    }

}
