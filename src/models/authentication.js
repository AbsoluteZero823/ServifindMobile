import { types } from "mobx-state-tree";
import { createContext } from "react";

const Auth = types
.model("Auth", {
    token: types.optional(types.string, ""),
    isAuthenticated: types.optional(types.boolean,false),
    role: types.optional(types.string,'customer'),
    isLoading: types.optional(types.boolean,false),
    UserType: types.maybe(types.enumeration(['Client','Freelancer','customer'])),
})
.actions((self) => ({
    /**
    * / / object / list object is used to determine the type of object that is being
    */
    letmeload(){
        self.isLoading = true;
    },
    /**
    * / / object / list object is used to determine the type of object that is being
    */
    donewithload(){
        self.isLoading = false;
    },
    /**
    * @param token
    * @param role
    */
    loggedin(token, role) {
        self.role = role;
        self.isAuthenticated = true;
        self.token = token;
    },
    /**
    * / / object / list to be used in a call to any of the methods of the object
    */
    logout() {
        self.token = "";
        self.isAuthenticated = false;
        self.role = 'customer';
        self.UserType = undefined;
    },
    /**
    * @param UserType
    */
    setUserType(UserType){
        self.UserType = UserType;
    },
    /**
    * @param role
    */
    setmyrole(role){
        self.role = role;
    }
}))
.views((self) => ({
    /**
    * Whether or not the user is amiauth authenticated. This is useful for determining if we're authenticating or not.
    * 
    * 
    * @return { boolean } True if the user is amiauth authenticated false otherwise. Defaults to false if authentication is not enabled
    */
    get amiauthenticated(){
        return self.isAuthenticated;
    },
    /**
    * Returns the token associated with this client. This is useful for debugging purposes to ensure that the client is not re - authenticating to the server multiple times in a multi - threaded environment.
    * 
    * 
    * @return { string } The token associated with this client or null if there is no token associated with this client
    */
    get mytoken(){
        return self.token;
    },
    /**
    * Returns the role of the user. This is used to determine who is logged in to the user's system.
    * 
    * 
    * @return { string } The role of the user in the system ( as defined in roles. json ) or undefined if not
    */
    get myrole(){
        return self.role;
    },
    /**
    * Gets the loading state of the game. This is used to determine if the game is in a loading state or not.
    * 
    * 
    * @return { boolean } True if the game is loading false otherwise. Defaults to false if isLoading is false
    */
    get loadingstate(){
        return self.isLoading;
    },
    /**
    * Returns what user type is set. This is used to determine if we are dealing with a user or not.
    * 
    * 
    * @return { string } The user type or null if not set in which case we don't know the
    */
    get WhatUserType(){
        return self.UserType;
    }
}))
// Need to instantiate Auth first!
const AuthInstance = Auth.create({});
const AuthStore = createContext(AuthInstance);

export default AuthStore;
