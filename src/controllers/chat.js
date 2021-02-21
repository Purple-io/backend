import Chat from '../models/chat.model.js';
import Queue from '../models/queue.model.js';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import {censor} from '../controllers/censor.js';

export const sendMessage = async (req, res) => {
  try {
    let { messageContent, chatId } = req.body;
    const user = req.user;
    const chat = await Chat.findById(chatId).populate('userIds');
    if (chat === null) {
      res.status(404).json({ error: 'Chat does not exist.' });
      return;
    }
    messageContent = censor(messageContent, chat.banned);
    console.log('CHAT: ');
    console.log(chat);
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
    console.log('from and to user: ');
    console.log(fromUser);
    console.log(toUser);
    let message = new Message({
      fromUser: fromUser,
      toUser: toUser,
      content: messageContent,
    });
    await message.save();
    chat.messageIds.push({ _id: message.id });
    await chat.save();
    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'There was an error with the database.' });
  }
};

export const createChat = async (data) => {
  try {
    const { user1Id, user2Id, banned, queueId, issue } = data;
    console.log('Queue Id: ' + queueId);
    let user1 = await User.findById(user1Id);
    if (user1 === null) {
      return;
    }
    let user2 = await User.findById(user2Id);
    if (user2 === null) {
      return;
    }
    let userIdsArray = [user1, user2];
    let chat = new Chat({
      userIds: userIdsArray,
      banned: banned,
      issue: issue,
    });

    await chat.save();
    console.log('Chat: ');
    console.log(chat);
    Queue.findByIdAndDelete(queueId).catch((err) => {
      console.error(err);
      return;
    });
    user1.pendingChats.pull({ _id: queueId });
    user2.pendingChats.pull({ _id: queueId });
    user1.chats.push({ _id: chat._id });
    user2.chats.push({ _id: chat._id });
    await user1.save();
    await user2.save();
    return chat;
  } catch (err) {
    console.error(err);
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.body;
  const user = req.user;
  // TODO: uncomment when ready to add pagination
  // const skipAmount = req.params.pageIndex;
  const skipAmount = 0;
  const chat = await Chat.findById(chatId)
    .populate('userIds')
    .populate({
      path: 'messages',
      options: {
        limit: 10,
        sort: { created: -1 },
        skip: skipAmount * 2,
      },
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'There was an error with the database.' });
      return;
    });
  if (chat === null) {
    res.status(500).json({ error: 'Chat does not exist.' });
    return;
  }
  const messages = chat.messages;
  res.status(200).json(messages);
};

export const getChat = async (req, res) => {
  const { chatId } = req.body;
  const chat = await Chat.findById(chatId).catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'There was an error with the database.' });
    return;
  });
  if (chat === null) {
    res.status(500).json({ error: 'Chat does not exist.' });
    return;
  }
  res.status(200).json(chat);
};

export const deleteMessage = async (req, res) => {
  const { chatId, messageId } = req.body;
  const chat = await Chat.findById(chatId).catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'There was an error with the database.' });
    return;
  });
  if (chat === null) {
    res.status(500).json({ error: 'Chat does not exist.' });
    return;
  }
  chat.messages.pull({ _id: messageId });
  chat.save().catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'There was an error with the database.' });
    return;
  });
};

export const getAllChats = async (req, res) => {
  const { userId } = req.query;
  const user = await User.findById(userId)
    .populate({
      path: 'chats',
      populate: {
        path: 'userIds',
      },
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'There was an error with the database.' });
      return;
    });
  if (user === null) {
    res.status(500).json({ error: 'User does not exist.' });
    return;
  }
  res.status(200).json(user.chats);
};

export const getAllPendingChats = async (req, res) => {
  const { userId } = req.query;
  const user = await User.findById(userId)
    .populate('pendingChats')
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'There was an error with the database.' });
      return;
    });
  if (user === null) {
    res.status(500).json({ error: 'User does not exist.' });
    return;
  }
  res.status(200).json(user.pendingChats);
};
