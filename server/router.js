const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getVideos', mid.requiresLogin, controllers.Video.getVideos);
  app.get('/getAllVideos', controllers.Video.getAllVideos);
  app.get('/search', controllers.Video.searchVideos);
  app.post('/passChange', mid.requiresLogin, controllers.Account.passChange);
  app.post('/delete', mid.requiresSecure, mid.requiresLogin, controllers.Video.delete);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/main', mid.requiresLogin, controllers.Video.mainPage);
  app.post('/main', mid.requiresLogin, controllers.Video.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('/*', controllers.Video.mainPage);
};

module.exports = router;
