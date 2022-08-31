const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    addThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
  } = require('../../controllers/thought-controller');


// api/thoughts
router
    .route('/')
    .get(getAllThoughts)
    .post(addThought);


//  /api/thoughts/<thoughtId>
router
  .route('/:id')
  .get (getThoughtById)
  .put(updateThought)
  .delete(deleteThought)

// /api/thoughts/<thoughtId>/reactions
router
   .route('/:thoughtId/reactions')
   .put(addReaction)

router.route('/:thoughtId/:reactionId').delete(deleteReaction);


module.exports = router;