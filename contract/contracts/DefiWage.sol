pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DefiWage {
    string public companyCID;
    uint public createdAT;
    address public admin;
    address[] public employees;
    mapping(address => uint) public employeeSalaries;
    mapping(address => uint) public employeeWalletBalances;

    constructor(string memory _companyCID, address _admin) {
        companyCID = _companyCID;
        admin = _admin;
    }

    modifier onlyOneEmployee(address _employeeAddress) {
        for (uint i = 0; i < employees.length; i++) {
            require(employees[i] != _employeeAddress, 'Employee already Exists');
        }
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, 'Not an Admin');
        _;
    }

    function depositUSDT(uint amount) public onlyAdmin {
        IERC20 usdt = IERC20(0x3c725F9622779c4Aa225bED987056e32326f8094);
        require(usdt.transferFrom(admin, address(this), amount), 'Deposit failed');
    }

    function addEmployee(address _employeeAddress) public onlyOneEmployee(_employeeAddress) returns (bool) {
        employees.push(_employeeAddress);
        employeeWalletBalances[_employeeAddress] = 0; // Initialize wallet balance to zero
        return true;
    }

    function setEmployeeSalary(address _employeeAddress, uint256 _salary) public onlyAdmin returns (bool) {
        employeeSalaries[_employeeAddress] = _salary;
        return true;
    }

    function getEmployeeSalary(address _employeeAddress) public view returns (uint) {
        return employeeSalaries[_employeeAddress];
    }

    function getEmployeeWalletBalance(address _employeeAddress) public view returns (uint) {
        return employeeWalletBalances[_employeeAddress];
    }

    function getEmployees() public view returns (address[] memory) {
        return employees;
    }

    function getAdmin() public view returns (address) {
        return admin;
    }

    function addMonthlySalaries() public onlyAdmin {
        for (uint i = 0; i < employees.length; i++) {
            address employee = employees[i];
            uint salary = employeeSalaries[employee];
            employeeWalletBalances[employee] += salary;
        }
    }

    function withdrawSalary() public {
        address employee = msg.sender;
        uint balance = employeeWalletBalances[employee];
        require(balance > 0, 'No salary to withdraw');

        IERC20 usdt = IERC20(0x3c725F9622779c4Aa225bED987056e32326f8094);
        require(usdt.transfer(employee, balance), 'Transfer failed');
        employeeWalletBalances[employee] = 0; // Reset wallet balance after withdrawal
    }
}
