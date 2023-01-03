const express = require("express");

//add express
const app = express();

const server = require("http").Server(app);
//add io socket
const io = require("socket.io")(server);
//add uuid
const { v4: uuidv4 } = require("uuid");

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

// set view engine
app.set("view engine", "ejs");
// static routes
app.use(express.static("public"));
app.use("/peerjs", peerServer);


// routes to uuid
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

// routes to id
app.get("/:id", (req, res) => {
  res.render("room", { roomid: req.params.id });
});



// io connection
io.on('connection', (socket) => {
    socket.on('join-room',(roomid,userid)=>{
        console.log('Daz Joined',roomid);
        socket.join(roomid);
        socket.to(roomid).emit('user-connected',userid);
        // socket.broadcast.to(roomid).emit("user-connected", userid);
        
    })

})



// server listen
server.listen(process.env.PORT || 3000);

