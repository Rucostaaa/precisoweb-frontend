import axios from "axios";
const SERVER_URL=process.env.REACT_APP_SERVER_URL
console.log(SERVER_URL);

export const customFetch = async (method, token, body, url) => {
  try {
    const response = await axios({
      method: method,
      url: `${SERVER_URL}/api/${url}`,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: body,  // Axios uses `data` for the request body instead of `body`
    });
    console.log("Axios response:",response);
    
    // Axios automatically parses the response to JSON, so no need to manually call `json()`
    return response.data;  // Return the response data
  } catch (error) {
    console.error("Axios error:", error.message);
    throw error;  // Re-throw the error to handle it at a higher level
  }
};
export const statusFetch = async (method, token, body, url) => {
  try {
    const response = await axios({
      method: method,
      url: `${SERVER_URL}/api/${url}`,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: body,  // Axios uses `data` for the request body instead of `body`
    });
    console.log("Axios response:",response);
    
    // Axios automatically parses the response to JSON, so no need to manually call `json()`
    return response;  // Return the response data
  } catch (error) {
    console.error("Axios error:", error);
    throw error;  
  }
};
