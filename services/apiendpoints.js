import axios from 'axios';
import AuthStore from '../src/models/authentication';

export const URL = 'http://192.168.45.99:4002';

const API_URL=`${URL}/api/v1`;

const AxiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthStore._currentValue.token}`
    }
}

// USER AUTHENTICATION AND MODIFICATION
/**
* Logs into Axios and returns the response. If there is an error the error is logged to the console
* 
* @param email - The email to login with
* @param password - The password to login with. This is required
* 
* @return { Promise } The response from the API or an error in case of an error. It's the same object returned by the
*/
export async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    }, AxiosConfig);
    if(response.data){
      return response.data;
    }else{
      return {success: false, message: 'Login failed. Please try again.'};
    } 
  } catch (error) {
    return error.response.data;
  }
}

/**
* Register a new user in Axios. Returns a promise that resolves on success or rejects on failure.
* 
* @param email - The email of the user to register. This can be any string but it is recommended that you use lowercase letters and numbers only.
* @param password - The password for the user to register. This can be any string but it is recommended that you use lowercase letters and numbers only.
* @param name - The name of the user to register. This can be any string but it is recommended that you use lowercase letters and numbers only
* @param contact
* @param gender
* @param age
* @param avatar
*/
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

/**
* Update a user's profile. This is a wrapper around axios. put for use in tests
* 
* @param props - Object containing profile properties to update
* 
* @return { Promise } Profile object returned from axios. put ( { api_url :'api. v1 / me / update'user : { id :'2d6b6d9e6b6c'}
*/
export async function updateProfile(props){
  try{
    const response = await axios.put(`${API_URL}/me/update`, props, AxiosConfig);
    return response.data;
  }catch(error){
    console.log(error.response.data);
  }
}

/**
* Update password in Axios. Returns a Promise that resolves with the updated password on success or rejects with an error message on failure.
* 
* @param props - Properties to update in Axios. Must contain at least password and key.
* 
* @return { Promise } Promise that resolves with the response from API when the update is complete or rejected with an error
*/
export async function updatePassword(props){
  try{
    const response = await axios.put(`${API_URL}/password/update`, props, AxiosConfig);
    return response.data;
  }catch(error){
    return error.response.data;
  }
}

// FETCH REPORTS
/**
* Get a list of reports that the user has access to. This is used to check if the user has a report on the website or not.
* 
* 
* @return { Promise } A promise that resolves with the data returned from the API or an error object if an error occurred
*/
export async function getmyReports(){
  try{
    const reportresponse = await axios.post(`${API_URL}/myreports`, AxiosConfig);
    return reportresponse.data;
  }catch(error){
    return error;
  }
}

// FETCHING TRANSACTIONS
/**
* Get a list of transactions that the user has access to. This is useful for checking if a user has paid your payment or not.
* 
* 
* @return { Promise } Object containing transaction data or error if something goes wrong. See AXiosResponse for more information
*/
export async function getmyTransactions(){
  try{
    const transactionresponse = await axios.post(`${API_URL}/mytransactions`, AxiosConfig);
    return transactionresponse.data;
  }catch(error){
    return error;
  }
}

// FETCHING CATEGORIES
/**
* Get list of categories from Axios. com. This is a wrapper around the API call that allows you to query the API for a list of categories.
* 
* 
* @return { Promise } Array of categories in alphabetical order. { category : { name :'Martin'category_type :'Favorite '
*/
export async function getCategories(){
  try{
    const categoryresponse = await axios.get(`${API_URL}/categories`, AxiosConfig);
    return categoryresponse.data;
  }catch(error){
    console.log(error);
  }
}

/**
* Get information about a single category. This is a convenience function for making a request to the Axios API that will return a single category and not an array of categories
* 
* @param id - The id of the category to retrieve
* 
* @return { Promise } The category's data or null if there was an error with the API ( response. error )
*/
export async function getSingleCategory(id){
  try{
    const categoryresponse = await axios.get(`${API_URL}/categories/${id}`, AxiosConfig);
    return categoryresponse.data;
  }catch(error){
    console.log(error);
  }
}

// FETCHING SERVICES
/**
* Get list of services. This is a wrapper around axios. get which handles errors. The response is an object with keys : service_name : Name of service to be queried service_description : Description of service to be queried
* 
* 
* @return { Promise } A promise that resolves with a list of services or rejects with an error message if there was
*/
export async function getServices(){
  try{
    const serviceresponse = await axios.get(`${API_URL}/services`, AxiosConfig);
    return serviceresponse.data;
  }catch(error){
    console.log(error);
  }
}

// FETCHING INQUIRIES
/**
* Get list of inquiries for currently logged in user. This is a wrapper around axios. get which returns data in an object.
* 
* 
* @return Promise resolved with data or error if something goes wrong. { object } Inquiries object if everything worked
*/
export async function getmyInquiries(){
  try{
    const inquiriesresponse = await axios.get(`${API_URL}/my-inquiries`, AxiosConfig);
    return inquiriesresponse.data;
  }catch(error){
    return error;
  }
}

/**
* Creates a new inquiry. This is a convenience method for creating a new inquiry with the given properties
* 
* @param props - The properties to create the inquiry with
* 
* @return { Promise } The inquiry or error if something goes wrong. See the axios. js docs for
*/
export async function createanInquiry(props){
  try{
    const inquiryresponse = await axios.post(`${API_URL}/inquiry/new`, props, AxiosConfig);
    return inquiryresponse.data;
  }catch(error){
    return error;
  }
}

/**
* Add or update inquiries for a client. This is a wrapper around axios. post that handles errors
* 
* @param props - Client properties to add or update
* 
* @return { Promise } Promise with client inquiries data or error from axios. post on failure
*/
export async function getClientInquiries(props){
  try{
    const getClientInquiriesresponse = await axios.post(`${API_URL}/client-inquiries`, props, AxiosConfig);
    return getClientInquiriesresponse.data;
  }catch(error){
    return error;
  }
}

export async function getSingleInquiry(id){
  try{
    const inquiryresponse = await axios.get(`${API_URL}/inquiry/${id}`, AxiosConfig);
    return inquiryresponse.data;
  }catch(error){
    return error;
  }
}

// FETCHING REQUESTS
/**
* Get a list of requests made to the API. You can use this to check if you have a user or an API that is running in the context of a web app.
* 
* 
* @return { Promise } A promise that resolves with an object containing request information. The object is in the form { requestid : number requeststatus : string
*/
export async function getmyRequests(){
  try{
    const requestresponse = await axios.get(`${API_URL}/myrequests`, AxiosConfig);
    return requestresponse.data;
  }catch(error){
    console.log(error);
  }
}

/**
* Get information about a single request. This is a helper function for getmyRequests (). It takes an id of a request and returns the response from Axios
* 
* @param id - The id of the request to retrieve
* 
* @return { Promise } The response from Axios that contains the request's data or null if there was an
*/
export async function getmySingleRequest(id){
  try{
    const requestresponse = await axios.get(`${API_URL}/myrequests/${id}`, AxiosConfig)
    return requestresponse.data;
  }catch(error){
    console.log(error);
  }
}

/**
* Creates a request to be used in a test. This is a helper function to create a request and return the response
* 
* @param props - Object containing data to send to Axios
* 
* @return { Promise } Promise that resolves with the response or error from API call on failure. In case of success the response object is
*/
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

/**
* Edit details of a My Request. This is a general function to edit a My Request in Axios
* 
* @param data - Data that needs to be edited
* 
* @return { Promise } edited my request or error if something goes wrong ( response. data is undefined ) or the
*/
export async function editmyRequest(data){
  try{
    const editresponse = await axios.put(`${API_URL}/myrequest/edit/${data._id}`, data, AxiosConfig);
    return editresponse.data;
  }catch(error){
    return error.response.data
  }
}

/**
* Cancels a request made by the user. This is a non - blocking call. If you want to cancel a request you must pass the id of the request as the first parameter
* 
* @param id - The id of the request
* 
* @return { Promise } Resolves to the response from the API or an error object if something goes wrong. In case of success the response object has the following properties
*/
export async function cancelmyRequest(id){
  try{
    const cancelresponse = await axios.put(`${API_URL}/myrequest/cancel/${id}`, AxiosConfig);
    return cancelresponse.data;
  }catch(error){
    return error.response.data
  }
}

// CLIENT OFFER
/**
* Refuse an offer by id. This is a convenience method that calls the refuse API with the offer's _id as the parameter.
* 
* @param id - The id of the offer to refuse.
* 
* @return { Promise } Resolves with the refuse data or error message on failure. Note that you must use this method in conjuction with awaitOffer
*/
export async function refuseanOffer(props){
  try{
    const refuseresponse = await axios.post(`${API_URL}/myrequest/offer/refuse`, props , AxiosConfig);
    return refuseresponse.data;
  }catch(error){
    return error;
  }
}

/**
* Accepts an offer to be sent to the Airbrake servers. This is a convenience function for calling
* 
* @param props - A hash of properties to be used in the request
* 
* @return { Promise } Resolves with the response from Server or an error if something goes wrong
*/
export async function acceptanOffer(props){
  try{
    const acceptresponse = await axios.post(`${API_URL}/myrequest/offer/accept`, props , AxiosConfig);
    return acceptresponse.data;
  }catch(error){
    return error;
  }
}

/**
* Checks to see if a transaction is valid by making a POST request to the API. This is used to make sure we don't accidentally get stuck in a bad state when trying to create a new transaction
* 
* @param props - The properties to check for
* 
* @return { Promise } The response from the API or an error if something goes wrong ( response. data is undefined
*/
export async function checkfortransaction(props){
  try{
    const checkresponse = await axios.post(`${API_URL}/transactions/check`, props, AxiosConfig);
    return checkresponse.data;
  }catch(error){
    return error;
  }
}

/**
* Completes an offer by completing the transaction. This is a convenience method that calls the / transactions / complete endpoint
* 
* @param props - The transaction properties to complete
* 
* @return { Promise } Resolves with the response from the API or rejects with an error message if something goes
*/
export async function completeanOffer(props){
  try{
    const completeresponse = await axios.post(`${API_URL}/transactions/complete`, props, AxiosConfig);
    return completeresponse.data;
  }catch(error){
    return error;
  }
}

/**
* Ratefreelancer is a method to send a rate request to the API. It takes a hash of properties that you want to send with the request
* 
* @param props - A hash of properties you want to send with the request
* 
* @return { Promise } Promise of the response from the API or error from the API ( if an error occured
*/
export async function ratefreelancer(props){
  try{
    const rateresponse = await axios.post(`${API_URL}/transactions/client/rate`, props, AxiosConfig);
    return rateresponse.data;
  }catch(error){
    return error;
  }
}

/**
* Report a free client. This is a low - level function used to report a free client to Asterisk
* 
* @param props - The client properties to report
* 
* @return { Promise } Resolves with the data returned from Asterisk or error if something goes wrong. Reports are returned as a JSON object
*/
export async function reportfreelancer(props){
  try{
    const reportresponse = await axios.post(`${API_URL}/transactions/client/report`, props, AxiosConfig);
    return reportresponse.data
  }catch(error){
    return error;
  }
}

// CLIENT FREELANCER
/**
* Get information about a freelancer. This is a function that takes an ID and returns a Freelancer object
* 
* @param id - ID of the freelancer to retrieve
* 
* @return { Object } Freelancer object or error from axios. js if there is an
*/
export async function getFreelancer(id){
  try{
    const freelancerresponse = await axios.get(`${API_URL}/freelancer/${id}`, AxiosConfig);
    return freelancerresponse.data;
  }catch(error){
    return error;
  }
}

// FREELANCER
/**
* Register a freelancer to be used in a test. This is a POST request and should be used with care as the result of an auth. register call
* 
* @param props - Properties to be passed to Freelancer
* 
* @return { Promise } Resolves with result of API call or error message on failure. In case of success the object returned is the same as the one returned by the
*/
export async function registerasfreelancer(props){
  try{
    const freelancerresponse = await axios.post(`${API_URL}/freelancers/register`, props, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${AuthStore._currentValue.token}`
      },
    });
    return freelancerresponse.data;
  }catch(error){
    return error.response.data
  }
}

