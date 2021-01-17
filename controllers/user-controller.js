const { User } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
            .select('-__v')
            .then(dbUsers => res.json(dbUsers))
            .catch(err => res.status(400).json(err))
    },
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'Thought',
                select: '-__v'
            })
            .then(dbUsers => res.json(dbUsers))
            .catch(err => res.status(400).json(err));
    },
    addUser({ body }, res) {
        User.create(body)
            .then(dbUsers => res.json(dbUsers))
            .catch(err => res.status(400).json(err));
    },
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true })
            .then(dbUsers => {
                if(!dbUsers) {
                    res.status(404).json({ message: 'No user found with this id! '})
                    return;
                }
                res.json(dbUsers)
            })
            .catch(err => res.status(400).json(err))
    },
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUsers => {
                if(!dbUsers) {
                    res.status(404).json({ message: 'No user found with this id! '})
                    return;
                }
                res.json(dbUsers)
            })
            .catch(err => res.status(400).json(err))
    },
    addToFriends(req, res) {
            User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true, runValidators: true }
                )
            .then(dbUsers => {
                if(!dbUsers) {
                    res.status(404).json({ message: 'No user found with this id! '})
                    return; 
                }
                res.json(dbUsers)
            })
            .catch(err => res.json(err))
    },
    removeFromFriends({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId }},
            { new: true }
            )
            .then(dbUsers => {
                if(!dbUsers) {
                    res.status(404).json({ message: 'No user found with this id!' })
                    return;
                }
                res.json(dbUsers)
            })
            .catch(err => res.json(err))
    }
};

module.exports = userController