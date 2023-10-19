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
  const [selectedId, setSelectedId] = useState(null);

  const handleSidebarItemClick = (item: any, id: any) => {
    setSelectedItem(item);
    if (item === "Group") {
      setSelectedId(id);
    }
  };

  useEffect(() => {}, [selectedId]);

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
        ''
        );
      } else if (selectedItem === "Group") {
        return (
          <CompanyInfo
            currentID={selectedId}
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