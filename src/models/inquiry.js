import { types } from 'mobx-state-tree';
import { createContext } from 'react';
import { User } from './user';
import { ServiceModel } from './service';

export const Inquiry = types.model('Inquiry', {
  _id: types.identifier,
  instruction: types.string,
  attachments: types.string,
  customer: User,
  freelancer: types.string,
  service: ServiceModel,
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

const InquiryStore = createContext({inquiries: []});

export default InquiryStore;

// In this MST model schema, we define properties for instruction, attachments, customer, freelancer, service, and status. We also define views for customerName, freelancerName, and serviceName, which return the names of the related models. Note that we also define separate models for User, Freelancer, and Service, which are used as references in the Inquiry model schema.