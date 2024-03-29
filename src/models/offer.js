import { types } from 'mobx-state-tree';
import { createContext } from 'react';

export const Offer = types.model('Offer', {
  service_id: types.reference(types.late(() => Service)),
  description: types.string,
  price: types.maybe(types.number),
  created_At: types.optional(types.Date, () => new Date()),
  offer_status: types.optional(types.enumeration(['waiting', 'cancelled', 'granted']), 'waiting'),
  offered_by: types.reference(types.late(() => User)),
  inquiry_id: types.reference(types.late(() => Inquiry)),
}).actions((self) => ({
    setoffer_status(status) {
        self.offer_status = status;
    }
}))

const OfferStore = createContext({offers: []});

export default OfferStore;
