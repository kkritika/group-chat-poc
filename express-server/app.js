// ./express-server/app.js
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import SourceMapSupport from 'source-map-support';
import bb from 'express-busboy';
import http from 'http';
import socket from 'socket.io';

// import routes
import todoRoutes from './routes/todo.server.route';

//import controller file
import * as todoController from './controllers/todo.server.controller';

// define our app using express
const app = express();

const server = http.Server(app);
const io = socket(server);

// express-busboy to parse multipart/form-data
bb.extend(app);

// socket.io connection
io.on('connection', (socket) => {
    console.log("Connected to Socket!!" + socket.id);

    var defaultRoom = 'general';
    var rooms = ["general", "angular", "socket.io", "express", "node", "mongo", "PHP", "laravel"];

    //Emit the rooms array
    socket.emit('setup', {
        rooms: rooms,
        user: {
            id: socket.id
        }
    });


    socket.on('new user', function(data) {
        data.room = defaultRoom;
        data.oldRoom = '';
        data.newRoom = defaultRoom;
        // data.id = socket.id
        console.log('user joined - ', data)
        //New user joins the default room
        socket.join(defaultRoom);
        //Tell all those in the room that a new user joined
        io.in(defaultRoom).emit('user joined', data);
    });

    //Listens for switch room
    socket.on('switch room', function(data) {
        //Handles joining and leaving rooms
        socket.leave(data.oldRoom);
        socket.join(data.newRoom);
        io.in(data.oldRoom).emit('user left', data);
        console.log('user left ' + data.oldRoom)
        io.in(data.newRoom).emit('user joined', data);
        console.log('user joined ' + data.newRoom)

    });

    socket.on('new message', function(data) {
        // body...
        console.log('Received message from : ', data)
    })

})

// allow-cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// configure app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// set the port
const port = process.env.PORT || 3001;

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin123:admin123@ds247141.mlab.com:47141/group_chat', {
    useMongoClient: true,
});

// add Source Map Support
SourceMapSupport.install();

app.use('/api', todoRoutes);

app.get('/', (req, res) => {
    return res.end('Api working');
});

// catch 404
app.use((req, res, next) => {
    res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});


// start the server
server.listen(port, () => {
    console.log(`App Server Listening at ${port}`);
});