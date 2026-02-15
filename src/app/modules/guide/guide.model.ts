import { model, Schema } from "mongoose";
import { GuideApplicationStatus, IApplyGuide } from "./guide.interface";

const applyGuideShcema = new Schema<Partial<IApplyGuide>>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
    nidPhotos: {
      type: [String],
      required: [true, "NID Photos is required"],
      default: [],
    },
    divisionId: {
      type: Schema.Types.ObjectId,
      required: [true, "Division ID is required"],
      ref: "Division",
    },
    status: {
      type: String,
      enum: Object.values(GuideApplicationStatus),
      default: GuideApplicationStatus.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const GuideApplication = model<Partial<IApplyGuide>>(
  "GuideApplication",
  applyGuideShcema,
);
