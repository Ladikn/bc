(function (admin) {
    admin.init = function (app) {
		app.get("/admin", function (req, res) {
			res.render("admin");
		})
	};
})(module.exports);