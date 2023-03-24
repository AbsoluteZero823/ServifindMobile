import axios from 'axios';
import AuthStore from '../src/models/authentication';

const API_URL='http://192.168.0.57:4002/api/v1';

const AxiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthStore._currentValue.token}`
    }
}
// USER AUTHENTICATION AND MODIFICATION (working)
export async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: email,
      password: password
    }, AxiosConfig);
    console.log(response.data)
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

// FETCHING CATEGORIES (Working)
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

// FETCHING SERVICES
export async function getServices(){
  try{
    const serviceresponse = await axios.get(`${API_URL}/services`, AxiosConfig);
    return serviceresponse.data;
  }catch(error){
    console.log(error);
  }
}

// FETCHING INQUIRIES
export async function getmyInquiries(){
  try{
    const inquiriesresponse = await axios.get(`${API_URL}/my-inquiries`, AxiosConfig);
    return inquiriesresponse.data;
  }catch(error){
    return error;
  }
}

export async function createanInquiry(props){
  try{
    const inquiryresponse = await axios.post(`${API_URL}/inquiry/new`, props, AxiosConfig);
    return inquiryresponse.data;
  }catch(error){
    return error;
  }
}

// FETCHING REQUESTS
export async function getmyRequests(){
  try{
    const requestresponse = await axios.get(`${API_URL}/myrequests`, AxiosConfig);
    return requestresponse.data;
  }catch(error){
    console.log(error);
  }
}

export async function getmySingleRequest(id){
  try{
    const requestresponse = await axios.get(`${API_URL}/myrequests/${id}`, AxiosConfig)
    return requestresponse.data;
  }catch(error){
    console.log(error);
  }
}

export async function createmyRequest(props){
  try{
    let data = props;
    data.request_status = 'waiting';
    data.created_At = new Date();
    const requestresponse = await axios.post(`${API_URL}/request/new`, data, AxiosConfig);
    return requestresponse.data;
  }catch(error){
    return error;
  }
}

export async function editmyRequest(data){
  try{
    const editresponse = await axios.put(`${API_URL}/myrequest/edit/${data._id}`, data, AxiosConfig);
    return editresponse.data;
  }catch(error){
    return error.response.data
  }
}

export async function cancelmyRequest(id){
  try{
    const cancelresponse = await axios.put(`${API_URL}/myrequest/cancel/${id}`, AxiosConfig);
    return cancelresponse.data;
  }catch(error){
    return error.response.data
  }
}
