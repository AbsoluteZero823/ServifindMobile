import { types } from 'mobx-state-tree';
import { createContext } from 'react';

export const Category = types.model('Category', {
  _id: types.identifier,
  name: types.string,
})

const CategoryStore = createContext({categories: []});

export default CategoryStore;
