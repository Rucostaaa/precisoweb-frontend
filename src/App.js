import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
  ScrollRestoration,
} from "react-router-dom";
import UserFooter from "./components/designLayouts/user/UserFooter";
import Header from "./components/home/Header/Header";
import UnAuthReboque from "./pages/Reboque/UnAuthReboque";
import Reboque from "./pages/Reboque/Reboque";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import UserDashboard from "./pages/User/UserDashboard";
import DriverDashboard from "./pages/Driver/DriverDashboard";
import DriverHistory from "./pages/Driver/DriverHistory";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useEffect, useState } from "react";
import { customFetch } from "./utils/customFetch";
import { setUser } from "./redux/user";
import { useDispatch, useSelector } from "react-redux";
import DriverFooter from "./components/driver/DriverFooter";
import MapComponent from "./components/designLayouts/MapComponent";
import DriverNavBar from "./components/driver/DriverNavBar";
import Settings from "./pages/Driver/Settings";
import CreateToken from "./pages/Admin/CreateToken";
import AdminLayout from "./pages/Layouts/AdminLayout";
import Services from "./pages/User/Services";
import UserSettings from "./pages/User/UserSettings";
import CurrentOrder from "./components/currentOrder/CurrentOrder";
import WhatsApp from "./components/designLayouts/user/WhatsApp";

// Layout for general pages
const Layout = () => {
  return (
    <div>
      <ScrollRestoration />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

const UserLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user=useSelector((state)=>state.user)
  const [modal, setModal] = useState(false);
  const currentOrder = user?.currentOrder;

  useEffect(() => {
    // Function to verify the token
    const verifyToken = async () => {
      const token = localStorage.getItem('token'); // Get the token from localStorage or cookies

      if (!token) {
        navigate('/login'); // Redirect to login if there's no token
        return;
      }

      try {
        // Make the API call to verify the token
        const result = await customFetch('GET', token, null, 'auth/user');
        const currentOrder=result.orders.filter((order)=>order.state!=="finalized"||"completed")
        dispatch(setUser({ field: "name", value: result.name }));
        dispatch(setUser({ field: "orders", value: result.orders }));
        dispatch(setUser({ field: "onGoingOrders", value:currentOrder }));
      } catch (error) {
        console.error('Error verifying token:', error);
        navigate('/login'); // Redirect to login on error
      }
    };

    verifyToken(); // Call the function to verify the token
  }, [navigate, dispatch]); // Ensure useEffect runs only when necessary

  useEffect(() => {
    setModal(!!currentOrder && Object.keys(currentOrder).length > 0);
  }, [currentOrder]);
  return (
    <div>
      <Header />
      <Outlet />
      {modal && <CurrentOrder />}
      <WhatsApp/>
      <UserFooter/>
    </div>
  );
};

const DriverLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Function to verify the token
    const verifyToken = async () => {
      const token = localStorage.getItem('token'); // Get the token from localStorage or cookies

      if (!token) {
        navigate('/login'); // Redirect to login if there's no token
        return;
      }

      try {
        // Make the API call to verify the token
        const result = await customFetch('GET', token, null, 'auth/user');
        
        dispatch(setUser({ field: "orders", value: result.orders }));
      } catch (error) {
        console.error('Error verifying token:', error);
        navigate('/login'); // Redirect to login on error
      }
    };

    verifyToken(); // Call the function to verify the token
  }, [navigate, dispatch]); // Ensure useEffect runs only when necessary

  return (<>
          <DriverNavBar/>

    <div className="flex">
        <Outlet />
            <div className="relative">
                  <MapComponent />
            </div>
    </div>
        <DriverFooter/>
    </>
  );
};

// Define router with correct paths and layouts
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        {/* Main routes */}
        <Route index element={<Reboque />} />
        <Route path="solicitar-servico/user/:token" element={<UnAuthReboque />} />

        <Route path="user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>

        {/* Driver routes */}
        <Route path="driver" element={<DriverLayout />}>
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="services" element={<DriverHistory />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="admin-dashboard" element={<AdminLayout/>}>
          <Route path="send-auth" element={<CreateToken/>} />
        </Route>

        {/* Auth routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
      </Route>
    </Route>
  ),
  {
    future: {
      v7_startTransition: true, // Enable the transition behavior early
    },
  }
);


function App() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
