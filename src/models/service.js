import { types } from 'mobx-state-tree';
import Category from './category';
import Freelancer from './freelancer';
import User from './user';

const ImagesModel = types.model('Images', {
  public_id: types.optional(types.string, ''),
  url: types.optional(types.string, ''),
});

const ServiceModel = types
  .model('Service', {
    id: types.identifier,
    title: types.string,
    name: types.string,
    category: types.reference(types.late(() => Category)),
    user: types.reference(types.late(() => User)),
    experience: types.string,
    freelancer_id: types.reference(types.late(() => Freelancer)),
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

export default ServiceModel;
