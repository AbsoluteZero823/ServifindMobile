import { types } from 'mobx-state-tree';

const Freelancer = types.model('Freelancer', {
  id: types.identifier,
  approved_date: types.Date,
  isPremium: types.optional(types.string, 'false'),
  availability: types.optional(types.string, 'true'),
  gcash_name: types.maybeNull(types.string),
  gcash_num: types.maybeNull(types.string),
  qrCode: types.model({
    public_id: types.string,
    url: types.string,
  }),
  user_id: types.reference(types.late(() => User)),
}).actions((self) => ({
  // Add any actions here
})).views((self) => ({
    // Add any views here
}));

export default Freelancer;

// In this MST model schema, we define each property using the types API provided by Mobx-State-Tree. We also provide default values and optional properties using types.optional, and allow for null or undefined values using types.maybeNull. We also define the user_id property as a reference to another model, User, using types.reference. Note that we need to define the User model separately and use types.late to avoid circular dependencies.