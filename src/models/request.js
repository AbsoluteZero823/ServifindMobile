import { types } from 'mobx-state-tree';
import { createContext } from 'react';
import { Category } from './category';
import { User } from './user';

export const Request = types.model('Request', {
  _id: types.identifier,
  category: Category,
  description: types.string,
  created_At: types.Date,
  request_status: types.optional(types.enumeration(['waiting', 'cancelled', 'granted']), 'waiting'),
  requested_by: User,
})
.actions(self => ({
  setCancel(){
    self.request_status = 'cancelled';
  }
}))
;

const RequestStore = createContext({requests: []});

export default RequestStore;
