import axios from 'axios';
import AuthStore from '../src/models/authentication';

const API_URL='http://192.168.0.57:4002/api/v1';

const AxiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthStore._currentValue.token}`
    }
}
// THIS IS ALL FOR USER MODIFICATION
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

export async function updateProfile(props){
  try{
    const response = await axios.put(`${API_URL}/me/update`, props, AxiosConfig);
    return response.data;
  }catch(error){
    console.log(error.response.data);
  }
}

export async function updatePassword(props){
  try{
    const response = await axios.put(`${API_URL}/password/update`, props, AxiosConfig);
    return response.data;
  }catch(error){
    return error.response.data;
  }
}

// FETCHING CATEGORIES
export async function getCategories(){
  try{
    const categoryresponse = await axios.get(`${API_URL}/categories`, AxiosConfig);
    return categoryresponse.data;
  }catch(error){
    console.log(error);
  }
}

export async function getSingleCategory(id){
  try{
    const categoryresponse = await axios.get(`${API_URL}/categories/${id}`, AxiosConfig);
    return categoryresponse.data;
  }catch(error){
    console.log(error);
  }
}
