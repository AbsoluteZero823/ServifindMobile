import { types } from "mobx-state-tree";
import { createContext } from "react";

const Auth = types
.model("Auth", {
    token: types.optional(types.string, ""),
    isAuthenticated: types.optional(types.boolean,false),
    role: types.optional(types.string,'customer'),
    isLoading: types.optional(types.boolean,false),
    UserType: types.maybe(types.enumeration(['Client','Freelancer'])),
})
.actions((self) => ({
    letmeload(){
        self.isLoading = true;
    },
    donewithload(){
        self.isLoading = false;
    },
    loggedin(token, role) {
        self.role = role;
        self.isAuthenticated = true;
        self.token = token;
    },
    logout() {
        self.token = "";
        self.isAuthenticated = false;
        self.role = 'customer';
        self.UserType = undefined;
    },
    setUserType(UserType){
        self.UserType = UserType;
    }
}))
.views((self) => ({
    get amiauthenticated(){
        return self.isAuthenticated;
    },
    get mytoken(){
        return self.token;
    },
    get myrole(){
        return self.role;
    },
    get loadingstate(){
        return self.isLoading;
    },
    get WhatUserType(){
        return self.UserType;
    }
}))
// Need to instantiate Auth first!
const AuthInstance = Auth.create({});
const AuthStore = createContext(AuthInstance);

export default AuthStore;
