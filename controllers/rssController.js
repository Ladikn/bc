(function(rssController) {

    var connection = require('./dbConnection');
    var feed = require('feed-read');

    
    function pull(r, res) {
        feed(r.rss, function(e, d) {
            res.send(d);
        })
    }

    rssController.init = function(app) {

        app.get("/services/rss/:category", function(req, res) {
            connection.query("CALL `retrieve_rss`('" + req.params.category + "');", function(err, rows, fields) {

                if (err) {
                    throw err;
                } else {
                    res.set("Content-Type", "application/json");
                    pull(rows[0][0], res);
                }
            });
        });

    };
})(module.exports);