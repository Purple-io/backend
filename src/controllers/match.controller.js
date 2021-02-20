import Queues from '../models/queue.model.js';
import Users from '../models/user.model.js';
import { createChat } from '../controllers/chat.js';
import Mongoose from 'mongoose';

export const findMatch = async (req, res) => {
  try {
    // Mongoose.set("debug", true);
    let { userId, issue, rating, banned } = req.body;
    if (banned === undefined) banned = [];
    let user = await Users.findById(userId);
    if (rating == null || rating === undefined) {
      // go to datbase to find the specific user
      rating = user.affiliation;
      console.log(rating);
    }

    const lowerBound = -rating - 1;
    const upperBound = -rating + 1;

    const matchedQueue = await Queues.findOne({
      issue,
      rating: { $gte: lowerBound, $lte: upperBound },
    });
    if (!matchedQueue) {
      const newQueue = await Queues.create({ userId, issue, rating, banned });
      console.log('newQueue');
      console.log(newQueue);
      user.pendingChats.push({ _id: newQueue._id });
      await user.save();
      res.status(202).json({ msg: "Couldn't find a matched queue", newQueue });
      return;
    }
    let combinedBannedWords = [];
    console.log(banned);
    console.log('matchedQueue');
    console.log(matchedQueue);
    combinedBannedWords = combinedBannedWords.concat(banned);
    combinedBannedWords = combinedBannedWords.concat(matchedQueue.banned);
    const data = {
      user1Id: userId,
      user2Id: matchedQueue.userId,
      banned: combinedBannedWords,
      queueId: matchedQueue._id,
    };
    const chat = await createChat(data);
    Queues.findByIdAndDelete(matchedQueue._id, (err) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: 'There was an error. Please try again!' });
      }
    });
    res.status(200).json({ success: true, msg: 'Found a match', chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'There was an error. Please try again!' });
  }
};
