import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Image from "../designLayouts/Image";
import Flex from "../designLayouts/Flex";
import { useSelector } from "react-redux";
import Tradutor from "../tradutor/tradutor";

const DriverNavBar = () => {
  const language = useSelector((state) => state.loja.language);
  const location = useLocation();

  return (
    <div className="w-full h-16 bg-white sticky top-0 z-50 shadow-md">
      <nav className="h-full px-4 max-w-container mx-auto relative">
        <Flex className="flex items-center justify-between h-full">     
          {/* Navigation - Always Visible */}
          <motion.ul 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="items-center gap-3 text-sm"
          >
              <Link
                className="text-gray-700 font-normal hover:font-semibold px-3 py-1 transition-all hover:text-black underline-offset-4 hover:border-b-2 hover:border-black"
                to={"/driver/dashboard"}
                state={{ data: location.pathname.split("/")[1] }}
              >
                {"Painel"}
              </Link>
          </motion.ul>

          <div className="flex items-center gap-3">
            <Tradutor />          
          </div>
        </Flex>
      </nav>
    </div>
  );
};

export default DriverNavBar;