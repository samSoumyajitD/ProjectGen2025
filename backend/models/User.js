const mongoose = require("mongoose");

const LearningFlowSchema = new mongoose.Schema({
  nodes: [
    {
      id: String,
      data: {
        label: String,
      },
      _id: false,
    },
  ],
  edges: [
    {
      source: String,
      target: String,
      _id: false,
    },
  ],
});

const ScheduleSchema = new mongoose.Schema({
  weekday: {
    work: { type: Number, default: 0 },
    development: { type: Number, default: 0 },
    personal: { type: Number, default: 0 },
  },
  weekend: {
    development: { type: Number, default: 0 },
    personal: { type: Number, default: 0 },
  },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    role: {
      type: String,
      enum: ["Student", "Working_Pro", "Admin"],
      default: "Student",
    },
    status: {
      type: String,
      enum: ["Active", "Blocked", "Pending", "Inactive"],
      default: "Pending",
    },

    organization: { type: String, default: "Not specified" },
    currentPosition: { type: String, default: "Not specified" },
    fieldOfStudy: { type: String, default: "Not specified" },
    aboutYourself: { type: String, default: "Not specified" },

    takeNotes: { type: String, default: "Not specified" },
    learningType: { type: String, default: "Not specified" },
    expertiseLevel: { type: String, default: "Not specified" },
    prefersGroupLearning: { type: String, default: "Not specified" },

    avatar: { type: String, default: "Not specified" },
    preferredLearningTime: { type: String, default: "Not specified" },

    areasOfInterest: { type: [String], default: [] }, 
    preferredResources: { type: [String], default: [] },

    learningFlow: { type: LearningFlowSchema, default: {}, _id: false },
    schedule: { type: ScheduleSchema, default: {}, _id: false },
    priorities: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
