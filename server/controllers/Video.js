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
  /* if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  } */

  const promiseArray = [];
  const values = Object.values(req.body);

  for (let i = 0; i < values.length - 1; i++) {
    //Check if all data fields were entered
    if (!values[i].player1 || !values[i].player2 || !values[i].char1 || !values[i].char2 || !values[i].game || !values[i].link) {
      return res.statuc(400).json({ error: "All fields must be entered to store the data."});
    }

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

  return res.status(200).json({ message: 'Videos added' });
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
