// Example of attaching token to API request
import axios from 'axios';

export const fetchData = async () => {
  const token = localStorage.getItem("token"); // Or get it from Redux store
  try {
    const response = await axios.get('http://localhost:5000/protected-route', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
