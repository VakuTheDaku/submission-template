pragma solidity >=0.4.22 <0.9.0;

contract MedicalRecord {
    uint256 public recordCount = 0;

    struct Record {
        uint256 id;
        string user;
        string knownAllergies;
        string symptoms;
        string diagonosis;
    }

    mapping(uint256 => Record) public records;

    event RecordCreated(
        uint256 id,
        string user,
        string knownAllergies,
        string symptoms,
        string diagonosis
    );
    event RecordDeleted(uint256 id);

    function createRecord(string memory _user ,string memory _knownAllergies, string memory _symptoms, string memory _diagonosis)
        public
    {
        records[recordCount] = Record(recordCount, _user, _knownAllergies, _symptoms, _diagonosis);
        emit RecordCreated(recordCount, _user, _knownAllergies, _symptoms, _diagonosis);
        recordCount++;
    }


    function deleteRecord(uint256 _id) public {
        delete records[_id];
        emit RecordDeleted(_id);
        recordCount--;
    }

     function getRecordCount() public view returns (uint256) {
        return recordCount;
    }

      function getRecord (uint256  id)
        public view
        returns (uint , string memory , string memory ,string memory, string memory )
    {
        Record memory p = records[id];
        return (p.id, p.user, p.knownAllergies, p.symptoms, p.diagonosis);
    }

}
