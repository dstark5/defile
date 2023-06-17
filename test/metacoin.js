const DFile = artifacts.require('./DFile.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('DFile', ([deployer, uploader]) => {
  let DFile

  before(async () => {
    DFile = await DFile.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await DFile.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe('file', async () => {
    let result, fileCount
    const fileHash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'
    const fileSize = '1'
    const fileType = 'TypeOfTheFile'
    const fileName = 'NameOfTheFile'

    before(async () => {
      result = await DFile.uploadFile(fileHash, fileSize, fileType, fileName, { from: uploader })
      fileCount = await DFile.fileCount()
    })

    //check event
    it('upload file', async () => {
      // SUCESS
      assert.equal(fileCount, 1)
      const event = result.logs[0].args
      assert.equal(event.fileId.toNumber(), fileCount.toNumber(), 'Id is correct')
      assert.equal(event.fileHash, fileHash, 'Hash is correct')
      assert.equal(event.fileSize, fileSize, 'Size is correct')
      assert.equal(event.fileType, fileType, 'Type is correct')
      assert.equal(event.fileName, fileName, 'Name is correct')
      assert.equal(event.uploader, uploader, 'Uploader is correct')

      // FAILURE: File must have hash
      await DFile.uploadFile('', fileSize, fileType, fileName, { from: uploader }).should.be.rejected;

      // FAILURE: File must have size
      await DFile.uploadFile(fileHash, '', fileType, fileName,  { from: uploader }).should.be.rejected;
      
      // FAILURE: File must have type
      await DFile.uploadFile(fileHash, fileSize, '', fileName,  { from: uploader }).should.be.rejected;

      // FAILURE: File must have name
      await DFile.uploadFile(fileHash, fileSize, fileType, '', { from: uploader }).should.be.rejected;

      // FAILURE: File must have description
      await DFile.uploadFile(fileHash, fileSize, fileType, fileName, '', { from: uploader }).should.be.rejected;
    })

    //check from Struct
    it('lists file', async () => {
      const file = await DFile.files(fileCount)
      assert.equal(file.fileId.toNumber(), fileCount.toNumber(), 'id is correct')
      assert.equal(file.fileHash, fileHash, 'Hash is correct')
      assert.equal(file.fileSize, fileSize, 'Size is correct')
      assert.equal(file.fileName, fileName, 'Size is correct')
      assert.equal(file.uploader, uploader, 'uploader is correct')
    })
  })
})