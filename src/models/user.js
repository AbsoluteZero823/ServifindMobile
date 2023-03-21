import { types } from 'mobx-state-tree';
import { createContext } from 'react';

export const User = types.model('User', {
  id: types.maybeNull(types.identifier),
  name: types.maybeNull(types.string),
  age: types.maybeNull(types.number),
  gender: types.maybeNull(types.enumeration(['Male', 'Female'])),
  contact: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  avatar: types.maybeNull(types.model({
    public_id: types.string,
    url: types.string,
  })),
  role: types.optional(types.string, 'customer'),
  status: types.optional(types.string, 'activated'),
  createdAt: types.optional(types.Date, () => new Date()),
  isAdmin: types.optional(types.boolean, false),
  resetPasswordToken: types.maybeNull(types.string),
  resetPasswordExpire: types.maybeNull(types.Date),
}).actions((self) => ({
    logout(){
        self.id = null;
        self.name = null;
        
        self.age = null;
        self.gender = null;
        self.contact = null;

        self.email = null;
        self.avatar = null;
        self.role = null;
        self.status = null;
        self.createdAt = null;
        self.isAdmin = false;
        self.resetPasswordToken = null;
        self.resetPasswordExpire = null;
    },
    setGender(gender){
      self.gender = gender;
    },
    setContacts(contact){
      self.contact = contact;
    },
    setAge(age){
      self.age = parseInt(age);
    }
    
})).views((self) => ({
    get UserDetails(){
      return self;
    },
    get ProfileDetails(){
      return ({
        age : self.age,
        gender : self.gender,
        contact : self.contact,
      })
    }
}));

const UserStore = createContext({users: []});

export default UserStore;

// In the above MST model schema, we define each property using the types API provided by Mobx-State-Tree. We also provide default values and optional properties using types.optional, and allow for null or undefined values using types.maybeNull. We also define any actions we may need using the .actions function.