import { types } from "mobx-state-tree";
import User from "./user";
import Service from "./service";
import Transaction from "./transaction";

const Rating = types.model("Rating", {
  id: types.identifier,
  rating: types.number,
  comment: types.string,
  created_At: types.optional(types.string, 'Some Date'),
  user: types.reference(types.late(() => User)),
  service_id: types.reference(types.late(() => Service)),
  transaction_id: types.reference(types.late(() => Transaction))
}).actions((self) => ({
  // Add any actions here
})).views((self) => ({
  // Add any views here
}));

export { Rating };

// Note that you need to define the User, Service, and Transaction models separately and reference them in the Rating model using types.reference. Also, since created_At is an optional field in the Mongoose schema, we've used types.optional to make it optional in the MST model.