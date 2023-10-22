// import { CreateGroup } from "../components/dashboard/CreateGroup";
// import { GroupInfo } from "../components/dashboard/GroupInfo";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import SideNav from "../components/dashboard/SideNav";
import { Overview, PleaseLogin } from "../components/dashboard";
import { CompanyInfo } from "../components/dashboard/CompanyView";

function Dashboard({
  contractAddress,
  contractABI,
}: {
  contractAddress: `0x${string}`;
  contractABI: any[];
}) {
  const { address } = useAccount();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleSidebarItemClick = (item: any, contractAdd: any) => {
    setSelectedItem(item);
    if (item === "Group") {
      setSelectedCompany(contractAdd);
    }
  };

  useEffect(() => {}, [selectedCompany]);

  if (!address) {
    return <PleaseLogin />;
  } else {
    const content = () => {
      if (selectedItem === "general") {
        return (
          <Overview
            contractAddress={contractAddress}
            contractABI={contractABI}
            address={address}
          />
        );
      } else if (selectedItem === "loans") {
        return (
        //   <CreateGroup
        //     contractAddress={contractAddress}
        //     contractABI={contractABI}
        //     address={address}
        //   />
        <h1 className="text-2xl font-bold text-center">Loans: Coming soon... </h1>
        );
      } else if (selectedItem === "Group") {
        return (
          <CompanyInfo
            contractAdd={selectedCompany}
            contractAddress={contractAddress}
            contractABI={contractABI}
            address={address}
          />
        
        );
      } else {
        return (
          <div className="mt-5 my-5 py-5">
            <Overview
              contractAddress={contractAddress}
              contractABI={contractABI}
              address={address}
            />
          </div>
        );
      }
    };

    return (
      <div className="flex">
        <SideNav
          contractAddress={contractAddress}
          contractABI={contractABI}
          onItemClick={handleSidebarItemClick}
          address={address}
        />
        <div className="flex-grow mt-8 mb-8">{content()}</div>
      </div>
    );
  }
}

export default Dashboard;