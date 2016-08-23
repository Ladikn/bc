(function (home) {
    home.init = function (app) {
		app.get("/", function (req, res) {
			res.render("index");
		})
	};
})(module.exports);