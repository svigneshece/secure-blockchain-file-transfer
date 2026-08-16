// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract FileIntegrity {

    struct FileRecord {
        bytes32 fileHash;
        address uploader;
        uint256 timestamp;
        bool exists;
    }

    mapping(bytes32 => FileRecord) private files;

    event FileRegistered(
        bytes32 indexed fileHash,
        address indexed uploader,
        uint256 timestamp
    );

    function registerFile(bytes32 fileHash) public {
        require(fileHash != bytes32(0), "Invalid file hash");
        require(!files[fileHash].exists, "File hash already registered");

        files[fileHash] = FileRecord({
            fileHash: fileHash,
            uploader: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit FileRegistered(
            fileHash,
            msg.sender,
            block.timestamp
        );
    }

    function verifyFile(bytes32 fileHash)
        public
        view
        returns (
            bool exists,
            address uploader,
            uint256 timestamp
        )
    {
        FileRecord memory record = files[fileHash];

        return (
            record.exists,
            record.uploader,
            record.timestamp
        );
    }
}