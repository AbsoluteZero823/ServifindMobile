import { types } from "mobx-state-tree";
import Inquiry from "./inquiry";
import { Offer } from './offer'

const Transaction = types
  .model("Transaction", {
    id: types.identifier,
    price: types.optional(types.string, ""),
    isPaid: types.optional(types.string, "false"),
    paymentSent: types.optional(types.string, "false"),
    paymentReceived: types.optional(types.string, "false"),
    created_At: types.optional(types.Date, () => new Date()),
    expected_Date: types.maybeNull(types.Date),
    finished_At: types.maybeNull(types.Date),
    inquiry_id: Inquiry,
    offer_id: Offer,
    status: types.optional(types.string, "processing"),
    transaction_done: types.optional(
      types.model({
        client: types.optional(types.string, "false"),
        freelancer: types.optional(types.string, "false"),
        workCompleted: types.maybeNull(types.Date),
        transactionCompleted: types.maybeNull(types.Date)
      }),
      {}
    ),
    isRated: types.optional(types.string, "false"),
    reportedBy: types.optional(
      types.model({
        client: types.optional(types.string, "false"),
        freelancer: types.optional(types.string, "false")
      }),
      {}
    )
  })

export default Transaction;
