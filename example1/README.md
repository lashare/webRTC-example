### getUserMedia

为了初始化我们的流媒体，我们需要做三件事:

* 1.检查浏览器是否支持我们正在尝试使用的函数
* 2.指定我们将使用的流媒体
* 3.提供两个回调函数: 分别针对失败和成功的情况

We access the webcam and microphone streams using the JavaScript API getUserMedia(), which takes the following parameters:
我们使用JavaScript API函数 getUserMedia() 访问摄像头和麦克风这两个流媒体

```
getUserMedia(streams, success, error);
```
该函数带有三个参数:

* streams is an object with true/false values for the streams we would like to include
* success is the function to call if we can get these streams
* error is the function to call if we are unable to get these streams

### Description
```sh
cd example1
python -m SimpleHTTPServer
```

### References
http://www.netmagazine.com/tutorials/get-started-webrtc