/**
* Freelancer status ( status of freesurfer ) This is used to check if a user is in a free or unfreezed context
* 
* 
* @return { Promise } The status of the freelancer or an error if something goes wrong ( response. data is undefined
*/
export async function freelancerstatus(){
  try{
    const freelancerstatusresponse = await axios.post(`${API_URL}/freelancers/me`, AxiosConfig);
    return freelancerstatusresponse.data;
  }catch(error){
    return error.response.data
  }
}

/**
* Update properties of freelancer. This is a convenience method for making updates to freelancer's properties
* 
* @param props - Freelancer properties to be updated
* 
* @return { Promise } The updated freelancer's data or an error if something goes wrong ( response could be undefined
*/
export async function updatefreelancer(props){
  try{
    const freelancerupdateresponse = await axios.post(`${API_URL}/freelancers/update`, props, AxiosConfig);
    return freelancerupdateresponse.data;
  }catch(error){
    return error.response.data
  }
}


export async function upgradefreelancer(props){
  try{
    const freelancerupgraderesponse = await axios.post(`${API_URL}/freelancers/upgrade`, props, AxiosConfig);
    return freelancerupgraderesponse.data;
  }catch(error){
    return error.response.data
  }
}

// FREELANCER JOBS
/**
* Get Freelancer's jobs. This is a helper function for ` requestfreelancer `
* 
* @param props - Properties to query the API with
* 
* @return { Promise } Array of Freelancer
*/
export async function getfreelancerjobs(props){
  try{
    const freelancerjobsresponse = await axios.post(`${API_URL}/requests/freelancer`, props, AxiosConfig);
    return freelancerjobsresponse.data;
  }catch(error){
    return error.response.data;
  }
}

