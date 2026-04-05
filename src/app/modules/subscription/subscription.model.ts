import { model, Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
    },
  },
  { timestamps: false, versionKey: false },
);

export const Subscription = model("Subscription", subscriptionSchema);
