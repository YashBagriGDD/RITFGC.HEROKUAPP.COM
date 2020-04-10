const models = require('../models');

const { Video } = models;

const makerPage = (req, res) => {
  Video.VideoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), videos: docs });
  });
};

const makeVideo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const videoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  const newVideo = new Video.VideoModel(videoData);

  const videoPromise = newVideo.save();

  videoPromise.then(() => res.json({ redirect: '/maker' }));

  videoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Video already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return videoPromise;
};

const getVideos = (request, response) => {
  const req = request;
  const res = response;

  return Video.VideoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ videos: docs });
  });
};

const getAllVideos = (request, response) => {
  const res = response;

  return Video.VideoModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ videos: docs });
  });
};

const deleteEntry = (request, response) => {
  const req = request;
  const res = response;

  Video.VideoModel.deleteItem(req.body.uid, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ result: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getVideos = getVideos;
module.exports.getAllVideos = getAllVideos;
module.exports.make = makeVideo;
module.exports.delete = deleteEntry;
