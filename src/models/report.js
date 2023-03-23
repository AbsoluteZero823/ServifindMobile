import { types } from 'mobx-state-tree';
import User from './user';
import Transaction from './transaction';

const Report = types.model('Report', {
  id: types.identifier,
  reason: types.string,
  description: types.string,
  created_At: types.string,
  reported_by: types.reference(types.late(() => User)),
  user_reported: types.reference(types.late(() => User)),
  transaction_id: types.reference(types.late(() => Transaction)),
}).views(self => ({

})).actions(self => ({

}));

export default Report;