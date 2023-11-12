// components/Navbar.js
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="-ml-2 mr-6 flex items-center">
              {/* Logo and Brand Name */}
              <Link className="text-white text-lg font-bold" href="/">
                Starknetkit
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {/* Other navbar items */}
            <Link
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              href="/connect"
            >
              Connect Wallet
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
