// write a small JavaScript shim, so that we can reference each browser implementation using navigator.getUserMedia.
navigator.getUserMedia ||
  (navigator.getUserMedia = navigator.mozGetUserMedia ||
  navigator.webkitGetUserMedia || navigator.msGetUserMedia);

//检测浏览器是否支持getUserMedia
if (navigator.getUserMedia) {
  navigator.getUserMedia({
    video: true,
    audio: true
  }, onSuccess, onError);
} else {
  alert('getUserMedia is not supported in this browser.');
}

function onSuccess() {
  alert('Successful!');
}

function onError() {
  alert('There has been a problem retrieving the streams - did you allow access?');
}
