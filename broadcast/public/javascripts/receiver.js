'use strict';

var isStarted = false;
var videoStream;
var pc;

var sdpConstraints = {'mandatory': {
  'OfferToReceiveAudio':true,
  'OfferToReceiveVideo':true }};

var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

/////////////////////////////////////////////

//var room = location.pathname.substring(1);
//if (room === '') {
////  room = prompt('Enter room name:');
//  room = 'foo';
//} else {
//  room = 'foo';
//}

var socket = io.connect('http://' + window.location.hostname + ':3000');

//if (room !== '') {
//  console.log('Create or join room', room);
//  socket.emit('create or join', room);
//}
//
//socket.on('created', function (room){
//  console.log('Created room ' + room);
//  isInitiator = true;
//});
//
//socket.on('full', function (room){
//  console.log('Room ' + room + ' is full');
//});
//
//socket.on('join', function (room){
//  console.log('Another peer made a request to join room ' + room);
//  console.log('This peer is the initiator of room ' + room + '!');
//  isChannelReady = true;
//});
//
//socket.on('joined', function (room){
//  console.log('This peer has joined room ' + room);
//  isChannelReady = true;
//});

//-------------------server and sender-----------------------------
function sendInfo(info){
  console.log('Client sending info: ', info);
  socket.emit('info', info);
}

socket.on('log', function (array){
  console.log.apply(console, array);
});

////////////////////////////////////////////////

socket.on('info', function (info){
  console.log('Client received info:', info);
  console.log('----------Message type: ', info.type);
  if (info === 'got user media') {
    call();
  } else if (info.type === 'offer') {
    if (!isStarted) {
      call();
    }
    pc.setRemoteDescription(new RTCSessionDescription(info));
    doAnswer();
  } else if (info.type === 'answer' && isStarted) {
    pc.setRemoteDescription(new RTCSessionDescription(info));
  } else if (info.type === 'candidate' && info.user == 'sender' && isStarted) {
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: info.label,
      candidate: info.candidate
    });
    pc.addIceCandidate(candidate);
  } else if (info === 'bye' && isStarted) {
    handleRemoteHangup();
  }
});

/////////////////////////start 获取本地媒体流///////////////////////////

//function start() {
//  console.log("---------------------Requesting local stream-----------------------");
//  var constraints = {video: true};
//
//  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//  navigator.getUserMedia(constraints, handleUserMedia, handleUserMediaError);
//
//  console.log('Getting user media with constraints', constraints);
//}
//
//function handleUserMedia(stream) {
//  console.log('Adding local stream.---------------------');
//  localVideo.src = window.URL.createObjectURL(stream);
//  localVideo.play();
//  localStream = stream;
//}
//
//function handleUserMediaError(error){
//  console.log('navigator.getUserMedia error: ', error);
//}

function call() {
  if (!isStarted) {
    console.log("-------------------call------------------------");
    createPeerConnection();
    //设置传送的流媒体
    //pc.addStream(localStream);
    isStarted = true;
  }
}

//关闭页面时
window.onbeforeunload = function(e){
  sendInfo('--------------Server leaving!---------------');
}

/////////////////////////////////////////////////////////

function createPeerConnection() {
  try {
    pc = new webkitRTCPeerConnection(null);
    pc.onicecandidate = handleIceCandidate;
    pc.onaddstream = handleRemoteStreamAdded;
    pc.onremovestream = handleRemoteStreamRemoved;
    console.log('Created RTCPeerConnnection------------------------');
    console.log(pc);
  } catch (e) {
    console.log('Failed to create PeerConnection, exception: ' + e.message);
    alert('Cannot create RTCPeerConnection object.');
      return;
  }
}

function handleIceCandidate(event) {
  console.log('handleIceCandidate event: ', event);
  if (event.candidate) {
    sendInfo({
      user: 'receiver',
      type: 'candidate',
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate});
  } else {
    console.log('End of candidates.');
  }
}

