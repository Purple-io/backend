import mongoose from 'mongoose';
const { Schema } = mongoose;

const queueSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
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
