import axios from 'axios';

const API_URL = "http://192.168.0.57:4002/api/v1";
const loginEndpoint = `${API_URL}/login`;
const AxiosConfig = {
    headers: {
        'Content-Type': 'application/json'
    }
}

// This function makes a POST request to the login endpoint with the provided credentials
export async function login(email, password) {
  try {
    const response = await axios.post(loginEndpoint, {
      email: email,
      password: password
    }, AxiosConfig);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function register(email, password, name, contact, gender, age, avatar){
  try{
    const response = await axios.post(`${API_URL}/register`, {
      email: email,
      password: password,
      name: name,
      contact: contact,
      gender: gender,
      age: age,
      avatar: avatar
    }, AxiosConfig);
    return response.data;
  }catch(error){
    return error.response.data;
  }
}
