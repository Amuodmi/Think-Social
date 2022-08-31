const { Thought, User } = require('../models');

const thoughtController = {
    //GET ALL thoughts 
    getAllThoughts(req, res) {
        Thought.find({})
          .populate({
            path: 'reactions',
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

            //GET ONE thought
      getOneThought({ params }, res) {
        Thought.findOne({ _id: params.id})
         .populate({
            path:'thoughts',
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

    //POST thought
createThought({ body }, res) {
    Thought.create(body)
    .then(dbThoughtData => this.res.json(dbThoughtData))
    .catch(err => res.status(400).json(err));
},
      
      // remove reaction
removeReaction({ params }, res) {
  Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $pull: { reactions: { reactionId: params.reactionId } } },
    { new: true }
  )
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.json(err));
},

    //remove thought
    removeThought({ params }, res){
        Thought.findOneAndDelete({ _id: params.thoughtId})
        .then(deleteThought => {
            if(!deleteThought){
                return res.status(404).json({message: 'No thought found with this ID'});
            }
            return User.findOneAndUpdate(
                {_id: params.userId },
                { $pull: {thoughts: params.thoughtId }},
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
    }
};




module.exports = thoughtController; 