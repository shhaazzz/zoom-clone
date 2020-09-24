const socket = io('/')
const videoGrid = document.getElementById('video-grid')
console.log(videoGrid);
const myVideo = document.createElement('video');
myVideo.muted = false;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
}); 

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
        console.log('user connected');
        console.log(userId);
    })

})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})



const connectToNewUser = (userId, stream) => {
    console.log('new user');
    const call = peer.call(userId, stream);
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream('video', userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
      })
      videoGrid.append(video)
}

let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val())
      socket.emit('message', text.val());
      text.val('')
    }
  });


  socket.on('createmessage', message => {
      $('ul').append(`<li class="messages"><b>User</b></br>${message}</li>`)      
      scrolToBottom();

  })


  const scrolToBottom = () => {
      let d = $('main__chat_window');
          d.scrollTop(d.prop("scrollHeight"))
      
  }

  const muteUnmute = () => {
      console.log('mute');
      let enabled = myVideoStream.getAudioTracks()[0].enabled;
      if (enabled) {
          myVideoStream.getAudioTracks()[0].enabled = false;
          setMuteButton()
      }else {
        setUnmuteButton()
          myVideoStream.getAudioTracks()[0].enabled = true;
          
      }
  }

  const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }


  
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }

  