// FREELANCER SERVICES
/**
* Returns list of services available to the logged in user. This is a freelancer and can be used to check if a user is indempotent or not.
* 
* 
* @return { Promise } Array of services in the form { servicename : { servicetype :'Freelancer'servicename :'Freeelancer '
*/
export async function getmyServices(){
  try{
    const servicesresponse = await axios.post(`${API_URL}/services/freelancer`, AxiosConfig);
    return servicesresponse.data
  }catch(error){
    return error.response.data;
  }
}

/**
* Create a new service on Axios. It is possible to create multiple services at once. The service properties are passed as a JSON object
* 
* @param props - Object with service properties.
* 
* @return { Promise } Resolves with service object or error object on failure. In case of success the object is returned
*/
export async function createmyServices(props){
  try{
    const createservicesresponse = await axios.post(`${API_URL}/service/new`, props, AxiosConfig);
    return createservicesresponse.data;
  }catch(error){
    return error.response.data
  }
}

// FREELANCER OFFERS
/**
* Get my offers from Axios. com. This is a wrapper around the API call that allows you to get the list of offers that you have registered with Axios.
* 
* 
* @return { Promise } A promise that resolves with an array of offers or an error object if there was a problem
*/
export async function myOffers(){
  try{
    const offersresponse = await axios.get(`${API_URL}/myoffers`, AxiosConfig);
    return offersresponse.data;
  }catch(error){
    return error.response.data
  }
}

