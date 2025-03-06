import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import SignIn from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import EnvironmentManagement from "./pages/EnvironmentManagement";
import History from "./pages/History";
import NotFoundPage from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import { BsHouse, BsClock, BsEnvelope, BsBoxArrowRight } from "react-icons/bs";
import { setToken } from "./redux/auth.slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function MainLayout() {
  const location = useLocation(); // Get the current route
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if the current route is SignIn or SignUp
  const shouldNotHideSidebar =
    location.pathname === "/" ||
    location.pathname === "/history" ||
    location.pathname === "/environment";

  const signOut = () => {
    dispatch(setToken(null));
    localStorage.removeItem("access_token");
    navigate("/signin");
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Top Navbar */}
      <div className="flex items-center justify-between py-2 h-12 bg-white border-b border-gray-200">
        {/* Left side: APIverse */}
        <div className="text-xl font-semibold ml-6">
          APIverse - API management app
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hide it if we're on SignIn or SignUp page */}
        {shouldNotHideSidebar && (
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
              <p
                onClick={signOut}
                className="p-4 hover:bg-[#FF6C37] hover:text-white transition-colors flex items-center"
                title="Sign out"
              >
                <BsBoxArrowRight className="inline-block mr-4 text-xl" />
              </p>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <History />
                </PrivateRoute>
              }
            />
            <Route
              path="/environment"
              element={
                <PrivateRoute>
                  <EnvironmentManagement />
                </PrivateRoute>
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/*" element={<NotFoundPage />} />
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
