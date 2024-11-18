import axios from "axios";

export const fetchProducts = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/v1/product");
    console.log(response);
    return response.data; // Axios stores the response data in `data`
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
