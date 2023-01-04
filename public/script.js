const socket = io("/");
const myPeer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});

const peers ={};

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userid) => {
      setTimeout(()=>{

      connectToNewUser(userid,stream)
      },1000)
      
    });

  })
  .catch((err) => {
    console.log(err);
  });

// socket.emit("join-room", roomid);
// socket.on("user-connected", (userid) => {
//   connectToNewUser(userid);
// });

myPeer.on("open", (id) => {
  console.log(id);
   socket.emit("join-room", roomid, id);
});

// socket.on('user-disconnected', (userid) => {
  
//   if(peers[userid]){
// peers[userid].close();
//   } 
// });


socket.on("user_disconnected", (userid) => {
  if (peers[userid]) {
    peers[userid].close();
  }
});





const connectToNewUser = (userid,stream) => {
  console.log("daz from front", userid);
  const call = myPeer.call(userid, stream);
  const video = document.createElement("video");

  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  });

  call.on("close", () => {
    video.remove();
  });
  peers[userid] = call;
  console.log(peers);
};


const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoGrid.append(video);
};