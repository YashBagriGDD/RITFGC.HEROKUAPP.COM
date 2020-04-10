const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let VideoModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const VideoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
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
  name: doc.name,
  age: doc.age,
});

VideoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return VideoModel.find(search).select('name age').lean().exec(callback);
};

VideoSchema.statics.findAll = (callback) => VideoModel.find().select('name age').lean().exec(callback);

VideoSchema.statics.deleteItem = (uid, callback) => {
  const search = {
    _id: uid,
  };

  VideoModel.deleteOne(search, callback);
};

VideoModel = mongoose.model('Video', VideoSchema);

module.exports.VideoModel = VideoModel;
module.exports.VideoSchema = VideoSchema;
