import { types } from 'mobx-state-tree';
import { createContext } from 'react';

const SchoolId = types.model({
  public_id: types.string,
  url: types.string,
});

const QrCode = types.model({
  public_id: types.string,
  url: types.string,
});

const Resume = types.model({
  public_id: types.string,
  url: types.string,
});

const premiumReceipt = types.model({
  public_id: types.maybe(types.string),
  url: types.maybe(types.string),
});

export const Freelancer = types
  .model({
    _id: types.string,
    status: types.optional(types.string, 'applying'), // "applying", "approved", "restricted", "rejected"
    approved_date: types.maybeNull(types.string),
    isPremium: types.optional(types.boolean, false),
    availability: types.optional(types.boolean, false),
    gcash_name: types.maybeNull(types.string),
    gcash_num: types.maybeNull(types.string),
    premiumReceipt: types.maybeNull(premiumReceipt),
    qrCode: types.optional(QrCode, {
      public_id: 'servifind/qrcode/default_profile',
      url:
        'https://res.cloudinary.com/dawhmjhu1/image/upload/v1674014501/servifind/avatar/default_profile.jpg',
    }),
    resume: types.optional(Resume, {
      public_id: 'servifind/freelancer/resume/emptyResume_i8hkio',
      url:
        'https://res.cloudinary.com/dawhmjhu1/image/upload/v1681466742/servifind/freelancer/resume/emptyResume_i8hkio.jpg',
    }),
    schoolID: types.optional(SchoolId, {
      public_id: 'servifind/freelancer/school_id/schoolID_p9fna0',
      url:
        'https://res.cloudinary.com/dawhmjhu1/image/upload/v1681466602/servifind/freelancer/school_id/schoolID_p9fna0.jpg',
    }),
    user_id: types.reference(types.late(() => UserModel)),
  })

const FreelancerStore = createContext({data:[]});

export default FreelancerStore;
