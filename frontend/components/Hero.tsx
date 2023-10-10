import styles from "../styles/Home.module.css";
import toast, { Toaster } from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import {
    getJSONFromCID,
    getJSONFromFileinCID,
    pushImgToStorage,
    putFileandGetHash,
    putJSONandGetHash,
  } from "../utils/ipfsGateway";
import { useAccount } from "wagmi";
import { getNetwork, watchNetwork, writeContract } from "@wagmi/core";
import { parseEther } from "viem";
import { AVALANCHE_CONTRACT_ADDRESS, ECOMMERCE_ABI } from "../utils/contracts";


const Hero = () => {
  let [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [inTxn, setInTxn] = useState(false);
  const { chain, chains } = getNetwork()
  
  
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleProductImage = (e: any) => {
    setCompanyLogo(e.target.files[0]);
    toast.success("Successfully added Image!");
    setCoverImageUrl(URL.createObjectURL(e.target.files[0]));
  };


  const createCompany = async () => {
    try {
      if (companyLogo && companyName && description) {
        setInTxn(true);

        const productImgCID = await pushImgToStorage(companyLogo);
        const obj = {
          companyName: companyName,
          companyLogo: companyLogo,
          companyDescription: description,
        };

        const companyCID = await putJSONandGetHash(obj);
    
          if(chain?.id == 43113) {
            const { hash } = await writeContract({
              address: AVALANCHE_CONTRACT_ADDRESS,
              abi: ECOMMERCE_ABI,
              functionName: "createProduct",
              args: [],
            });
    
            if (hash) {
              toast.success("Successfully created Product on Avalanche");
    
              setInTxn(false);
              closeModal();
            } else {
              setInTxn(false);
            }
          }
     
     

     
      } else {
        toast.error("Please complete the form and try again");
        setInTxn(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
      setInTxn(false);
    }
  };

  return (
    <>
      <Toaster />

      <div
        className="hero min-h-screen  "
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              Salary, Loan requests and repayments made easy
            </h1>
            <p className="mb-5">
             Register your company and automate salary payments, allowing your members to collect loans based on repayment terms
            </p>
            <button className="btn" onClick={openModal}>
              Create Company Worksapace
            </button>

            <Transition appear show={isOpen} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Create a company workspace
                        </Dialog.Title>
                        <form method="dialog" className="modal-box ">
                          <h1>Create Ads</h1>
                          <div className="form-control w-full max-w-xs ">
                            <label className="label">
                              <span className="label-text">Company Name</span>
                            </label>
                            <input
                              onChange={(e) => {
                                setCompanyName(e.target.value);
                              }}
                              type="text"
                              placeholder="Enter product name"
                              className="input input-bordered w-full max-w-xs"
                            />
                          </div>
                          <div className="form-control w-full max-w-xs ">
                            <label className="label">
                              <span className="label-text">Description</span>
                            </label>
                            <input
                              onChange={(e) => {
                                setDescription(e.target.value);
                              }}
                              type="text"
                              placeholder="Enter description"
                              className="input input-bordered w-full max-w-xs"
                            />
                          </div>
                         
                          <div className="form-control w-full max-w-xs ">
                            <label className="label">
                              <span className="label-text">Product Image</span>
                            </label>
                            <input
                              onChange={handleProductImage}
                              type="file"
                              className="file-input file-input-bordered w-full max-w-xs"
                            />
                          </div>
                          <span
                            onClick={createCompany}
                            className="mt-2  btn btn-success btn-wide"
                          >
                            {" "}
                            {inTxn ? (
                              <span className="loading loading-infinity loading-lg">
                                loading
                              </span>
                            ) : (
                              "Create"
                            )}{" "}
                          </span>

                          <div className="modal-action">
                            {/* if there is a button in form, it will close the modal */}
                            <button onClick={closeModal} className="btn">
                              Close
                            </button>
                          </div>
                        </form>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
