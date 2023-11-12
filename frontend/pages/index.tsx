import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import axios from "axios";
import Head from "next/head";
type ApiResponseData = {
  token0: string;
  token1: string;
  tax: number;
  isHoneyPot: boolean;
  tokenAddress: string;
};

type ApiResponse = {
  data: ApiResponseData;
  transaction: string;
};

const Home: React.FC = () => {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.get<ApiResponse>(
        `http://qoc2vc2k09aab538plivjaje90.ingress.palmito.duckdns.org/?tokenAddress=${contractAddress}`
      );
      setResponseData(response.data);
    } catch (error) {
      console.error("Error making the API call", error);
    }
    
  };

  return (
    <>
     <Head>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>
      <Navbar />

      <div
        className="flex flex-col items-center justify-center"
        style={{
          backgroundImage:
            'url("https://static2.gopluslabs.io/images/token_banner_bg.png?a7185acd115cd7deeebfd1fc7ad7b8f7")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minWidth: "1680px", // Set the minimum width you desire
          minHeight: "768px", // Set the minimum height you desire
          width: "100%",
          height: "30vh", // This will make the div take the full height of the viewport
        }}
      >
        <div className="w-full max-w-4xl p-8 text-white bg-blue-900 bg-opacity-75 rounded-lg">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Token security detection</h1>
            <p className="mt-2 text-lg">
              Open, permissionless, user-driven token security detection
              platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex mt-1">
              <input
                type="text"
                placeholder="Enter contract address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="block w-full rounded-lg border-2 border-gray-300 bg-white bg-opacity-50 shadow-sm p-3 text-gray-700 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-green-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Check
              </button>
            </div>
          </form>
          {responseData && (
            <div className="response-data mt-6 p-4 w-full max-w-md mx-auto bg-white bg-opacity-90 rounded-lg shadow-lg overflow-hidden">
              <div className="text-sm text-gray-700 space-y-2">
                <p className="truncate">
                  <strong>Token :</strong> {responseData.data.token0}
                </p>
                <p className="truncate">
                  <strong>Token :</strong> {responseData.data.token1}
                </p>
                <p className="truncate">
                  <strong>Tax:</strong> {responseData.data.tax.toFixed(2)}
                </p>
                <p className="truncate">
                  <strong>Is Honey Pot:</strong>{" "}
                  {responseData.data.isHoneyPot ? "Yes" : "No"}
                </p>
                <p className="break-all">
                  <strong>Token Address:</strong>{" "}
                  {responseData.data.tokenAddress}
                </p>
                <p className="break-words">
                  <strong>Transaction:</strong> {responseData.transaction}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
