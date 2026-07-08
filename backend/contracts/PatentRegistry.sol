pragma solidity ^0.5.0;

contract PatentRegistry {
    struct Patent {
        string fileHash;
        uint256 timestamp;
    }

    mapping(string => uint256) private patentTimestamps;
    mapping(uint256 => string) private patentHashes;
    uint256 public patentCount;

    event PatentRegistered(string indexed fileHash, uint256 timestamp);

    function registerPatent(string memory _fileHash) public {
        require(patentTimestamps[_fileHash] == 0, "Patent already registered!");

        patentCount++;
        uint256 currentTime = block.timestamp;

        patentTimestamps[_fileHash] = currentTime;
        patentHashes[patentCount] = _fileHash;

        emit PatentRegistered(_fileHash, currentTime);
    }

    function verifyPatent(string memory _fileHash) public view returns (
        bool isRegistered,
        uint256 timestamp
    ) {
        uint256 patentTime = patentTimestamps[_fileHash];

        if(patentTime > 0) {
            return (true, patentTime);
        }

        return (false, 0);
    }

    function getPatentCount() public view returns (uint256) {
        return patentCount;
    }

    function getPatentHash(uint256 _index) public view returns (string memory, uint256) {
        require(_index > 0 && _index <= patentCount, "Invalid index");
        string memory hash = patentHashes[_index];
        uint256 timestamp = patentTimestamps[hash];
        return (hash, timestamp);
    }
}