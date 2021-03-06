### [navigator](http://www.w3school.com.cn/htmldom/dom_obj_navigator.asp)
Navigator 对象包含有关浏览器的信息。

### getUserMedia

为了初始化我们的流媒体，我们需要做三件事:

* 1.检查浏览器是否支持我们正在尝试使用的函数
* 2.指定我们将使用的流媒体
* 3.提供两个回调函数: 分别针对失败和成功的情况

我们使用JavaScript API函数 getUserMedia() 访问摄像头和麦克风这两个流媒体

```
getUserMedia(streams, success, error);
```
该函数带有三个参数:

* streams is an object with true/false values for the streams we would like to include(选项对象)
* success is the function to call if we can get these streams(成功的回调函数)
* error is the function to call if we are unable to get these streams(失败的回调函数)

### Video Stream
* Get our video element from the DOM.
* Set video to autoplay.
* Set the video source to our stream.

### [window](http://www.w3school.com.cn/htmldom/dom_obj_window.asp)
Window 对象表示浏览器中打开的窗口。

### [window.URL.createObjectURL](https://developer.mozilla.org/zh-CN/docs/DOM/window.URL.createObjectURL)
[window.URL](https://developer.mozilla.org/en-US/docs/Web/API/Window.URL)属性返回一个URL对象，该对象用来提供一组用于创建和管理URLs的静态方法。

createObjectURL创建一个新的对象URL,该对象URL可以代表某一个指定的File对象或Blob对象(二进制大对象).
```
objectURL = window.URL.createObjectURL(blob);
```

### Audio Stream
* Create an Audio Context.
* Create our Media Stream Source.
* Connect our Media Stream Source to our Audio Context.

### [audioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)
The AudioContext interface represents an audio-processing graph built from audio modules linked together, each represented by an AudioNode.

**AudioContext.createMediaStreamSource()**

Creates an MediaStreamAudioSourceNode associated with a WebRTC MediaStream representing an audio stream, that may come from the local computer microphone or other sources.

**AudioContext.destination**
Returns an AudioDestinationNode representing the final destination of all audio in the context. It often represents an actual audio-rendering device.

### Capturing images(截屏)
* Retrieve our canvas element from the DOM.
* Get the canvas drawing context.
* Make our canvas the same width and height as the video feed.
* Draw the current video image to our canvas.

### Canvas stream
* Convert our video stream to a canvas feed.
* Grab the imageData from our canvas.
* Loop through our imageData array and manipulate pixels.
* Output to a display canvas.

### Description
```
cd example1
python -m SimpleHTTPServer
```

### References
* http://www.netmagazine.com/tutorials/get-started-webrtc
* http://mozilla.com.cn/post/45435/
