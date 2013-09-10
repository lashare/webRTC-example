var webrtc = (function() {

  var getVideo = true,
      getAudio = true,

      video = document.getElementById('webcam');
      //指定视频播放区域

  //多浏览器支持(getUserMedia、window.url和window.audioContext在不同浏览器下都有所不同)
  navigator.getUserMedia ||
      (navigator.getUserMedia = navigator.mozGetUserMedia ||
      navigator.webkitGetUserMedia || navigator.msGetUserMedia);

  window.audioContext ||
      (window.audioContext = window.webkitAudioContext);

  function onSuccess(stream) {
    var videoSource,
        audioContext,
        mediaStreamSource;

    //------------------------video----------------------------------
    if (getVideo) {
      if (window.webkitURL) {
        //创建一个新的对象URL,用来代表stream
        videoSource = window.webkitURL.createObjectURL(stream);
      } else {
        videoSource = stream;
      }

      //视频自动播放
      video.autoplay = true;
      //指定视频流,不同浏览器下viedo的使用不同，chrome中使用createObjectURL的方法
      video.src = videoSource;
    }

    //------------------------audio----------------------------------
    if (getAudio && window.audioContext) {
      audioContext = new window.audioContext();
      mediaStreamSource = audioContext.createMediaStreamSource(stream);
      mediaStreamSource.connect(audioContext.destination);
    }
  }

  function onError() {
    alert('There has been a problem retreiving the streams - are you running on file:/// or did you disallow access?');
  }

  function requestStreams() {
    //检测浏览器是否支持getUserMedia
    if (navigator.getUserMedia) {
      navigator.getUserMedia({
        video: getVideo,
        audio: getAudio
        }, onSuccess, onError);
    } else {
      alert('getUserMedia is not supported in this browser.');
    }
  }

  (function init() {
      requestStreams();
  }());
})();