function setLocalAndSendMessage(sessionDescription) {
  // Set Opus as the preferred codec in SDP if Opus is present.
  sessionDescription.sdp = preferOpus(sessionDescription.sdp);
  pc.setLocalDescription(sessionDescription);
  console.log('setLocalAndSendMessage sending message' , sessionDescription);
  sendInfo(sessionDescription);
}

function handleCreateOfferError(event){
  console.log('createOffer() error: ', e);
}

//呼叫
function doCall() {
  console.log('Sending offer to peer');
  pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
}

//应答
function doAnswer() {
  console.log('Sending answer to peer.');
  pc.createAnswer(setLocalAndSendMessage, null, sdpConstraints);
}

function handleRemoteStreamAdded(event) {
  console.log('Remote stream added.------------------------');
  remoteVideo.src = window.URL.createObjectURL(event.stream);
  //暂时存储发送过来的stream用来转发(收的时候需要，发的时候不需要处理)
  videoStream = new webkitMediaStream(event.stream);
  console.log('Stream', event.stream);
  //videoStream = event.stream;
  console.log("-----------------------start call receiver--------------------");
  console.log('videoStream', videoStream);
  console.log(remoteVideo.src);
  call2();
}

function handleRemoteStreamRemoved(event) {
  console.log('Remote stream removed. Event: ', event);
}

/////////////////////////////////挂断/////////////////////////////////////////////////
//function hangup() {
//  console.log('Hanging up.');
//  stop();
//  sendMessage('bye');
//}

function handleRemoteHangup() {
  stop();
  isInitiator = false;
}

function stop() {
  isStarted = false;
  // isAudioMuted = false;
  // isVideoMuted = false;
  pc.close();
  pc = null;
}

////////////////////////////////other, not necessary/////////////////////////////////

// Set Opus as the default audio codec if it's present.
function preferOpus(sdp) {
  var sdpLines = sdp.split('\r\n');
  var mLineIndex;
  // Search for m line.
  for (var i = 0; i < sdpLines.length; i++) {
      if (sdpLines[i].search('m=audio') !== -1) {
        mLineIndex = i;
        break;
      }
  }
  if (mLineIndex === null) {
    return sdp;
  }

  // If Opus is available, set it as the default in m line.
  for (i = 0; i < sdpLines.length; i++) {
    if (sdpLines[i].search('opus/48000') !== -1) {
      var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
      if (opusPayload) {
        sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
      }
      break;
    }
  }

  // Remove CN in m line and sdp.
  sdpLines = removeCN(sdpLines, mLineIndex);

  sdp = sdpLines.join('\r\n');
  return sdp;
}

function extractSdp(sdpLine, pattern) {
  var result = sdpLine.match(pattern);
  return result && result.length === 2 ? result[1] : null;
}

// Set the selected codec to the first in m line.
function setDefaultCodec(mLine, payload) {
  var elements = mLine.split(' ');
  var newLine = [];
  var index = 0;
  for (var i = 0; i < elements.length; i++) {
    if (index === 3) { // Format of media starts from the fourth.
      newLine[index++] = payload; // Put target payload to the first.
    }
    if (elements[i] !== payload) {
      newLine[index++] = elements[i];
    }
  }
  return newLine.join(' ');
}

// Strip CN from sdp before CN constraints is ready.
function removeCN(sdpLines, mLineIndex) {
  var mLineElements = sdpLines[mLineIndex].split(' ');
  // Scan from end for the convenience of removing an item.
  for (var i = sdpLines.length-1; i >= 0; i--) {
    var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
    if (payload) {
      var cnPos = mLineElements.indexOf(payload);
      if (cnPos !== -1) {
        // Remove CN payload from m line.
        mLineElements.splice(cnPos, 1);
      }
      // Remove CN line in sdp
      sdpLines.splice(i, 1);
    }
  }

  sdpLines[mLineIndex] = mLineElements.join(' ');
  return sdpLines;
}

