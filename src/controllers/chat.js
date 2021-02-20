import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import mongoose from 'mongoose';
const { Mongoose } = mongoose;
export const sendMessage = async (req, res) => {
  const { messageContent, chatId } = req.body;
  const user = req.user;
  const chat = await Chat.findById(chatId).populate('userIds').exec((err, chat) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'DB error.' });
      return;
    } else if (chat === null) {
      res.status(500).json({ error: 'Chat does not exist.' });
      return;
    }
    return chat;
  });
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
  await message.save().catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'There was an error with the database.' });
    return;
  });
  chat.messages.push({_id: message.id});
  await chat.save().catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'There was an error with the database.' });
    return;
  });
  res.status(200).json({"message": "success"});
};

export const createChat = async (req, res) => {
    const { user1Id, user2Id, banned, queueId} = req.body;
    console.log("Queue Id: " +  queueId);
    let user1 = await User.findById(user1Id, (err, user) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'DB error' });
        return;
      }
      return user;
    });
    if (user1 === null) {
      res.status(500).json({ error: 'User does not exist.' });
      return;
    }
    let user2 = await User.findById(user2Id, (err, user) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'DB error' });
        return;
      }
      return user;
    });
    if (user2 === null) {
      res.status(500).json({ error: 'User does not exist.' });
      return;
    }
    console.log("user1 and user2");
    let chat = new Chat({
      fromUser: user1,
      toUser: user2,
      banned: banned,
    });
    await chat.save().catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'DB error' });
      return;
    });
    user1.pendingChats.pull({_id: queueId});
    user2.pendingChats.pull({_id: queueId});
    user1.chats.push({_id: chat._id});
    user2.chats.push({_id: chat._id});
    await user1.save().catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'DB error' });
      return;
    });
    await user2.save().catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'DB error' });
      return;
    });
    res.status(200).json({"message": "success"});
    
};

export const getMessages = async (req, res) => {
    const { chatId } = req.body;
    const user = req.user;
    // TODO: uncomment when ready to add pagination
    // const skipAmount = req.params.pageIndex;
    const skipAmount = 0;
    const chat = await Chat.findById(chatId).populate('userIds').populate({
        path: 'messages',
        options: {
            limit: 10,
            sort: { created: -1},
            skip: skipAmount * 2
        }
    }).exec((err, chat) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'There was an error with the database.' });
        return;
      } else if (chat === null) {
        res.status(500).json({ error: 'Chat does not exist.' });
        return;
      }
      return chat;
    });
    const messages = chat.messages;
    res.status(200).json(messages);
};

export const getChat = async (req, res) => {
    const { chatId } = req.body;
    const chat = await Chat.findById(chatId).exec((err, chat) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'There was an error with the database.' });
        return;
      } else if (chat === null) {
        res.status(500).json({ error: 'Chat does not exist.' });
        return;
      }
      return chat;
    });
    res.status(200).json(chat);
};

export const deleteMessage = async (req, res) => {
    const { chatId, messageId } = req.body;
    const chat = await Chat.findById(chatId).exec((err, chat) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'There was an error with the database.' });
        return;
      } else if (chat === null) {
        res.status(500).json({ error: 'Chat does not exist.' });
        return;
      }
      return chat;
    });
    chat.messages.pull({_id: messageId});
    chat.save().catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'There was an error with the database.' });
      return;
    });
};