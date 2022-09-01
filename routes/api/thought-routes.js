const router = require('express').Router();
const {
    getAllThought,
    getOneThought,
    updateThought,
    createThought,
    deleteThought,
    addReaction,
    removeReaction
  } = require('../../controllers/thought-controller');


// api/thoughts
router
    .route('/')
    .get(getAllThought)
    .post(createThought)


//  /api/thoughts/<thoughtId>
router
  .route('/:id')
  .get (getOneThought)
  .put(updateThought)
  .delete(deleteThought)

// /api/thoughts/<thoughtId>/reactions
router
   .route('/:thoughtId/reactions')
   .post(addReaction)

router.route('/:thoughtId/:reactionId')
   .delete(removeReaction);


module.exports = router;