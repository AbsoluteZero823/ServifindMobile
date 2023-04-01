import { types } from 'mobx-state-tree';
import { createContext } from 'react';

export const Freelancer = types.model('Freelancer', {
  _id: types.string,
  approved_date: types.maybeNull(types.Date),
  isPremium: types.boolean,
  availability: types.boolean,
  gcash_name: types.maybeNull(types.string),
  gcash_num: types.maybeNull(types.string),
  schoolId: types.model({
    public_id: types.string,
    url: types.string,
  }),
  resume: types.model({
    path: types.string,
  }),
  qrCode: types.model({
    public_id: types.string,
    url: types.string,
  }),
  user_id: types.string,
});

const FreelancerStore = createContext({data:[]});

export default FreelancerStore;
