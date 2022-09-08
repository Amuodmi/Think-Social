const { Thought, User } = require('../models');

const thoughtController = {
    //GET ALL thoughts 
    getAllThought(req, res) {
        Thought.find({})
          .populate({
            path: 'reactions',
            select: '-__v'
          })
          .select('-__v')
          .sort({_id: -1})
          .then(dbThoughtData => 
            res.json(dbThoughtData))
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
                });
            },

            //GET ONE thought
      getOneThought({ params }, res) {
        Thought.findOne({ _id: params.id})
         .populate({
            path:'reactions',
            select: '-__v'
         })
        .select('-__v')
        .sort({_id:-1})
        .then(dbThoughtData => 
          res.json(dbThoughtData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
              });
          },

    //POST thought (push the created thought by _id)
createThought({ body }, res) {
    Thought.create(body)
    .then(({ _id}) => {
        return User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { comments: _id } },
            { new: true }
        );
    })
    .then(dbThoughtData => {
        if (!dbThoughtData){
            res.status(404).json({ message: 'No thought found with this id'});
            return; 
        }
        res.json(dbThoughtData);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
            });
},

    //PUT thought (update by _id, need to push)
    updateThought({ params, body }, res){
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $push: {reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData){
                res.status(404).json({ message: 'No thought found with this id'});
                return; 
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
                });
    },

 //DELETE thought (remove by _id, and pull)
  deleteThought({ params }, res){
    Thought.findOneAndDelete({ _id: params.id})
    .then(deleteThought => {
        if(!deleteThought){
            return res.status(404).json({message: 'No thought found with this ID'});
        }
        return User.findOneAndUpdate(
            {_id: params.userId },
            { $pull: {thoughts: params.id }},
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
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
            });
},

//POST reaction (add reaction - need to push)
  addReaction({ params, body}, res){
    Thought.findOneAndUpdate(
        { _id: params.id },
        { $push: { replies: body } },
        { new: true, runValidators: true }
    )
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this ID'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
            });
  },    

// DELETE reaction (remove reaction, and pull)
removeReaction({ params }, res) {
  Thought.findOneAndUpdate(
    { _id: params.id },
    { $pull: { reactions: { reactionId: params.reactionId } } },
    { new: true }
  )
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
            });
},

   
};




module.exports = thoughtController; 