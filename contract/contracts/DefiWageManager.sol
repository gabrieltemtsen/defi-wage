//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
 import "./DefiWage.sol";

contract DefiWageManager {
    uint256 public companyIdCounter;
    DefiWage[] public companies;
    mapping(address => uint256) public companyIDs;


    function createCompany (string memory articleCID) public  returns (bool) {
        uint256 companyID = companyIdCounter;
        companyIdCounter++;
        DefiWage company = new DefiWage(articleCID, msg.sender);
        companies.push(company);
        companyIDs[address(company)] = companyID;
        return true;
    }
    function addEmployee(address _workerAddress, address _companyAddress)external returns (bool){
    uint256 companyId = companyIDs[_companyAddress];
    companies[companyId].addEmployee(_workerAddress);
    return true; 
  }
  function getCompanies() external view returns(address[] memory _companies) {
    _companies = new address[](companyIdCounter);
    for (uint256 i = 0; i < companyIdCounter; i++) {
      _companies[i] = address(companies[i]);
    }
    return _companies;

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