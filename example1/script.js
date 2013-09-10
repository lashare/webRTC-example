var webrtc = (function() {

  var getVideo = true,
      getAudio = true,
      //指定视频播放区域
      video = document.getElementById('webcam'),
      //Canvas stream
      display = document.getElementById('display'),
      displayContext = display.getContext('2d');

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

      //Canvas stream
      display.width =  320;
      display.height = 240;

      streamFeed();
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

  function takePhoto() {
    //photo指定截屏后展示图片的地方,context是类似笔或颜料刷之类的工具集
    var photo = document.getElementById('photo'),
        context = photo.getContext('2d');

    // draw our video image
    photo.width = video.clientWidth;
    photo.height = video.clientHeight;

    // http://www.w3school.com.cn/html5/canvas_drawimage.asp
    context.drawImage(video, 0, 0, photo.width, photo.height);
  }

  function streamFeed() {
    requestAnimationFrame(streamFeed);
    displayContext.drawImage(video, 0, 0, display.width, display.height);
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

  function initEvents() {
    //拍照的事件监听
    var photoButton = document.getElementById('takePhoto');
    photoButton.addEventListener('click', takePhoto, false);
  }

  (function init() {
      requestStreams();
      initEvents();
  }());
})();
