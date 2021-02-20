import mongoose, { Schema } from 'mongoose';

const chatSchema = new mongoose.Schema({
  conversationId: { type: Schema.Types.ObjectId },
  userIds: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  }],
  messageIds: [{
    type: Schema.Types.ObjectId,
    ref: 'message',
    required: false,
  }],
  banned: [{type: String}],
});

export default mongoose.model('chat', chatSchema);
