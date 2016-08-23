(function(internalController) {

    var connection = require('./dbConnection');
    var modal1 = '<div class="md-dialog-content">';
    var modal2 = '</div>';

    internalController.init = function(app) {


        function allActArt(j) {
            var x = [];
            j.forEach(function(d, i, a) {
                if (d.active == 1) {
                    x = x.concat(d);
                }
            })
            return x;
        }

        function allInactArt(j) {
            var x = [];
            j.forEach(function(d, i, a) {
                if (d.active == 0) {
                    x = x.concat(d);
                }
            })
            return x;
        }

        app.get("/services/articles/get/active/:key", function(req, res) {
            connection.query("CALL `retrieve_articles`('" + req.params.key + "');", function(err, rows, fields) {

                if (err) {
                    throw err;
                } else {
                    res.set("Content-Type", "application/json");
                    res.json(allActArt(rows[0]));
                }
            });
        });

        app.get("/services/articles/inactive", function(req, res) {
            connection.query('SELECT a.name, a.key, a.active FROM articles a', function(err, rows, fields) {
                if (err) {
                    throw err;
                } else {
                    res.set("Content-Type", "application/json");
                    res.json(allInactArt(rows));
                }
            });
        });

        app.get("/services/article/get/:key", function(req, res) {
            connection.query("SELECT * FROM articles WHERE `key` = '" + req.params.key + "'", function(err, rows, fields) {
                if (err) {
                    console.log(err);
                } else {
                    res.set("Content-Type", "application/json");
                    res.json(rows[0]);
                }
            })
        });

        app.post('/services/article/delete', function(req, res) {
            connection.query("DELETE FROM `articles` WHERE `key`='" + req.body.key +"';")
        })

        app.post("/services/article/add", function(req, res) {
            var name = req.body.name;
            var title = req.body.title;
            var summary = req.body.summary;
            var content = req.body.content;
            var active = req.body.active ? req.body.active : 1;
            var video = req.body.video ? req.body.video : null;
            var category = req.body.category;
            var tag1 = req.body.tag1 ? req.body.tag1 : null;
            var tag2 = req.body.tag2 ? req.body.tag2 : null;
            var tag3 = req.body.tag3 ? req.body.tag3 : null;

            var query = "INSERT INTO `articles` (name, category, active, video ,title, summary, content, tag1, tag2, tag3) VALUES ('" +
                name +
                "', '" +
                category +
                "', '" +
                active +
                "', '" +
                video +
                "', '" +
                title +
                "', ' " +
                summary +
                "', ' " +
                modal1 + content + modal2 +
                "', ' " +
                tag1 +
                "', ' " +
                tag2 +
                "', ' " +
                tag3 +
                "')"

            connection.query(query, function(err, rows, fields) {
                if (err) {
                    console.log(err);
                }
            })
        });

        app.post("/services/article/edit", function(req, res) {
            var key = req.body.key;
            var name = req.body.name;
            var title = req.body.title;
            var summary = req.body.summary;
            var content = req.body.content;
            var active = req.body.active;
            var video = req.body.video;
            var category = req.body.category;
            var tag1 = req.body.tag1;
            var tag2 = req.body.tag2;
            var tag3 = req.body.tag3;

            var query = "UPDATE `articles` SET `name`='" +
                name +
                "', `title`='" +
                title +
                "', `summary`='" +
                summary +
                "', `content`='" +
                content +
                "', `active`='" +
                active +
                "', `video`='" +
                video +
                "', `category`='" +
                category +
                "', `tag1`='" +
                tag1 +
                "', `tag2`='" +
                tag2 +
                "', `tag3`='" +
                tag3 +
                "' WHERE `key`='" +
                key + "';";

            connection.query(query, function(err, rows, fields) {
                if (err) {
                    console.log(err);
                }
            })
        });


    };
})(module.exports);