//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
 import "./DefiWage.sol";

contract DefiWageManager {
    uint256 public companyIdCounter;
    DefiWage[] public companies;
    mapping(address => uint256) public companyIDs;
mapping(address => address[]) private employeeToCompanies;


    function createCompany (string memory companyCID) public  returns (bool) {
        uint256 companyID = companyIdCounter;
        companyIdCounter++;
        DefiWage company = new DefiWage(companyCID, msg.sender);
        companies.push(company);
        companyIDs[address(company)] = companyID;
        return true;
    }
   
    function addEmployee(address _employeeAddress, address _companyAddress)public returns (bool){
    uint256 companyId = companyIDs[_companyAddress];

    address companyAdmin = companies[companyId].getAdmin();
    
    require (msg.sender == companyAdmin , 'No Access') ;
    companies[companyId].addEmployee(_employeeAddress);
    employeeToCompanies[_employeeAddress].push(_companyAddress);
    return true; 
  }
  function getCompanies() external view returns(address[] memory _companies) {
    _companies = new address[](companyIdCounter);
    for (uint256 i = 0; i < companyIdCounter; i++) {
      _companies[i] = address(companies[i]);
    }
    return _companies;

  }
function getEmployeeCompanies(address _employeeAddress) external view returns (address[] memory) {

    return employeeToCompanies[_employeeAddress];
}
//   function getCompaniesData(address[] memory _companyList) external view returns (string[] memory companyCID, address[] memory employees) {
//         companyCID = new string[](_companyList.length);
//         employees = new address[](_companyList.length);
        
//         for (uint256 i = 0; i < _companyList.length; i++) {
//             uint256 companyID = companyIDs[_companyList[i]];
//             companyCID[i] = companies[companyID].companyCID();
//             employees[i] = companies[companyID].getEmployees();
//         }
        
//         return (companyCID, employees);
//     }
    
}