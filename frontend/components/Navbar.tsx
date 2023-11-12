import Link from "next/link";


const Navbar = () => {
  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            {/* Logo and Brand Name */}
            <Link
              href="/"
              className="text-white text-xl font-bold tracking-tighter hover:text-gray-300 transition duration-150 ease-in-out"
            >
              HoneyPot
            </Link>
          </div>
          <div className="hidden md:block">
            {/* Other navbar items can be added here */}
          </div>
          <div className="ml-4 flex items-center md:ml-6">
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
