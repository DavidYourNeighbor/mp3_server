// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var Llama = require('./models/llama');
var User = require('./models/user');
var Task = require('./models/task');
var bodyParser = require('body-parser');
var router = express.Router();
var Schema = mongoose.Schema;

//replace this with your Mongolab URL
mongoose.connect('mongodb://DavidYourNeighbor:BlauVoegel7!@ds061641.mongolab.com:61641/mp3_database');

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type: application/json, Accept");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});

//Llama route 
//var llamaRoute = router.route('/llamas');

//llamaRoute.get(function(req, res) {
//  res.json([{ "name": "alice", "height": 12 }, { "name": "jane", "height": 13 }]);
//});

//Add more routes here

var userRoute = router.route('/users')

    .post(function(req, res){
        var user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.pendingTasks = req.body.pendingTasks;
        user.dateCreated = req.dateTime;
        if(user.name == undefined)
        {
            res.status(500).json({message: 'User name is required. Current name is'+user.name});
        }
        else if(user.email == undefined)
        {
            res.status(500).json({message: 'User email is required.'});
        }
        else {
            user.save(function (err) {
                if(err) {
                    if(err.name == "MongoError") {
                        res.status(500).json({message: 'A user with that email already exists.'});
                    }
                    else {
                        res.status(500).json({message: 'Invalid user information.'});
                    }
                }
                else {
                    res.status(201).json({message: 'User created!', data: user});
                }
            });
        }
    })

    .get(function(req, res) {
        var queries = req.query;
        var where = eval("("+queries.where+")");
        var sort = eval("("+queries.sort+")");
        var select = eval("("+queries.select+")");
        var skip = eval("("+queries.skip+")");
        var limit = eval("("+queries.limit+")");
        User.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function(err,users){
                if(err) {
                    res.status(404).json({message: 'User not found.'});
                }
                else {
                    res.status(200).json({message: 'Users displayed below.', data: users});
                }
        });     //.sort(sort).select(select).skip(skip).limit(limit).
    })

    .options(function(req, res) {
        res.writeHead(200);
        res.end();
    });

var userIdRoute = router.route('/users/:id')
    .get(function(req, res) {
        User.findById(req.params.id, function(err, user) {
            if(err | user == null) {
                res.status(404).json({message: 'User not found.'});
            }
            else {
                res.status(200).json({message: 'User displayed below.', data: user});
            }
        });
    })

    .put(function(req, res) {
       User.findById(req.params.id, function(err, user) {
          if(err) {
              res.status(404).json({message: 'Could not find user.'});
          }
          else {
              user.name = req.body.name;
              user.email = req.body.email;
              user.pendingTasks = req.body.pendingTasks;
              if (user.name == undefined) {
                  res.status(500).json({message: 'User name is required.'});
              }
              else if (user.email == undefined) {
                  res.status(500).json({message: 'User email is required.'});
              }
              else {
                  user.save(function (err) {
                      if (err){
                          if(err.name == "MongoError") {
                              res.status(500).json({message: 'A user with that email already exists.'});
                          }
                          else {
                              res.status(500).json({message: 'Invalid user information.'});
                          }
                      }
                      else {
                          res.status(200).json({message: 'User updated!', data: user});
                      }
                  });
              }
          }
       });
    })

    .delete(function(req, res) {
        User.findById(req.params.id, function (err, userout) {
            if(userout == undefined | userout == null) {
                res.status(404).json({message: 'User not found.'});
            }
            else {
                User.remove({
                    _id: req.params.id
                }, function (err, user) {
                    if (err) {
                        res.status(404).json({message: 'User not found.'});
                    }
                    else {
                        res.status(200).json({message: 'User successfully deleted!'});
                    }
                });
            }
        });
    });




var taskRoute = router.route('/tasks')

    .post(function(req, res){
        var task = new Task();
        task.name = req.body.name;
        task.description = req.body.description;
        task.deadline = req.body.deadline;
        task.completed = req.body.completed;
        task.assignedUser = req.body.assignedUser;
        task.assignedUserName = req.body.assignedUserName;
        task.dateCreated = req.dateTime;
        if(task.name == undefined) {
            res.status(500).json({message: 'Task name is required.'});
        }
        else if(task.deadline == undefined) {
            res.status(500).json({message: 'Task deadline is required.'});
        }
        else {
            task.save(function (err) {
                if(err)
                    res.status(500);
                res.status(201).json({message: 'Task created!', data: task});
            });
        }
    })

    .get(function(req, res) {
        var queries = req.query;
        var where = eval("("+queries.where+")");
        var sort = eval("("+queries.sort+")");
        var select = eval("("+queries.select+")");
        var skip = eval("("+queries.skip+")");
        var limit = eval("("+queries.limit+")");
        Task.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function(err,tasks){
            if(err) {
                res.status(404).json({message: 'Tasks not found.'});
            }
            else {
                res.status(200).json({message: 'Tasks displayed below.', data: tasks});
            }
        });     //.sort(sort).select(select).skip(skip).limit(limit).
    })

    .options(function(req, res) {
        res.writeHead(200);
        res.end();
    });



var taskIdRoute = router.route('/tasks/:id')
    .get(function(req, res) {
        Task.findById(req.params.id, function(err, task) {
            if(err) {
                res.status(404).json({message: 'Task not found.'});
            }
            res.status(200).json({message: 'Task displayed below.', data: task});
        })
    })

    .put(function(req, res) {
        Task.findById(req.params.id, function(err, task) {
            if(err) {
                res.status(404).json({message: 'Task not found.'});
            }
            else {
                task.name = req.body.name;
                task.description = req.body.description;
                task.deadline = req.body.deadline;
                task.completed = req.body.completed;
                task.assignedUser = req.body.assignedUser;
                task.assignedUserName = req.body.assignedUserName;

                if (task.name == undefined) {
                    res.status(500).json({message: 'Task name is required.'});
                }
                else if (task.deadline == undefined) {
                    res.status(500).json({message: 'Task deadline is required.'});
                }
                else {
                    task.save(function (err) {
                        if (err)
                            res.status(500);
                        res.status(200).json({message: 'Task updated.', data: task});
                    });
                }
            }
        });
    })

    .delete(function(req, res) {
        Task.findById(req.params.id, function (err, taskout) {
            if(taskout == undefined) {
                res.status(404).json({message: 'Task not found.'});
            }
            else {
                Task.remove({
                    _id: req.params.id
                }, function (err, task) {
                    if (err) {
                        res.status(404).json({message: 'Task not found.'});
                    }
                    else {
                        res.status(200).json({message: 'Task successfully deleted!'});
                    }
                });
            }
        });
    });


// Start the server


app.listen(port);
console.log('Server running on port ' + port); 