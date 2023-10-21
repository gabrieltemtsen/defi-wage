//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract DefiWage {

    string public companyCID;
    uint public createdAT;
    address public admin;
    address[] public employees;
    mapping(address => uint) public employeeSalaries; 
    

    constructor(string memory _companyCID, address _admin) {
        companyCID = _companyCID;
        admin = _admin;
    }

     modifier onlyOneEmployee (address _employeeAddress) {
        for(uint i =0; i<employees.length; i++) {
            require(employees[i] != _employeeAddress, 'Employee already Exists');
        }

        _;
     }
     modifier onlyAdmin () {
        require(msg.sender == admin, 'Not an Admin');

        _;
     }

    function addEmployee(address _employeeAddress)public onlyOneEmployee(_employeeAddress) returns(bool) {
        employees.push(_employeeAddress);
       return true;
    }
     function setEmployeeSalary(address _employeeAddress, uint256 _salary) public onlyAdmin returns (bool) {
        employeeSalaries[_employeeAddress] = _salary;
        return true;
    }

    function getEmployeeSalary(address _employeeAddress) public view returns (uint) {
        return employeeSalaries[_employeeAddress];
    }

    
    function getEmployees() public view returns (address[] memory) {
        return employees;
    }
    // function getNumberOFComments() public view returns (uint256) {
    //     return commentCIDs.length;
    // }
     function getAdmin() public view returns (address) {
        return admin;
    }
    
}