import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  issue: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  banned: {
    type: [String],
    default: [],
  },
});

export default mongoose.model('queue', queueSchema);
