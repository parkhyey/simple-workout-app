// handle the frontend's AJAX request and send back the appropriate data
var express = require('express');
var mysql = require('./myCred.js');  // export pool
var cors = require('cors')

var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

// setup bodyParser for pulling a request from body
var bodyParser = require('body-parser');
const e = require("express");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 33122);
app.use(cors())

// serve static files
app.use(express.static('public'));

// reset table
app.get('/reset-table', function (req, res, next) {
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS workouts", function (err) {
        var createString = "CREATE TABLE workouts(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "date DATE," +
            "lbs BOOLEAN)";
        mysql.pool.query(createString, function (err) {
            context.results = "Table reset";
            res.render('home', context);
        })
    });
});

// GET request to show all rows of the table
app.get('/', function (req, res, next) {
    // if there is a passed id value, select the row with matching id
    if (req.query.id) {
        mysql.pool.query('SELECT * FROM workouts WHERE id=?', [req.query.id], function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(rows);
        });
    }
    // otherwise, select all rows
    else {
        mysql.pool.query('SELECT * FROM workouts', function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(rows);
        });
    }
});

// POST request to insert a row
app.post('/', function (req, res, next) {
    var qParams = [];
    mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES(?,?,?,?,?)",
        [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            for (var p in req.query) {
                qParams.push({ 'name': p, 'value': req.query[p] })
            }
            var context = {};
            context.dataList = qParams;
            mysql.pool.query("SELECT * FROM workouts", function (err, rows, fields) {
                if (err) {
                    next(err);
                    return;
                }
                context.allData = rows;
                res.send(context);
            });

        });
});

// DELETE request to delete a row with matching id
app.delete('/', function (req, res, next) {
    mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function (err, result) {
        if (err) {
            next(err);
            return;
        }
        res.send(result)
    });
});

// PUT request to edit a row with matching id
app.put('/', function (req, res, next) {
    var qParams = [];
    mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?",
        [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs, req.query.id],
        function (err, result) {
            if (err) {
                next(err);
                return;
            }
            for (var p in req.query) {
                qParams.push({ 'name': p, 'value': req.query[p] })
            }
            var context = {};
            context.dataList = qParams;
            mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id],
                function (err, row, fields) {
                    if (err) {
                        next(err);
                        return;
                    }
                    context.rowData = row;
                    res.send(context);
                });
        });
});

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('listening on port:' + app.get('port') + '/; press Ctrl-C to terminate.');
});
