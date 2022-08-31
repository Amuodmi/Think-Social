const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: 'You need to create a username',
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'You need to provide an email', 
      validate: [validateEmail, 'Please give a valid email'],
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please enter a valid email']
    },
    thoughts: {
      type: Schema.Types.ObjectID,
      ref: 'Thought'
    },
    
    friends:  {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

  // get total count of Friends on retrieval
  UserSchema.virtual('FriendsCount').get(function() {
    return this.friends.length
  });


  // create the User model using the UserSchema
const User = model('User', Userschema);

// export the User model
module.exports = User;