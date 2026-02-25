import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true, versionKey: false },
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    availableGuest: { type: Number },
    minAge: { type: Number },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
    guide: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: {
      type: Number,
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

tourSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let slug = this.title.toLowerCase().split(" ").join("-");

    let count = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${count++}`;
    }

    this.slug = slug;
  }

  next();
});

tourSchema.pre("findOneAndUpdate", async function (next) {
  const tour = this.getUpdate() as Partial<ITour>;
  if (tour.title) {
    let slug = tour.title.toLowerCase().split(" ").join("-");

    let count = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${count++}`;
    }

    tour.slug = slug;
  }

  this.setUpdate(tour);

  next();
});

export const Tour = model<ITour>("Tour", tourSchema);
