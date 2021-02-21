import mongoose from 'mongoose';
const { Schema } = mongoose;

// sub schema that stores an array of issues
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  affiliation: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'chat',
    },
  ],
  pendingChats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'queue',
    },
  ],
  news: {
    type: Schema.Types.Map,
    default: {},
  },
});

export default mongoose.model('user', userSchema);
