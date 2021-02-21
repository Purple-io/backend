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
  const { chatId } = req.query;
  // const user = req.user;
  // TODO: uncomment when ready to add pagination
  // const skipAmount = req.params.pageIndex;
  let skipAmount = 0;
  const chat = await Chat.findById(chatId)
    .populate('userIds')
    .populate({
      path: 'messageIds',
      options: {
        // limit: 100,
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
  const messages = chat.messageIds;
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
  chat.messageIds.pull({ _id: messageId });
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
      options: { sort: { updatedAt: -1 } },
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
  let arr = user.chats;
  console.log("array of chats", arr);
  // arr.sort()
  res.status(200).json(user.chats);
};


// getRecentMessage = async (chat) => {
//   // chat.populate('messageIds')
// }

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

export const censorSenderMessage = async (req, res) => {
  let { messageContent, banned } = req.body;

  messageContent = censor(messageContent, banned);
  res.status(200).json(messageContent);
};

export const deleteChat = async (req, res) => {
  console.log("Delete Chat: ");
  try {
    const { chatId } = req.body;
    console.log("Chat Id: ", chatId);
    const chat = await Chat.findById(chatId).populate('userIds').catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'There was an error with the database.' });
      return;
    });
    if (chat === null) {
      res.status(500).json({ error: 'Chat does not exist.' });
      return;
    }
    let user1 = chat.userIds[0];
    let user2 = chat.userIds[1];
    user1.chats.pull({ _id: chatId });
    user2.chats.pull({ _id: chatId });
    await user1.save();
    await user2.save();
    await Chat.findByIdAndDelete(chatId).exec();
    res.status(200).json({"message": "success"});
  } catch (err) {
    console.error(err);
    res.status(500).json({"message": "failed"});
  }
};

export const deletePendingChat = async (req, res) => {
  try {
    const { queueId } = req.body;
    const queue = await Queue.findById(queueId).populate('userId').catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'There was an error with the database.' });
      return;
    });
    if (queue === null) {
      res.status(500).json({ error: 'Queue does not exist.' });
      return;
    }
    let user = queue.userId;
    user.pendingChats.pull({ _id: queueId });
    await user.save();
    await Queue.findByIdAndDelete(queueId).exec();
    res.status(200).json({"message": "success"});
  } catch (err) {
    console.error(err);
    res.status(500).json({"message": "failed"});
  }
};
