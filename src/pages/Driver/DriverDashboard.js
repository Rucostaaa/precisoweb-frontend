import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDriver, } from "../../redux/driver";
import { customFetch } from "../../utils/customFetch"; // Adjust path if needed
import Tasks from "../../components/designLayouts/Tasks";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const driver = useSelector((state) => state.driver);
  console.log(driver);
  // Fetch driver data
  useEffect(() => {
    const fetchDriverData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const result = await customFetch("GET", token, null, "auth/user");
          
          if (result) {
            dispatch(
              setDriver({
                name: result.name,
                email: result.email,
                orders: result.orders,
                available: result.available,
                location: result.location,
              })
            );
          } else {
            console.log("Error fetching user data.");
          }
        } catch (error) {
          console.error("Error fetching driver data:", error);
        }
      }
    };

    fetchDriverData();
  }, [dispatch]);

  return (
    <>
      <div className="w-full p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <Tasks />
      </div>
    </>
  );
  
};

export default DriverDashboard;
