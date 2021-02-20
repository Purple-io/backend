import mongoose from 'mongoose';
const { Schema } = mongoose;
const chatSchema = new mongoose.Schema({
  conversationId: { type: Schema.Types.ObjectId },
  userIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  ],
  messageIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'message',
    },
  ],
  banned: {
    type: [String],
    default: [],
  },
  issue: {
    type: String,
    default: '',
  },
});

export default mongoose.model('chat', chatSchema);
