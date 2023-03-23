import { types } from 'mobx-state-tree';
import { createContext } from 'react';

import {Category} from './category';
import Freelancer from './freelancer';
import {User} from './user';

const ImagesModel = types.model('Images', {
  public_id: types.optional(types.string, ''),
  url: types.optional(types.string, ''),
});

export const ServiceModel = types
  .model('Service', {
    _id: types.identifier,
    title: types.string,
    name: types.string,
    category: Category,
    user: User,
    experience: types.string,
    freelancer_id: types.string,
    status: types.optional(types.string, 'approved'),
    images: types.optional(ImagesModel, { public_id: '', url: '' }),
  })
  .views((self) => ({
    get image() {
      return self.images.url || '';
    },
  }))
  .actions((self) => ({
    setImage(images) {
      self.images = images;
    },
  }));

const ServiceStore = createContext({Services: []});

export default ServiceStore;
