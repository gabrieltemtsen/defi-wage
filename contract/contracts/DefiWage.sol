// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DefiWage {

    // Variables

    address public owner;
    mapping(address => Company) public companies;
    mapping(address => Worker) public workers;
    mapping(address => Loan) public loans;

    // Structs

    struct Company {
        string name;
        address[] workers;
    }

    struct Worker {
        string name;
        address company;
        uint256 salary;
        uint256 loanAmount;
        uint256 loanRepaid;
    }

    struct Loan {
        address worker;
        uint256 amount;
        uint256 interestRate;
        bool loanApproved;
        uint256 repaymentTerm;
        uint256 repaymentStart;
        uint256 loanRepaid;
    }

    // Events

    event CompanyRegistered(address companyAddress);
    event WorkerAdded(address workerAddress);
    event SalaryPaid(address workerAddress, uint256 amount);
    event LoanRequested(address workerAddress, uint256 amount);
    event LoanApproved(address workerAddress, uint256 amount);
    event LoanRepaid(address workerAddress, uint256 amount);

    // Constructor

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner () {
        require(msg.sender == owner, "Unauthorised Access");
        _;
    }

    // Functions

    function registerCompany(string memory name) public {
         require(bytes(companies[msg.sender].name).length == 0, "Company already registered");

        Company memory company = Company(name, new address[](0));
        companies[msg.sender] = company;

        emit CompanyRegistered(msg.sender);
    }

    function addWorker(address workerAddress) public {
        require(bytes(companies[msg.sender].name).length != 0, "Company not registered");

        companies[msg.sender].workers.push(workerAddress);
        workers[workerAddress].company = msg.sender;

        emit WorkerAdded(workerAddress);
    }

    function paySalary(address workerAddress) public {
        require(bytes(companies[msg.sender].name).length != 0, "Company not registered");
        require(workers[workerAddress].company == msg.sender, "Worker not registered with company");

        uint256 salary = workers[workerAddress].salary;
        workers[workerAddress].loanRepaid += salary - (salary / 10); // 10% loan deduction

        emit SalaryPaid(workerAddress, salary);
    }

    function requestLoan(uint256 amount) public {
        require(workers[msg.sender].company != address(0), "Worker not registered with company");

        Loan memory loan = Loan(msg.sender, amount, 10, false, 12, block.timestamp, 0);
        loans[msg.sender] = loan;

        emit LoanRequested(msg.sender, amount);
    }

    function approveLoan(address workerAddress) public onlyOwner {
        require(loans[workerAddress].worker != address(0), "Loan not requested");

        loans[workerAddress].loanApproved = true;

        emit LoanApproved(workerAddress, loans[workerAddress].amount);
    }

    function repayLoan() public payable {
        require(loans[msg.sender].worker != address(0), "Loan not requested");
        require(loans[msg.sender].loanApproved, "Loan not approved");

        uint256 amountToRepay = loans[msg.sender].amount - loans[msg.sender].loanRepaid;
        require(msg.value >= amountToRepay, "Insufficient funds");

        loans[msg.sender].loanRepaid = loans[msg.sender].amount;

        emit LoanRepaid(msg.sender, amountToRepay);
    }
}