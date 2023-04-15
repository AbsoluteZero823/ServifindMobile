import { types } from 'mobx-state-tree';
import { createContext } from 'react';

export const Freelancer = types.model('Freelancer', {
  _id: types.string,
  approved_date: types.maybe(types.string),
  isPremium: types.boolean,
  availability: types.boolean,
  gcash_name:types.maybe(types.string),
  gcash_num: types.maybe(types.string),
  schoolId: types.maybe(types.model({
    public_id: types.string,
    url: types.string,
  })),
  resume: types.maybe(types.model({
    path: types.maybe(types.string),
  })),
  qrCode: types.maybe(types.model({
    public_id: types.maybe(types.string),
    url: types.maybe(types.string),
  })),
  user_id: types.string,
});

const FreelancerStore = createContext({data:[]});

export default FreelancerStore;
