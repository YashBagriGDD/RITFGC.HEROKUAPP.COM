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
  const promiseArray = [];
  const values = Object.values(req.body);

  for (let i = 0; i < values.length - 2; i++) {
    // Check if all data fields were entered
    console.dir(values[i]);
    // For some reason, this always throws regardless. I think we should stick
    // to the client side error check for emptiness.
    /* if (!values[i].player1 || !values[i].player2 || !values[i].char1
      || !values[i].char2  || !values[i].link) {
      return res.status(400).json({ error: "All fields must be entered to store the data."});
    } */

    const videoData = {
      player1: values[i].player1,
      player2: values[i].player2,
      char1: values[i].char1,
      char2: values[i].char2,
      game: values[i].game,
      link: values[i].link,
      owner: req.session.account._id,
    };

    const newVideo = new Video.VideoModel(videoData);
    const videoPromise = newVideo.save();

    videoPromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Video already exists' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });

    promiseArray.push(videoPromise);
  }

  Promise.all(promiseArray).then(() => res.json({ redirect: '/maker' }));
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

const searchVideos = (request, response) => {
  const req = request;
  const res = response;

  const params = {};

  // check if the params exist
  if (req.query.player1) params.player1 = req.query.player1;
  if (req.query.player2) params.player2 = req.query.player2;
  if (req.query.char1) params.char1 = req.query.char1;
  if (req.query.char2) params.char2 = req.query.char2;
  if (req.query.game) params.game = req.query.game;

  return Video.VideoModel.findSearch(params, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ videos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getVideos = getVideos;
module.exports.getAllVideos = getAllVideos;
module.exports.make = makeVideo;
module.exports.delete = deleteEntry;
module.exports.searchVideos = searchVideos;
