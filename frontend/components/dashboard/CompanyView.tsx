/* eslint-disable @next/next/no-img-element */
import { writeContract, readContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

interface NavItem {
  currentID: any;
}
export const CompanyInfo = ({
  currentID: groupID,
  contractAddress,
  contractABI,
  address,
}: NavItem & {
  contractAddress: `0x${string}`;
  contractABI: any[];
  address: string;
}) => {
  const [groupName, setGroupName] = useState("");
  const [groupLogo, setGroupLogo] = useState("");
  const [members, setMembers] = useState<any>([]);

  const [dimensionName, setDimensionName] = useState("");
  const [dimensionWeight, setDimensionWeight] = useState("");
  const [names, setNames] = useState<any>([]);
  const [weights, setWeights] = useState<any>([]);

  let id = 0;

  const handleAddDimension = () => {
    // Validate inputs
    if (!dimensionName || !dimensionWeight) {
      alert("Please provide both name and weight.");
      return;
    }

    // Add the dimension to the lists
    setNames([...names, dimensionName]);
    setWeights([...weights, dimensionWeight]);

    // Clear input fields
    setDimensionName("");
    setDimensionWeight("");
  };

  const getGroupInfo = async () => {
    try {
      const groupInfo: any = await readContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "getGroupInfo",
        args: [groupID],
      });

      setGroupName(groupInfo[0]);

      const CID = groupInfo[1];
      let config: any = {
        method: "get",
        url: `https://${CID}.ipfs.w3s.link/file.json`,
        headers: {},
      };
      const axiosResponse = await axios(config);

      const groupData = axiosResponse.data;

      setGroupLogo(groupData.groupLogo);
      setMembers(groupData.groupMembers);
    } catch (error) {}
  };

  const handleCreateDimensions = async () => {
    try {
      // Convert weights to uint256
      const weightsUint = weights.map((weight: any) =>
        ethers.utils.parseUnits(weight.toString(), 18)
      );
      const setDimension: any = await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "setDimensions",
        args: [groupID, names, weightsUint],
      });

      // Clear input fields
      setNames([]);
      setWeights([]);
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
  }, [groupID]); // The empty dependency array means this effect runs once, like componentDidMount

  return (
    <>
      <h1 className="text-2xl font-bold text-center">Organisation Info </h1>

      <div className="max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="avatar avatar-ring-primary mr-5">
          <img src={`https://ipfs.io/ipfs/${groupLogo}`} alt="avatar" />
        </div>
        <span className="font-bol text-xl py-5 mb-5 pb-5"> {groupName} TechFusion </span>

        <div className="font-bol text-xl py-5 mb-5 pb-5"> Members</div>

        <div className="flex w-full overflow-x-auto mt-5">
          <table className="table-hover table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Name</th>
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member: any, index: any) => (
                <tr key={member.wallet}>
                  <th>{++id}</th>
                  <td>{member.name}</td>
                  <td>{member.wallet}</td>
                  <td>voted</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className=" mt-7 divider my-0"></div>
        <div className="font-bol text-xl py-5 mb-5 pb-2"> Add Employee</div>

        <form>
          <div>
            <label>Name:</label>
            <input
              className="py-2 px-3 pr-11 block   border-gray-200 shadow-sm -mt-px -ml-px first:rounded-t-lg last:rounded-b-lg sm:last:rounded-r-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
              type="text"
              value={dimensionName}
              onChange={(e) => setDimensionName(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <label>Address:</label>
            <input
              className="py-2 px-3 pr-11 block   border-gray-200 shadow-sm -mt-px -ml-px first:rounded-t-lg last:rounded-b-lg sm:last:rounded-r-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
              type="text"
              value={dimensionName}
              onChange={(e) => setDimensionName(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <label>Wage(monthly):</label>
            <input
              className="py-2 px-3 pr-11 block  border-gray-200 shadow-sm -mt-px -ml-px first:rounded-t-lg last:rounded-b-lg sm:last:rounded-r-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
              type="number"
              value={dimensionWeight}
              onChange={(e) => setDimensionWeight(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleAddDimension}
            className="py-2 mt-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
            Add Employee
          </button>
        </form>

        <div className=" mt-7 divider my-0"></div>
        <div className="font-bol text-xl py-5 mb-3 pb-5">
          {" "}
          Your Available Wallet Balance: <strong> 0 USDT</strong> 
        </div>

        <div className="flex w-full overflow-x-auto">
          
          
        <div>
             <button
            type="button"
            onClick={handleAddDimension}
            className="py-2 ml-2 mt-3  px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-gradient-to-tl from-blue-600 to-yellow-600 shadow-lg shadow-transparent hover:shadow-blue-700/50 border border-transparentfocus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
          Withdraw Salary
          </button>
          </div>
        </div>
        <div className=" mt-7 divider my-0"></div>

        <div className="flex w-full overflow-x-auto">
          
          
        <div>
            <label className="ml-2">Loan Amount:</label>
            <input
              className="py-2 px-3 pr-11 block ml-2 mt-1  border-gray-200 shadow-sm -mt-px -ml-px first:rounded-t-lg last:rounded-b-lg sm:last:rounded-r-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
              type="text"
              value={dimensionName}
              onChange={(e) => setDimensionName(e.target.value)}
            />
             <button
            type="button"
            onClick={handleAddDimension}
            className="py-2 ml-2 mt-3 mt-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
           Request Loan
          </button>
          </div>
        </div>
        <div className=" mt-7 divider my-0"></div>
      </div>
      
    </>
  );
};