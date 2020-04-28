const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let VideoModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const VideoSchema = new mongoose.Schema({
  player1: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  player2: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  char1: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  char2: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  game: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  link: {
    type: String,
    required: true,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

VideoSchema.statics.toAPI = (doc) => ({
  player1: doc.player1,
  player2: doc.player2,
  char1: doc.char1,
  char2: doc.char2,
  game: doc.game,
  link: doc.link,
});

// Converts the ownerId to be readable by the database then returns all of the users entries.
VideoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return VideoModel.find(search).select('player1 player2 char1 char2 game link').lean().exec(callback);
};

// Returns all entries in the database
VideoSchema.statics.findAll = (callback) => VideoModel.find().select('player1 player2 char1 char2 game link').lean().exec(callback);

// Will search for specified entries in the database based off the object in the search
VideoSchema.statics.findSearch = (search, callback) => VideoModel.find(search).select('player1 player2 char1 char2 game link').lean().exec(callback);


VideoSchema.statics.deleteItem = (uid, callback) => {
  const search = {
    _id: uid,
  };

  VideoModel.deleteOne(search, callback);
};

VideoModel = mongoose.model('Video', VideoSchema);

module.exports.VideoModel = VideoModel;
module.exports.VideoSchema = VideoSchema;