/**
* Offers services to Axios. This is a low - level method for making a request to the API to offer services.
* 
* @param props - Object containing service properties. See API docs for more information.
* 
* @return { Promise } Resolves with the offered service or error if something goes wrong. Possible errors include : A server error occurred. MissingRequiredArgument : If the argument is missing required or invalid
*/
export async function offerservices(props){
  try{
    const offerresponse = await axios.post(`${API_URL}/offer/new`, props, AxiosConfig);
    return offerresponse.data;
  }catch(error){
    return error;
  }
}

/**
* Get offers for a request. This is a wrapper around axios. get () to allow you to pass in the id of the request
* 
* @param id - The id of the request
* 
* @return { Promise } The response or error from axios. get () if something goes wrong or is not
*/
export async function getoffersRequest(id){
  try{
    const offerresponse = await axios.get(`${API_URL}/offers-request/${id}`, AxiosConfig);
    return offerresponse.data;
  }catch(error){
    return error
  }
}

// FREELANCER RATINGS
/**
* Get ratings for a service. This is a wrapper around axios. post that handles errors.
* 
* @param service_id - The service to get ratings for.
* 
* @return { Promise } A promise that resolves with the ratings for the service or an error object if something goes wrong
*/
export async function getmyServiceRatings(service_id){
  try{
    const ratingsresponse = await axios.post(`${API_URL}/myratings`, {service_id}, AxiosConfig);
    return ratingsresponse.data;
  }catch(error){
    return error.response.data
  }
}

