import mongoose from 'mongoose';
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  affiliation: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  chats: [{
    type: Schema.Types.ObjectId,
    ref: 'chat',
  }],
  pendingChats: [{
    type: Schema.Types.ObjectId,
    ref: 'queue',
  }],
});

export default mongoose.model('user', userSchema);
