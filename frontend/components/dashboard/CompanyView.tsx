/* eslint-disable @next/next/no-img-element */
import { writeContract, readContract,waitForTransaction } from "@wagmi/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { DEFI_WAGE_ABI, DEFI_WAGE_MANAGER_ABI, DEFI_WAGE_MANAGER_CONTRACT, USDT_ABI, USDT_CONTRACT } from "../../utils/contracts";

interface NavItem {
  contractAdd: any;
}
export const CompanyInfo = ({
  contractAdd: companyAddress,
  contractAddress,
  contractABI,
  address,
}: NavItem & {
  contractAddress: `0x${string}`;
  contractABI: any[];
  address: string;
}) => {
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [members, setMembers] = useState<any>([]);
  const [admin, setAdmin] = useState("");

  const [depositAmount, setDepositAmount] = useState("");



  const [employeeName, setEmployeeName] = useState("");
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [employeeWage, setEmployeeWage] = useState<any>([]);
  const [walletBalance, setWalletBalance] = useState<any>(0);
  const [salary, setSalary] = useState<any>(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState<any>("");
  const [companyBalance, setCompanyBalanace] = useState<any>();






  let id = 0;
  let index = 0;

  const depositToCompany = async() => {
    if(!depositAmount){
      return toast.error('please enter amount')
    }

 try {
  
  const ToApprove = ethers.utils.parseEther(depositAmount);
console.log((Number(ToApprove)))
  const {hash}: any = await writeContract({
    address: USDT_CONTRACT,
    abi: USDT_ABI,
    functionName: "approve",
    args: [companyAddress,ToApprove ],
  });
  const receipt = await waitForTransaction({ hash });

  const deposit: any = await writeContract({
    address: companyAddress,
    abi: DEFI_WAGE_ABI,
    functionName: "depositUSDC",
    args: [ToApprove],
  });
  getGroupInfo()
  if(deposit) {
    toast.success('Deposited')
    // Clear input fields
    setDepositAmount("");
  }

  
 } catch (error) {
  console.log(error)
  
 }


    

    
  };

  const paySalaries = async () => {
    try {

      const {hash}: any = await writeContract({
        address: companyAddress,
        abi: DEFI_WAGE_ABI,
        functionName: "addMonthlySalaries",
        args: [],
      });
      const receipt = await waitForTransaction({ hash });
      if (!receipt) {
        toast.error("Failed to pay salaries");
        return;
      }
      getGroupInfo();
      
    } catch (error) {
      console.log(error)
      
    }
  }
  const withdrawWages = async () => {
    try {
      const depositAmountInWei = Number(withdrawalAmount) * Math.pow(10, 6)
  
  const ToApprove = ethers.utils.parseEther(withdrawalAmount);
  console.log(Number(ToApprove))

      const {hash}: any = await writeContract({
        address: companyAddress,
        abi: DEFI_WAGE_ABI,
        functionName: "withdrawSalary",
        args: [ToApprove],
      });
      const receipt = await waitForTransaction({ hash });
      if (!receipt) {
        toast.error("Failed to withdraw salary");
        return;
      }
      getGroupInfo();
      
    } catch (error) {
      console.log(error)
      
    }
  }

  const getGroupInfo = async () => {
    console.log('hello')
    try {

      const companyCID: any = await readContract({
        address: companyAddress,
        abi: DEFI_WAGE_ABI,
        functionName: "companyCID",
        args: [],
      });

      const bal: any = await readContract({
        address: USDT_CONTRACT,
        abi: USDT_ABI,
        functionName: "balanceOf",
        args: [companyAddress],
      });
      setCompanyBalanace(ethers.utils.formatEther(bal))

      const companyAdmin: any = await readContract({
        address: companyAddress,
        abi: DEFI_WAGE_ABI,
        functionName: "admin",
        args: [],
      });

      setAdmin(companyAdmin)
      

      const getEmployees: any = await readContract({
        address: companyAddress,
        abi: DEFI_WAGE_ABI,
        functionName: "getEmployees",
        args: [],
      });

      const getEmployeeWalletBalance: any = await readContract({
        address: companyAddress,
        abi: DEFI_WAGE_ABI,
        functionName: "getEmployeeWalletBalance",
        args: [address],
      });
      setWalletBalance(ethers.utils.formatEther(getEmployeeWalletBalance))
      const getEmployeeSalary: any = await readContract({
        address: companyAddress,
        abi: DEFI_WAGE_ABI,
        functionName: "getEmployeeSalary",
        args: [address],
      });
      setSalary(ethers.utils.formatEther(getEmployeeSalary));

      setMembers(getEmployees)

      
      let config: any = {
        method: "get",
        url: `https://${companyCID}.ipfs.w3s.link/file.json`,
        headers: {},
      };
      const axiosResponse = await axios(config);

      const companyData = axiosResponse.data;
      setCompanyName(companyData.companyName)
      setCompanyLogo(companyData.companyLogo);
    } catch (error) {}
  };

  const addEmployee = async () => {
    try {

      const wage = ethers.utils.parseEther(employeeWage);

      
      const addWorker: any = await writeContract({
        address: DEFI_WAGE_MANAGER_CONTRACT,
        abi: DEFI_WAGE_MANAGER_ABI,
        functionName: "addEmployee",
        args: [employeeAddress, companyAddress, wage],
      });
      getGroupInfo()

      if(addWorker) {
        toast.success('Successfull')
      }

      // Clear input fields
      // setNames([]);
      // setWeights([]);
    } catch (error) {
      console.error("Error adding dimensions:", error);
    }
  };

  useEffect(() => {
    getGroupInfo();

    // You can also return a cleanup function if needed
    return () => {
      // This code will run when the component unmounts
      // You can clean up any resources or subscriptions here
    };
  }, [address, salary, walletBalance]); // The empty dependency array means this effect runs once, like componentDidMount

  return (
    <>
      <h1 className="text-2xl font-bold text-center">Organisation Info </h1>

      <div className="max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="avatar avatar-ring-primary mr-5">
          <img src={`https://ipfs.io/ipfs/${companyLogo}`} alt="avatar" />
        </div>
        <span className="font-bol text-xl py-5 mb-5 pb-5"> {companyName} </span>

        <div className="font-bol text-xl py-5 mb-5 pb-5"> Members</div>

        <div className="flex w-full overflow-x-auto mt-5">
          <table className="table-hover table">
            <thead>
              <tr>
                <th>SN</th>
                {/* <th>Name</th> */}
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member: any, index: any) => (
                <tr key={++index}>
                  <th>{++id}</th>
                  {/* <td>{}</td> */}
                  <td>{member}</td>
                  <td>Employee</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className=" mt-7 divider my-0"></div>
        {address == admin && (
          <>
          <div className="font-bol text-xl py-5 mb-5 pb-2"> Add Employee</div>

<form>
  <div>
    <label>Name:</label>
    <input
      className="py-2 px-3 pr-11 block   border-gray-200 shadow-sm -mt-px -ml-px first:rounded-t-lg last:rounded-b-lg sm:last:rounded-r-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
      type="text"
      onChange={(e) => setEmployeeName(e.target.value)}
    />
  </div>
  <div className="mt-2">
    <label>Address:</label>
    <input
      className="py-2 px-3 pr-11 block   border-gray-200 shadow-sm -mt-px -ml-px first:rounded-t-lg last:rounded-b-lg sm:last:rounded-r-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
      type="text"
      onChange={(e) => setEmployeeAddress(e.target.value)}
    />
  </div>
  <div className="mt-2">
    <label>Wage(monthly):</label>
    <input
      className="py-2 px-3 pr-11 block  border-gray-200 shadow-sm -mt-px -ml-px first:rounded-t-lg last:rounded-b-lg sm:last:rounded-r-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
      type="number"
      onChange={(e) => setEmployeeWage(e.target.value)}
    />
  </div>
  <button
    type="button"
    onClick={addEmployee}
    className="py-2 mt-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
  >
    Add Employee
  </button>
</form>

<div className=" mt-7 divider my-0"></div>
          </>

        )}
        
        <div className="font-bol text-xl py-5 mb-3 pb-5">
          
          {" "}
          Your Available Wallet Balance: <strong> {walletBalance} USDC</strong>  <span className="font-bold ml-4 mr-4">|  </span> Your monthly wage:<strong> {salary} USDC</strong>
        </div> 

        <div className="flex w-full overflow-x-auto">
          
          
        <div>
        <input
             className="py-2 px-3 pr-11 block ml-2 mt-1  border-gray-200 shadow-sm -mt-px -ml-px first:rounded-t-lg last:rounded-b-lg sm:last:rounded-r-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
             type="text"
             
             onChange={(e) => setWithdrawalAmount(e.target.value)}
           />
             <button
            type="button"
            onClick={withdrawWages}
            className="py-2 ml-2 mt-3  px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-gradient-to-tl from-blue-600 to-yellow-600 shadow-lg shadow-transparent hover:shadow-blue-700/50 border border-transparentfocus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
          Withdraw Salary
          </button>
          </div>
        </div>
        <div className=" mt-7 divider my-0"></div>

        
          
          
        
          {address !== admin && (
            <>
             <div className="flex w-full overflow-x-auto">
          <div>
            <label className="ml-2">Loan Amount:</label>
            <input
              className="py-2 px-3 pr-11 block ml-2 mt-1  border-gray-200 shadow-sm -mt-px -ml-px first:rounded-t-lg last:rounded-b-lg sm:last:rounded-r-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
              type="text"
              
              // onChange={(e) => setDimensionName(e.target.value)}
            />
             <button
            type="button"
            // onClick={handleAddDimension}
            className="py-2 ml-2 mt-3 mt-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
           Request Loan
          </button>
          </div>
        </div>
        <div className=" mt-7 divider my-0"></div>
            </>
          ) ? <>
          </> :
           <div>
            <button
    type="button"
    onClick={paySalaries}
    className="py-2 mt-2 px-3 mb-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
  >
    Pay Monthly Wages    
  </button> <br />
           <label className="ml-2 mt-5">Deposit Amount To Company:</label>
           <input
             className="py-2 px-3 pr-11 block ml-2 mt-1  border-gray-200 shadow-sm -mt-px -ml-px first:rounded-t-lg last:rounded-b-lg sm:last:rounded-r-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
             type="text"
             
             onChange={(e) => setDepositAmount(e.target.value)}
           />
            <button
           type="button"
           onClick={depositToCompany}
           className="py-2 ml-2 mt-3 mt-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
         >
          Deposit
         </button>
         <br /> Company Balance: {companyBalance} USDC
         </div>}
         
      </div>
      
    </>
  );
};