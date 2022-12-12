const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const { Server } = require("socket.io");
const userRoutes = require('./routes/user-routes');
const postRoutes = require('./routes/post-routes');
const HttpError = require('./models/http-error');

const dbUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ezwt6uh.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());


let users = []
const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});


socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)
    socket.on("message", data => {
        socketIO.emit("messageResponse", data)
    })

    socket.on("typing", data => (
        socket.broadcast.emit("typingResponse", data)
    ))

    socket.on("newUser", data => {
        users.push(data)
        socketIO.emit("newUserResponse", users)
    })

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        users = users?.filter(user => user?.socketID !== socket?.id)
        socketIO.emit("newUserResponse", users)
        socket.disconnect()
    });
});


app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    next()
})

app.get('/', (req, res) => {
    res.json({
        message: 'Server is running',
    });
});

app.use('/api', userRoutes);
app.use('/api/post', postRoutes);


app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
})

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred!' });
})

mongoose.connect(dbUrl).then((res) => {
    app.listen(process.env.port || 5000);

    http.listen(4000, () => {
        console.log(`Server listening on 4000`);
    });
}).catch((err) => {
    console.log(process.env.DB_USER)
    const error = new HttpError(err, 404);
    throw error;
})
