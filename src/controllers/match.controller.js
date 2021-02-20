import Queues from '../models/queue.model.js';
import Users from '../models/user.model.js';

export const findMatch = async (req, res) => {
  try {
    let { userId, issue, rating } = req.body;

    if (rating == null) {
      // go to datbase to find the specific user
      const user = await Users.findById(userId);
      rating = user.affiliation;
      console.log(rating);
    }

    const lowerBound = -rating - 1;
    const upperBound = -rating + 1;

    const matchedUser = await Queues.findOne({
      issue,
      rating: { $gte: lowerBound, $lte: upperBound },
    });

    if (!matchedUser) {
      const newUser = Queues.create({ userId, issue, rating });
      user.pendingChats.push({_id: newUser._id});
      await user.save();
      res.status(202).json({ msg: "Couldn't find a matched user" });
      return;
    }

    Queues.findByIdAndDelete(matchedUser._id, (err) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: 'There was an error. Please try again!' });
      }
    });
    res.status(200).json({ success: true, msg: 'Found a match', matchedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'There was an error. Please try again!' });
  }
};
