import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { customFetch } from '../../utils/customFetch';

const AdminLayout = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();  
   
     useEffect(() => {
       const verifyToken = async () => {
         const token = localStorage.getItem('token');
   
         if (!token) {
           navigate('/login');
           return;
         }
   
         try {
           const result = await customFetch('GET', token, null, 'auth/user');
           if (result.role !== 'admin') {
             navigate('/login');
           }
         } catch (error) {
           console.error('Error verifying token:', error);
           navigate('/login');
         }
       };
   
       verifyToken();
     }, [navigate, dispatch]);
   
 
    return (
      <div>
        <Outlet />
      </div>
    );
  };
  
export default AdminLayout