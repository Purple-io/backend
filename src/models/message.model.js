import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new mongoose.Schema(
  {
    messageId: { type: mongoose.Schema.Types.ObjectId },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: { currentTime: () => new Date() } }
);

export default mongoose.model('message', messageSchema);
