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
import { DEFI_WAGE_MANAGER_ABI, DEFI_WAGE_MANAGER_CONTRACT } from "../utils/contracts";
import Link from "next/link";


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
    
         
            const { hash } = await writeContract({
              address: DEFI_WAGE_MANAGER_CONTRACT,
              abi: DEFI_WAGE_MANAGER_ABI,
              functionName: "createCompany",
              args: [companyCID],
            });
    
            if (hash) {
              toast.success("Successfully created your company, click on view company to proceed");
    
              setInTxn(false);
              closeModal();
            } else {
              setInTxn(false);
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

      
<div className="bg-slate-800 py-3 pb-9 ">
  <div className="bg-gradient-to-b from-yellow-400/[.19] via-transparent">
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
      
      <div className="flex justify-center">
        <a className="group inline-block bg-white/[.05] hover:bg-white/[.1] border border-white/[.05] p-1 pl-4 rounded-full shadow-md" target="_blank" href="https://scroll.io/">
          <p className="mr-2 inline-block text-white text-sm">
            powered by: zK Scroll
          </p>
          <span className="group-hover:bg-white/[.1] py-2 px-3 inline-flex justify-center items-center gap-x-2 rounded-full bg-white/[.075] font-semibold text-white text-sm">
            <svg className="w-2.5 h-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14" stroke="currentColor" strokeWidth="2" stroke-linecap="round"/>
            </svg>
          </span>
        </a>
      </div>
    
 
      <div className="max-w-3xl text-center mx-auto">
        <h1 className="block font-medium text-gray-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          Salary, Loans <br /> Swift and Simple
        </h1>
      </div>
     

      <div className="max-w-3xl text-center mx-auto">
        <p className="text-lg text-gray-400">Register your company and automate salary payments, allowing your members to collect loans based on repayment terms.</p>
      </div>

     
      <div className="text-center">
        <Link onClick={openModal} className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-yellow-600 shadow-lg shadow-transparent hover:shadow-blue-700/50 border border-transparent text-white text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white py-3 px-6 dark:focus:ring-offset-gray-800" href="#">
          Register company
          <svg className="w-2.5 h-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14" stroke="currentColor" strokeWidth="2" stroke-linecap="round"/>
          </svg>
        </Link>
        <Link className="inline-flex justify-center items-center gap-x-1 text-center bg-gradient-to-tl from-blue-900 to-black-900 shadow-lg shadow-transparent hover:shadow-black-700/50 border border-transparent text-white text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white py-3 px-6 dark:focus:ring-offset-gray-800 mx-5" href="/dashboard">
          View company
          <svg className="w-2.5 h-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14" stroke="currentColor" strokeWidth="2" stroke-linecap="round"/>
          </svg>
        </Link>
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
                          <h1> Organisation details </h1>
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
                         
                          <div className="form-control mt-3 w-full max-w-xs ">
                            <label className="label">
                              <span className="label-text">Company Logo</span>
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
</div>


     
    </>
  );
};

export default Hero;
