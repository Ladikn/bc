(function (controllers) {
	var home = require('./home');
	var admin = require('./admin');
	var categoriesController = require('./categoriesController');
	var rssController = require('./rssController');
	var internalController = require('./internalController');
	var userController = require('./userController');
	controllers.init = function (app) {
		home.init(app);
		admin.init(app);
		categoriesController.init(app);
		rssController.init(app);
		internalController.init(app);
		userController.init(app);
	};
})(module.exports);