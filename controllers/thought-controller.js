const { Thought, User } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughts => res.json(dbThoughts))
            .catch(err => res.status(400).json(err))
    },
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughts => res.json(dbThoughts))
            .catch(err => res.status(400).json(err))
    },
    addThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { username: body.username },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbThought => {
                if(!dbThought) {
                    res.status(404).json({ message: 'No thought found with this id! '})
                    return;
                }
                res.json(dbThought);
            })
            .catch(err => res.json(err))
    },
    updateThought({ params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true})
            .then(dbThought => {
                if(!dbThought) {
                    res.status(404).json({ message: 'No thought found with this id! '})
                    return;
                }
                res.json(dbThought)
            })
            .catch(err => res.status(400).json(err))
    },
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThought => {
                if(!dbThought) {
                    res.status(404).json({ message: 'No thought found with this id! '})
                    return;
                }
                res.json(dbThought)
            })
            .catch(err => res.status(400).json(err))
    },
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbThought => {
                if(!dbThought) {
                    res.status(404).json({ message: 'No thought found with this id! '})
                    return;
                }
                res.json(dbThought)
            })
            .catch(err => res.json(err))
    },
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThought => res.json(dbThought))
        .catch(err => res.json(err))
    }
}

module.exports = thoughtController