import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import FooterListTitle from "./FooterListTitle";
import { useSelector } from "react-redux";


const Footer = () => {
  
  const language = useSelector((state) => state.loja.language);



  return (
    <div className="w-full bg-gradient-to-b from-gray-100 to-gray-300 py-14 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        
        {/* About Section */}
        <div>
          <FooterListTitle title={language === "pt" ? "Sobre Nós" : "About Us"} />
          <p className="text-gray-700 text-sm mt-4 leading-relaxed">
            {language === "pt"
              ? "Preciso"
              : "Ineed"}
          </p>
          {/* Social Media Icons */}
          <div className="flex gap-4 mt-4">
            {[{
              href: "https://www.facebook.com/Noorlalu143/",
              icon: <FaFacebook />,
              bgColor: "bg-blue-600",
            }, {
              href: "https://www.instagram.com/in/noor-mohammad-ab2245193/",
              icon: <FaInstagram />,
              bgColor: "bg-[#E4405F]",
            }].map(({ href, icon, bgColor }, idx) => (
              <a href={href} key={idx} target="_blank" rel="noreferrer">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-9 h-9 ${bgColor} text-white rounded-full flex items-center justify-center shadow-md transition-all`}
                >
                  {icon}
                </motion.div>
              </a>
            ))}
          </div>
        </div>

        {/* Shop Section */}


      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-400 mt-10 pt-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Preciso. {language === "pt" ? "Todos os direitos reservados." : "All rights reserved."}
      </div>
    </div>
  );
};

export default Footer;
