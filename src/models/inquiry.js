import { types } from 'mobx-state-tree';
import User from './user';
import Freelancer from './freelancer';
import Service from './service';

const Inquiry = types.model('Inquiry', {
  id: types.identifier,
  instruction: types.string,
  attachments: types.string,
  customer: types.reference(types.late(() => User)),
  freelancer: types.reference(types.late(() => Freelancer)),
  service: types.reference(types.late(() => Service)),
  status: types.optional(types.string, 'pending'),
}).actions((self) => ({
  
})).views((self) => ({
  get customerName() {
    return self.customer.name;
  },
  get freelancerName() {
    return self.freelancer.name;
  },
  get serviceName() {
    return self.service.name;
  },
}));

export default Inquiry;

// In this MST model schema, we define properties for instruction, attachments, customer, freelancer, service, and status. We also define views for customerName, freelancerName, and serviceName, which return the names of the related models. Note that we also define separate models for User, Freelancer, and Service, which are used as references in the Inquiry model schema.