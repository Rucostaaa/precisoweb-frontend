import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { navBarList } from "../../../constants";
import Flex from "../../designLayouts/Flex";
import { useDispatch, useSelector } from "react-redux";
import Tradutor from "../../tradutor/tradutor";
import { customFetch } from "../../../utils/customFetch";
import { setUser } from "../../../redux/user";

const Header = () => {
  const language = useSelector((state) => state.loja.language);
  const user = useSelector((state) => state.user);
  const [auth,setAuth]=useState(false)
  const dispatch=useDispatch()
  const navigate=useNavigate()

  const location = useLocation();
 useEffect(() => {
    // Function to verify the token
    const verifyToken = async () => {
      const token = localStorage.getItem('token'); // Get the token from localStorage or cookies


      try {
        // Make the API call to verify the token
        const result = await customFetch('GET', token, null, 'auth/user');
        const currentOrder=result.orders.filter((order)=>order.state!=="finalized"||"completed")
        dispatch(setUser({ field: "name", value: result.name }));
        dispatch(setUser({ field: "orders", value: result.orders }));
        dispatch(setUser({ field: "onGoingOrders", value:currentOrder }));
        if(result){
          setAuth(true)
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setAuth(false)
      }
    };

    verifyToken(); // Call the function to verify the token
  }, [navigate, dispatch]); // Ensure useEffect runs only when necessary
  const userName = user?.name?.split?.(" ")[0] || "Utilizador";



  return (
    <div className="w-full h-16 bg-white sticky top-0 z-50 shadow-md">
      <nav className="h-full px-4 max-w-container mx-auto relative">
        <Flex className="flex items-center justify-between h-full">
          <motion.ul 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 text-sm"
          >
            {navBarList.map(({ _id, title, link }) => (
              <NavLink
                key={_id}
                className={({ isActive }) =>
                  `text-gray-700 font-normal px-3 py-1 transition-all hover:text-black underline-offset-4 ${
                    isActive ? "font-semibold border-b-2 border-black" : ""
                  }`
                }
                to={link}
                state={{ data: location.pathname.split("/")[1] }}
              >
                {title[language]}
              </NavLink>
            ))}
          </motion.ul>

          <div className="flex items-center gap-3">
            <Tradutor />
            <span>|</span>
            {!auth ? (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {language === "pt" ? "Entrar" : "Login"}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">
                {language === "pt" ? "Bem-vindo(a)" : "Welcome"},{" "}
                <span className="font-semibold">{userName}</span>
              </span>
            )}
          </div>
        </Flex>
      </nav>
    </div>
  );
};

export default Header;
