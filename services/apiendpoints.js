import axios from 'axios';
import AuthStore from '../src/models/authentication';

const API_URL='http://192.168.0.57:4002/api/v1';

const AxiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthStore._currentValue.token}`
    }
}

// This function makes a POST request to the login endpoint with the provided credentials
export async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, {
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

export async function update(props){
  try{
    console.log(props);
    const response = await axios.put(`${API_URL}/me/update`, {_id: props.id, props}, AxiosConfig);
    console.log(response);
    return response.data;
  }catch(error){
    console.log(error.response.data);
  }
}
