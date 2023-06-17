pragma solidity >=0.4.22 <0.7.0;

contract DFile {
  uint public fileCount = 0;
  mapping(uint => File) public files;

  struct File {
    uint fileId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    uint uploadTime;
    address payable uploader;
  }

  event FileUploaded(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName, 
    uint uploadTime,
    address payable uploader
  );

  constructor() public {
  }

  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName) public {
    require(bytes(_fileHash).length > 0);
    require(bytes(_fileType).length > 0);
    require(bytes(_fileName).length > 0);
    require(msg.sender!=address(0));
    require(_fileSize>0);

    fileCount ++;

    files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName, now, msg.sender);
    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName,now, msg.sender);
  }
}