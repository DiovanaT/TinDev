const dotenv = require("dotenv");
//express lib
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");

const app = express();
app.use(cors());
const server = require('http').Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    },
    allowEIO3: true
});

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;
    //console.log(user, socket.id)
    connectedUsers[user] = socket.id;
});

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use((req, res, next) => {
    req.io = io;
    req. connectedUsers = connectedUsers;
    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(9393);
