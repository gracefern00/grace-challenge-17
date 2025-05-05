const { Thought, User } = require('../models');

module.exports = {
  // GET all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate('reactions');
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
},

  // GET a single thought by _id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId).populate('reactions');

      if (!thought) return res.status(404).json({ message: 'No thought found with that ID' });
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
  }
},

  // POST a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);

      // Add thought to user's list of thoughts
      await User.findByIdAndUpdate(
        req.body.userId,
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
  }
},



  // PUT to update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        { new: true, runValidators: true }
      );

      if (!thought) return res.status(404).json({ message: 'No thought with this ID' });
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

      if (!thought) return res.status(404).json({ message: 'No thought with this ID' });

      // Remove the thought from the user's list of thoughts
      await User.findByIdAndUpdate(
        thought.userId,
        { $pull: { thoughts: thought._id } },
        { new: true }
      );

      res.json({ message: 'Thought deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};
