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
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

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
            res.json({message: 'User name is required.'});
            res.status(500);
        }
        else if(user.email == undefined)
        {
            res.json({message: 'User email is required.'});
            res.status(500);
        }
        /*
        else if (user.email is a duplicate email)
        {
            res.json({message: 'Another user already exists with that email.'});
            res.status(500);
        }
        */
        else {
            user.save(function (err) {
                if(err)
                    res.status(500);
                res.json({message: 'User created!', data: user});
                res.status(201);
            });
        }
    })

    .get(function(req, res) {
        var queries = req.query;
        User.find(function(err, users) {
            if(err) {
                res.json({message: 'User not found.'});
                res.status(404);
            }
            else {
                res.json(users);
                res.status(200);
            }
        }); /*.where().sort().select().skip().limit().count.exec()*/
    })

    .options(function(req, res) {
        res.writeHead(200);
        res.end();
    });

var userIdRoute = router.route('/users/:id')
    .get(function(req, res) {
        User.findById(req.params.id, function(err, user) {
            if(err) {
                res.json({message: 'User not found.'});
                res.status(404);
            }
            else {
                res.json(user);
                res.status(200);
            }
        });
    })

    .put(function(req, res) {
       User.findById(req.params.id, function(err, user) {
          if(err) {
              res.json({message: 'User not found.'});
              res.status(404);
          }
          else {
              user.name = req.body.name;
              user.email = req.body.email;
              user.pendingTasks = req.body.pendingTasks;
              if (user.name == undefined) {
                  res.json({message: 'User name is required.'});
                  res.status(500);
              }
              else if (user.email == undefined) {
                  res.json({message: 'User email is required.'});
                  res.status(500);
              }
              /*
              else if (user.email is a duplicate email)
              {
                   res.json({message: 'Another user already exists with that email.'});
                   res.status(500);
              }
              */
              else {
                  user.save(function (err) {
                      if (err)
                          res.status(500);
                      res.json({message: 'User updated!', data: user});
                      res.status(200);
                  });
              }
          }
       });
    })

    .delete(function(req, res) {
        User.findById(req.params.id, function (err, userout) {
            if(userout == undefined) {
                res.json({message: 'User not found.'});
                res.status(404);
            }
            else {
                User.remove({
                    _id: req.params.id
                }, function (err, user) {
                    if (err) {
                        res.json({message: 'User not found.'});
                        res.status(404);
                    }
                    else {
                        res.json({message: 'User successfully deleted!'});
                        res.status(200);
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
        task.deadline = req.body.date;
        task.completed = req.body.completed;
        task.assignedUser = req.body.assignedUser;
        task.assignedUserName = req.body.assignedUserName;
        task.dateCreated = req.dateTime;
        if(task.name == undefined) {
            res.json({message: 'Task name is required.'});
            res.status(500);
        }
        else if(task.deadline == undefined) {
            res.json({message: 'Task deadline is required.'});
            res.status(500);
        }
        else {
            task.save(function (err) {
                if(err)
                    res.status(500);
                res.json({message: 'Task created!', data: task});
                res.status(201);
            });
        }
    })

    .get(function(req, res){
        var queries = req.query;
        Task.find(function(err, tasks) {
            if(err) {
                res.json({message: 'Tasks not found.'});
                res.status(404);
            }
            res.json(tasks);
            res.status(200);
        })
    })

    .options(function(req, res) {
        res.writeHead(200);
        res.end();
    });



var taskIdRoute = router.route('/tasks/:id')
    .get(function(req, res) {
        Task.findById(req.params.id, function(err, task) {
            if(err) {
                res.json({message: 'Task not found.'});
                res.status(404);
            }
            res.json(task);
            res.status(200);
        })
    })

    .put(function(req, res) {
        Task.findById(req.params.id, function(err, task) {
            if(err) {
                res.json({message: 'Task not found.'});
                res.status(404);
            }
            else {
                task.name = req.body.name;
                task.description = req.body.description;
                task.deadline = req.body.deadline;
                task.completed = req.body.completed;
                task.assignedUser = req.body.assignedUser;
                task.assignedUserName = req.body.assignedUserName;

                if (task.name == undefined) {
                    res.json({message: 'Task name is required.'});
                    res.status(500);
                }
                else if (task.deadline == undefined) {
                    res.json({message: 'Task deadline is required.'});
                    res.status(500);
                }
                else {
                    task.save(function (err) {
                        if (err)
                            res.status(500);
                        res.json({message: 'Task updated.', data: task});
                        res.status(200);
                    });
                }
            }
        });
    })

    .delete(function(req, res) {
        Task.findById(req.params.id, function (err, taskout) {
            if(taskout == undefined) {
                res.json({message: 'Task not found.'});
                res.status(404);
            }
            else {
                Task.remove({
                    _id: req.params.id
                }, function (err, task) {
                    if (err) {
                        res.json({message: 'Task not found.'});
                        res.status(404);
                    }
                    else {
                        res.json({message: 'Task successfully deleted!'});
                        res.status(200);
                    }
                });
            }
        });
    });


// Start the server


app.listen(port);
console.log('Server running on port ' + port); 