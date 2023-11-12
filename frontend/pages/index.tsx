// pages/index.js
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [blockchain, setBlockchain] = useState("Ethereum");
  const [contractAddress, setContractAddress] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // You would handle the submission to the backend here
    console.log(blockchain, contractAddress);
  };

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen flex-col items-center justify-center bg-blue-900">
        <div className="w-full max-w-4xl p-8 text-white">
          <h1 className="text-4xl font-bold">Token security detection</h1>
          <p className="mt-2 text-lg">
            open, permissionless, user-driven token security detection platform
          </p>
          <form onSubmit={handleSubmit} className="mt-6">
            <label htmlFor="blockchain" className="block text-sm font-medium">
              Blockchain
            </label>
            <div className="flex mt-1">
              <select
                id="blockchain"
                name="blockchain"
                value={blockchain}
                onChange={(e) => setBlockchain(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {/* Populate with actual options */}
                <option value="Ethereum">Ethereum</option>
                <option value="Bitcoin">Bitcoin</option>
                {/* ...other blockchains */}
              </select>
              <input
                type="text"
                placeholder="Enter contract address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="block w-full ml-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="mt-4 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Check
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
