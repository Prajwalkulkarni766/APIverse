import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from "react-router-dom";
import SignIn from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import EnvironmentManagement from "./pages/EnvironmentManagement";
import History from "./pages/History";
import { BsDash, BsCopy, BsX, BsHouse, BsClock, BsEnvelope, BsBoxArrowRight } from "react-icons/bs";

function MainLayout() {
  const location = useLocation(); // Get the current route

  // Check if the current route is SignIn or SignUp
  const shouldHideSidebar = location.pathname === "/signin" || location.pathname === "/signup";

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Top Navbar */}
      <div className="flex items-center justify-between py-2 h-12 bg-white border-b border-gray-200">
        {/* Left side: APIverse */}
        <div className="text-xl font-semibold ml-6">APIverse - API management app</div>

        {/* Right side: Minimize, Maximize, Close Icons */}
        <div className="flex items-center space-x-4 pr-4">
          <div className="p-2 hover:bg-[#FF6C37] hover:text-white cursor-pointer">
            <BsDash className="text-xl" />
          </div>
          <div className="p-2 hover:bg-[#FF6C37] hover:text-white cursor-pointer">
            <BsCopy className="text-xl" />
          </div>
          <div className="p-2 hover:bg-[#FF6C37] hover:text-white cursor-pointer">
            <BsX className="text-xl" />
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hide it if we're on SignIn or SignUp page */}
        {!shouldHideSidebar && (
          <div className="w-18 flex flex-col border-r border-gray-200">
            <div className="flex flex-col">
              <Link
                to="/"
                className="p-4 hover:bg-[#FF6C37] hover:text-white transition-colors flex items-center"
                title="Home"
              >
                <BsHouse className="inline-block mr-4 text-xl" />
              </Link>
              <Link
                to="/history"
                className="p-4 hover:bg-[#FF6C37] hover:text-white transition-colors flex items-center"
                title="History"
              >
                <BsClock className="inline-block mr-4 text-xl" />
              </Link>
              <Link
                to="/environment"
                className="p-4 hover:bg-[#FF6C37] hover:text-white transition-colors flex items-center"
                title="Environment"
              >
                <BsEnvelope className="inline-block mr-4 text-xl" />
              </Link>
              <Link
                to="/signin"
                className="p-4 hover:bg-[#FF6C37] hover:text-white transition-colors flex items-center"
                title="Sign out"
              >
                <BsBoxArrowRight className="inline-block mr-4 text-xl" />
              </Link>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/environment" element={<EnvironmentManagement />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;