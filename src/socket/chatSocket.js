import Chat from '../models/chat.model.js';
import Queue from '../models/queue.model.js';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import mongoose from 'mongoose';

export const sendMessage = async (data, socket) => {
  try {
    const { messageContent, chatId, userId} = data;
    socket.broadcast.emit('received', { message: messageContent });
    let user = await User.findById(userId).exec();
    if (user === null) {
      return;
    }
    const chat = await Chat.findById(chatId)
      .populate('userIds')
      .catch((err) => {
        console.error(err);
        return;
      });
    if (chat === null) {
      return;
    }
    const users = chat.userIds;
    let fromUser = null;
    let toUser = null;
    if (user.email === users[0].email) {
      fromUser = users[0];
      toUser = users[1];
    } else {
      fromUser = users[1];
      toUser = users[0];
    }
    console.log("from User");
    console.log(fromUser);
    console.log("to User");
    console.log(toUser);


    let message = new Message({
      fromUser: fromUser,
      toUser: toUser,
      content: messageContent,
    });
    await message.save().catch((err) => {
      console.error(err);
      return;
    });
    chat.messageIds.push({ _id: message.id });
    await chat.save().catch((err) => {
      console.error(err);
      return;
    });
  } catch (err) {
    console.error(err);
  }

};