// FREELANCER TRANSACTIONS
/**
* Fetches transaction from Freelancer's API and returns it.
* 
* 
* @return { Promise } Resolves with transaction data or error
*/
export async function FreelancerFetchTransaction(){
  try{
    const transactionresponse = await axios.post(`${API_URL}/myfreelancertransactions`, AxiosConfig);
    return transactionresponse.data;
  }catch(error){
    return error;
  }
}

/**
* Generates a transaction based on the properties passed to it. This is useful for generating transactions that are part of a transaction - chain
* 
* @param props - The properties to use for the transaction
* 
* @return { Promise } The transaction or error from the axios
*/
export async function generateTransaction(props){
  try{
    const transactionresponse = await axios.post(`${API_URL}/myfreelancertransactions/generatetransaction`, props, AxiosConfig);
    return transactionresponse.data;
  }catch(error){
    return error;
  }
}

/**
* Completes a transaction by submitting a request to Freelancer
* 
* @param props - transaction properties to be submitted
* 
* @return { Promise } Promise of the transaction data or error
*/
export async function completeTransaction(props){
  try{
    const transactionresponse = await axios.post(`${API_URL}/myfreelancertransactions/completetransaction`, props, AxiosConfig);
    return transactionresponse.data;
  }catch(error){
    return error;
  }
}

/**
* Reports a transaction to Freelancer. This is a POST request to the API
* 
* @param props - Object with transaction properties. See reportTransaction for details
* 
* @return { Promise } Promise with
*/
export async function reportTransaction(props){
  try{
    const transactionresponse = await axios.post(`${API_URL}/myfreelancertransactions/reporttransaction`, props, AxiosConfig);
    return transactionresponse.data;
  }catch(error){
    return error;
  }
}

// CHATS
/**
* Fetches chats from Axios. com and returns them as an array of Chat objects
* 
* 
* @return { Promise } Array of Chat
*/
export async function fetchChats(){
  try{
    const chatsresponse = await axios.get(`${API_URL}/chat`, AxiosConfig);
    return chatsresponse.data;
  }catch(error){
    return error;
  }
}

/**
* Get chat information from Axios. com. This is used to send messages to a user or to chat a user.
* 
* 
* @return { Promise } Object containing the chat information or error
*/
export async function getChat(props){
  try{
    const chatresponse = await axios.post(`${API_URL}/chat`, props, AxiosConfig);
    return chatresponse.data;
  }catch(error){
    return error;
  }
}

// MESSAGES
/**
* Use this method to get messages from a chat. Requires Authentication : True for the user to be an administrator and must have the appropiate rights
* 
* @param chatId - Unique identifier for the target chat or username of the target channel ( in the format @channelusername )
* 
* @return { Promise } An object containing the messages on success
*/
export async function fetchMessages(chatId){
  try{
    const messagesresponse = await axios.get(`${API_URL}/messages/${chatId}`, AxiosConfig);
    return messagesresponse.data;
  }catch(error){
    return error;
  }
}

/**
* Sends a message to Axios. This is a wrapper around the Post API for sending messages
* 
* @param props - The properties to send to Axios
* 
* @return { Promise } The response from the API or error
*/
export async function sendMessage(props){
  // content, chatId
  try{
    const messagesresponse = await axios.post(`${API_URL}/message/new`, props, AxiosConfig);
    return messagesresponse.data;
  }catch(error){
    return error;
  }
}

export async function FetchTransactionbyOfferorInquiry(props){
  try{
    const messagesresponse = await axios.post(`${API_URL}/messages/transaction/offerorinquiry`, props, AxiosConfig);
    return messagesresponse.data;
  }catch(error){
    return error;
  }
}

export async function AddOfferandTransactionbyInquiry(props){
  try{
    const messagesresponse = await axios.post(`${API_URL}/messages/transaction/offerorinquiry/new`, props, AxiosConfig);
    return messagesresponse.data;
  }catch(error){
    return error;
  }
}