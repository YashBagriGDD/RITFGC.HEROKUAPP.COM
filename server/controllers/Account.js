const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover up security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// Password change that takes a lot from the signup function
const passChange = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required!' });
  }

  if (req.body.pass === req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords cannot be the same!' });
  }

  // Check to see if the initial password was correct in the first place
  return Account.AccountModel.authenticate(req.session.account.username,
    req.body.pass, (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'Incorrect Password' });
      }

      // If they do, make a new hash for it with the newPassword
      return Account.AccountModel.generateHash(req.body.pass2, (salt, hash) => {
      // While making the hash, update the current password for this
      // session's username since we require login anyway
      // https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/
        Account.AccountModel.updateOne({ username: req.session.account.username },
          { salt, password: hash }, (errUpdate) => {
            if (errUpdate) {
              return res.status(400).json({ error: 'There was an error' });
            }
            return res.json({ redirect: '/maker' });
          });
      });
    });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.passChange = passChange;
