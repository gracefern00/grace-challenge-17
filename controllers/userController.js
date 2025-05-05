const { User, Thought } = require('../models');

module.exports = {
  // GET all users
  async getUsers(req, res) {
    try {
      const users = await User.find().populate('friends').populate('thoughts');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET a single user by _id
  async getSingleUser(req, res) {
    try {
      const user = await User.findById(req.params.userId)
        .populate('friends')
        .populate('thoughts');

      if (!user) return res.status(404).json({ message: 'No user found with that ID' });
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // PUT update a user
  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true, runValidators: true }
      );

      if (!user) return res.status(404).json({ message: 'No user with this ID' });
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE a user (and delete their thoughts)
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);

      if (!user) return res.status(404).json({ message: 'No user with this ID' });

      // Delete associated thoughts
      await Thought.deleteMany({ _id: { $in: user.thoughts } });

      res.json({ message: 'User and thoughts deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST to add a friend
  async addFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );

      if (!user) return res.status(404).json({ message: 'No user with this ID' });
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE to remove a friend
  async removeFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!user) return res.status(404).json({ message: 'No user with this ID' });
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
