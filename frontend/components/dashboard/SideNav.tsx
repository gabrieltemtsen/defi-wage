/* eslint-disable @next/next/no-img-element */
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { shortenAddress } from "../../utils/shortenAddress";
import { readContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DEFI_WAGE_ABI, DEFI_WAGE_MANAGER_ABI, DEFI_WAGE_MANAGER_CONTRACT } from "../../utils/contracts";
import axios from "axios";

const SideNav = ({
  onItemClick,
  contractAddress,
  contractABI,
  address,
}: {
  onItemClick: (item: string, id?: any) => void;
  contractAddress: `0x${string}`;
  contractABI: any[];
  address: string;
}) => {
  const [userCompanies, setUserCompanies] = useState<any[]>([]);

  const [adminCompanies, setAdminCompanies] = useState<any[]>([]);

  const [allAdmins, setAdmins] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  const getAdmins = () => {
    console.log('HkELLp', isAdmin)
    for(let i =0; i<allAdmins.length; i++) {
      if(address == allAdmins[i]){
        console.log(true)
        setIsAdmin(true)
      }
      setIsAdmin(false)
    }
  }
  


  const getUserCompanies = async () => {
    try {
      const employeeCompanies: any = await readContract({
        address: DEFI_WAGE_MANAGER_CONTRACT,
        abi: DEFI_WAGE_MANAGER_ABI,
        functionName: "getEmployeeCompanies",
        args: [address],
      });
      const adminCompanies: any = await readContract({
        address: DEFI_WAGE_MANAGER_CONTRACT,
        abi: DEFI_WAGE_MANAGER_ABI,
        functionName: "getAdminCompanies",
        args: [address],
      });
      const getAllCompanies: any = await readContract({
        address: DEFI_WAGE_MANAGER_CONTRACT,
        abi: DEFI_WAGE_MANAGER_ABI,
        functionName: "getCompanies",
        args: [],
      });

      let companyInfo: any[] = [];
      let adminCompanyInfo: any[] = [];
      let allAdmin = []

      for (let i=0; i<employeeCompanies.length; i++ ) {

        const companyCID: any = await readContract({
          address: employeeCompanies[i],
          abi: DEFI_WAGE_ABI,
          functionName: "companyCID",
          args: [],
        });

        const admin: any = await readContract({
          address: employeeCompanies[i],
          abi: DEFI_WAGE_ABI,
          functionName: "admin",
          args: [],
        });
        allAdmin.push(admin)
        

       

        if (companyCID) {
          let config: any = {
            method: "get",
            url: `https://${companyCID}.ipfs.w3s.link/file.json`,
            headers: {},
          };
          const axiosResponse = await axios(config);

          const companyDataObj = axiosResponse.data;

          const companyAdress = employeeCompanies[i];

          const companyObject = {
            companyAddress: companyAdress,
            companyData: companyDataObj
          }
          


          companyInfo.push(companyObject)
        }

      }
      for (let i=0; i<adminCompanies.length; i++ ) {

        const companyCID: any = await readContract({
          address: adminCompanies[i],
          abi: DEFI_WAGE_ABI,
          functionName: "companyCID",
          args: [],
        });
       
        if (companyCID) {
          let config: any = {
            method: "get",
            url: `https://${companyCID}.ipfs.w3s.link/file.json`,
            headers: {},
          };
          const axiosResponse = await axios(config);

          const companyDataObj = axiosResponse.data;
          const companyAdress = adminCompanies[i];

          const companyObject = {
            companyAddress: companyAdress,
            companyData: companyDataObj
          }
          


          
          adminCompanyInfo.push(companyObject)
        }

      }
      setUserCompanies(companyInfo);
      setAdmins(allAdmin)
      setAdminCompanies(adminCompanyInfo);
      console.log(userCompanies)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdmins()
    getUserCompanies();
  }, [address]);

  return (
    <>
      <div className="flex flex-row sm:gap-10">
        <div className="sm:w-full sm:max-w-[18rem]">
          <input
            type="checkbox"
            id="sidebar-mobile-fixed"
            className="sidebar-state"
          />
          <label
            htmlFor="sidebar-mobile-fixed"
            className="sidebar-overlay"
          ></label>
          <aside className="sidebar sidebar-fixed-left sidebar-mobile h-full justify-start max-sm:fixed max-sm:-translate-x-full">
            <section className="sidebar-title items-center p-4">
              <div className="flex flex-col">
                <Link href="/">
                  <span className="text-2xl font-bold cursor-pointer">
                    Defi Wage
                  </span>
                </Link>
              </div>
            </section>
            <section className="sidebar-content">
              <nav className="menu rounded-md">
                <section className="menu-section px-4">
                  <span className="menu-title">Main menu</span>
                  <ul className="menu-items">
                    <li
                      className="menu-item menu-active"
                      onClick={() => onItemClick("general")}
                    >
                
                      <span>General</span>
                    </li>

                    <li
                      className="menu-item "
                      onClick={() => onItemClick("loans")}
                    >
                     
                      <span>Loans</span>
                    </li>
                    
                    <li>
                      <input
                        type="checkbox"
                        id="menu-1"
                        className="menu-toggle"
                      />
                      <label
                        className="menu-item justify-between"
                        htmlFor="menu-1"
                      >
                        <div className="flex gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"      
                            className="h-5 w-5 opacity-75"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span>Your Companies</span>
                        </div>

                        <span className="menu-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </label>

                     
                      {userCompanies.map((company) => (
                        <div className="menu-item-collapse"
                        key={+1}
                        onClick={() =>
                          onItemClick("Group", company.companyAddress)
                        }>
                        <div className="min-h-0 menu-item ml-6" >                 
                          
                            <label
                            
                            
                          >
                            
                              {company.companyData.companyName}
                              </label>
                              </div>

                              </div>
                            
                          ))}
                          
                       
                     
                    </li>
                  </ul>
                </section>
                <div className="divider my-0"></div>
               
                  <section className="menu-section px-4">
                  <span className="menu-title">Owned Companies</span>
                  <ul className="menu-items">
                    
                    {adminCompanies.map((company) => (
                            <li
                            className="menu-item"
                              key={+1}
                              onClick={() =>
                                onItemClick("Group", company.companyAddress)
                              }
                              
                            >
                               {company.companyData.companyName}
                            </li>
                          ))}
                    

                    
                  </ul>
                </section>

                
              </nav>
            </section>
            <section className="sidebar-footer justify-end bg-gray-2 pt-2">
              <div className="ml-5 mr-6 "></div>
              <div className="divider my-0"></div>
              <div className="dropdown z-50 flex h-fit w-full cursor-pointer hover:bg-gray-4	">
                <label
                  className="whites mx-2 flex h-fit w-full cursor-pointer p-0 hover:bg-gray-4"
                  tabIndex={0}
                >
                  <div className="flex flex-row gap-4 p-4">
                    <div className="avatar-square avatar avatar-md">
                      <img
                        src="https://i.pravatar.cc/150?img=30"
                        alt="avatar"
                      />
                    </div>

                    <div className="flex flex-col">
                      <span>{shortenAddress(address)}</span>
                    </div>
                  </div>
                </label>
                <div className="dropdown-menu-right-top dropdown-menu ml-1  w-full">
                  <a className="dropdown-item text-sm">
                    <ConnectButton showBalance={false} />
                  </a>
                </div>
              </div>
            </section>
          </aside>
        </div>
        <div className="flex w-full flex-col p-4">
          <div className="w-fit">
            <label
              htmlFor="sidebar-mobile-fixed"
              className="btn-primary btn sm:hidden"
            >
              Open Sidebar
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;