(function(internalController) {

    var connection = require('./dbConnection');

    internalController.init = function(app) {

        app.post("/services/user/signin", function(req, res) {
            connection.query("SELECT u.name, u.password FROM users u WHERE u.name = " + req.body.name, function(err, rows, fields) {
                if (err) {
                    res.err;
                } else {
                    
                    //res.set("Content-Type", "application/json");
                    //res.json(rows[0])
                }
            });
        });

        app.post("/services/user/new", function(req, res) {
            connection.query("INSERT INTO `users` (`name`, `password`) VALUES ('" + req.body.name + "', '" + req.body.password + "');", function(err, rows, fields) {
                console.log(req.body)
                if (err) {
                    throw err;
                } else {
                    res.set("Content-Type", "application/json");
                    res.json(rows[0])
                }
            });
        });
    }
})(module.exports);