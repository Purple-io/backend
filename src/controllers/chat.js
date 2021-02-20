import Chat from '../models/chat.model.js';
import mongoose, { Schema } from 'mongoose';
import Message from '../models/message.model.js';

export const send = async (req, res) => {
  const { messageContent, conversationId } = req.body;
  const user = req.user;
  const chat = await Chat.findById(conversationId).populate('userIds').exec();
  const users = chat.userIds;
  let fromUser = null;
  let toUser = null;
  if (user.email === users[0].email) {
    fromUser = user[0];
    toUser = user[1];
  } else {
      fromUser = user[1];
      toUser = user[0];
  }

  let message = new Message({
    fromUser: fromUser,
    toUser: toUser,
    content: messageContent,
  });
  await message.save();
  res.statusCode(200);
};

export const getMessages = async (req, res) => {
    const { conversationId } = req.body;
    const user = req.user;
    // TODO: uncomment when ready to add pagination
    // const skipAmount = req.params.pageIndex;
    const skipAmount = 0;
    const chat = await Chat.findById(conversationId).populate('userIds').populate({
        path: 'messages',
        options: {
            limit: 10,
            sort: { created: -1},
            skip: skipAmount * 2
        }
    }).exec();
    const messages = chat.messages;
    res.status(200).json(messages);
  };

export const deleteMessage = async (req, res) => {
    const { conversationId, messageId } = req.body;
    const chat = await Chat.findById(conversationId).exec();
    chat.messageIds.pull(Schema.Types.ObjectId(conversationId));
    chat.save();
};