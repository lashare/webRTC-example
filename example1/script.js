//多浏览器支持
navigator.getUserMedia= navigator.getUserMedia|| navigator.webkitGetUserMedia|| navigator.mozGetUserMedia|| navigator.msGetUserMedia;
//returns a URL object that provides static methods used for creating and managing object URLs.
window.URL= window.URL|| window.webkitURL|| window.mozURL|| window.msURL;

//检测浏览器是否支持getUserMedia
if (navigator.getUserMedia) {
  navigator.getUserMedia({
    video: true,
    audio: true
  }, onSuccess, onError);
} else {
  alert('getUserMedia is not supported in this browser.');
}

function onSuccess(stream) {
  //指定视频播放区域
  var video = document.getElementById('webcam');
  var videoSource;

  if (window.URL) {
    //创建一个新的对象URL,用来代表stream
    videoSource = window.URL.createObjectURL(stream);
  } else {
    videoSource = stream;
  }

  //视频自动播放
  video.autoplay = true;
  //指定视频流,不同浏览器下viedo的使用不同，chrome中使用createObjectURL的方法
  video.src = videoSource;
}

function onError() {
  alert('There has been a problem retrieving the streams - did you allow access?');
}
