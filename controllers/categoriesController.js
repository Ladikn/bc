(function(categoriesController) {

    var connection = require('./dbConnection');

    function organize(d) {
        d.forEach(function(e, i, a) {
            //clean input
            e.size = 1000;
            e.children = [];
        }, this);

        var x = [d[0]]
        d.forEach(function(e, i, a) {
            //define categories
            if (e.parent == d[0].key && e.active == 1) {
                x[0].children = x[0].children.concat(e);
            }
        }, this);
        x[0].children.forEach(function(e1, i, a) {
            //define subcategories
            d.forEach(function(e2, i, a) {
                if (e2.parent == e1.key && e2.active == 1) {
                    e1.children = e1.children.concat(e2);
                }
            }, this);
        }, this);
        return x[0];
    }

    function allActCat(j) {
        var x = [];
        j.forEach(function(d, i, a) {
            if (d.parent != null || d.active == 1) {
                x = x.concat(d);
            }
        })
        return x;
    }

    function allInactCat(j) {
        var x = [];
        j.forEach(function(d, i, a) {
            if (d.active == 0) {
                x = x.concat(d);
            }
        })
        return x;
    }

    function allIntCat(j) {
        var x = [];
        j.forEach(function(d, i, a) {
            if (d.internal == 1 && d.active == 1) {
                x = x.concat(d);
            }
        })
        return x;
    }

    function subCat(j) {
        var x = [];
        j.forEach(function(d, i, a) {
            if (d.parent == null || (d.parent == j[0].key && d.active == 1)) {
                x = x.concat(d);
            }
        })
        return x;
    }

    categoriesController.init = function(app) {

        app.get("/services/categories/organized", function(req, res) {
            connection.query('SELECT c.key, c.name, c.color, c.parent, c.internal, c.active FROM categories c', function(err, rows, fields) {

                if (err) {
                    throw err;
                } else {
                    res.set("Content-Type", "application/json");
                    res.json(organize(rows));
                }
            });
        });

        app.get("/services/categories/sub", function(req, res) {
            connection.query('SELECT c.key, c.name, c.color, c.active, c.parent FROM categories c', function(err, rows, fields) {
                if (err) {
                    throw err;
                } else {
                    res.set("Content-Type", "application/json");
                    res.json(subCat(rows));
                }
            });
        });
        
        app.get("/services/categories/active", function(req, res) {
            connection.query('SELECT c.key, c.name, c.color, c.active, c.parent, c.rss FROM categories c', function(err, rows, fields) {
                if (err) {
                    throw err;
                } else {
                    res.set("Content-Type", "application/json");
                    res.json(allActCat(rows));
                }
            });
        });
        
        app.get("/services/categories/inactive", function(req, res) {
            connection.query('SELECT c.key, c.name, c.color, c.active, c.parent FROM categories c', function(err, rows, fields) {
                if (err) {
                    throw err;
                } else {
                    res.set("Content-Type", "application/json");
                    res.json(allInactCat(rows));
                }
            });
        });
        
        app.get("/services/categories/internal", function(req, res) {
            connection.query('SELECT c.key, c.name, c.active, c.internal FROM categories c', function(err, rows, fields) {
                if (err) {
                    throw err;
                } else {
                    res.set("Content-Type", "application/json");
                    res.json(allIntCat(rows));
                }
            });
        });

        app.post('/services/categories/new', function(req, res) {
            var internal;
            var name = req.body.name;
            var color = req.body.color;
            var parent = req.body.parent;
            var active = req.body.active;
            var rss = (function() {
                if (req.body.rss) {
                    internal = 0;
                    return req.body.rss;
                } else {
                    internal = 1;
                    return null;
                }
            })();

            var query = "INSERT INTO `categories` (`name`, `color`, `parent`, `internal`, `rss`, `active`) VALUES ('" + 
            name + 
            "', '" + 
            color + 
            "', '" + 
            parent + 
            "', '" + 
            internal + 
            "', '" + 
            rss + 
            "', ' " + 
            active + 
            "')"

            connection.query(query), function(err, rows, fields) {

            }
        });

        app.post('/services/categories/deactivate', function(req, res) {
            connection.query("UPDATE `categories` SET `active`='0' WHERE `key`='" + req.body.key +"';")
        })

        app.post('/services/categories/restore', function(req, res) {
            connection.query("UPDATE `categories` SET `active`='1' WHERE `key`='" + req.body.key +"';")
        })

        app.post('/services/categories/delete', function(req, res) {
            console.log(req.body);
            connection.query("DELETE FROM `categories` WHERE `key`='" + req.body.key +"';")
        })

        app.post('/services/categories/edit', function(req, res) {
            var internal;
            var name = req.body.name;
            var color = req.body.color;
            var parent = req.body.parent;
            var active = req.body.active;
            var key = req.body.key;
            var rss = (function() {
                if (req.body.rss) {
                    internal = 0;
                    return req.body.rss;
                } else {
                    internal = 1;
                    return null;
                }
            })();
//UPDATE `blockchain`.`categories` SET `name`='EuroClear2', `color`='#00b422' WHERE `id`='75';

            var query = "UPDATE `categories` SET `name`='" + 
            name +
            "', `color`='" + 
            color + 
            "', `parent`='" + 
            parent + 
            "', `active`='" + 
            active + 
            "', `rss`='" + 
            rss + 
            "' WHERE `key`='" + 
            key + "';";


            connection.query(query), function(err, rows, fields) {
            }
        });
    };
})(module.exports);