const { User } = require('../models');

const UserController = {
//GET all users
getAllUser(req, res){
    User.find({})
    .populate({
        path: 'thoughts',
        select: '-__v'
    })
    .select('__v')
    .sort({ _id: -1 })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
},

//Get single user by _id
getUserById({ params }, res){
    User.findOne({ _id: params.id })
    .populate({
        path: 'thoughts',
        select: '-__v'
    })
    .select('__v')
    .then(dbUserData => {
    if (!dbUserData){
        res.status(404).json({ message: 'No user found with this id'});
        return;
    }
        res.json(dbUserData)
})
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
},

//POST a new user (create)
createUser({ body }, res){
    User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
},


//PUT a user (update by _id)
updateUser({ params, body }, res){
    User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { user: body } },
        { new: true, runValidators: true }
    )
    .then(dbUserData => {
        if (!dbUserData){
            res.status(404).json({ message: 'No user found with this id'});
            return; 
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));
},

//DELETE a user (remove by _id)
deleteUser({ params }, res){
    User.findOneAndDelete({ _id: params.userId})
    .then(deleteUser => {
        if(!deleteUser){
            return res.status(404).json({message: 'No user found with this ID'});
        }
        //deletes posted thoughts by user?
        //if changed thoughtId to userId would that delete all thoughts by that user?
        return User.findOneAndUpdate(
            {_id: params.userId },
            { $pull: {thoughts: params.userId }},
            { new: true }
        );
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this ID'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));
},

//add new friend to user's friend list
addFriend({ params }, res){
    User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true, runValidators: true }
    )
    .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: "No User with that ID"});
          return;
        }
        res.json(dbUserData)
      })
      .catch(err => res.json(err));
      },

//delete friend from user's friend list
      deleteFriend({ params }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: params.friendId  } },
      { new: true, runValidators: true }
      )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: "No User with that ID"});
        return;
      }
      res.json(dbUserData)
    })
    .catch(err => res.json(err));
    },
};


module.exports = UserController;