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

### [window.URL.createObjectURL](https://developer.mozilla.org/zh-CN/docs/DOM/window.URL.createObjectURL)
创建一个新的对象URL,该对象URL可以代表某一个指定的File对象或Blob对象.
```
objectURL = window.URL.createObjectURL(blob);
```

### Description
```
cd example1
python -m SimpleHTTPServer
```

### References
* http://www.netmagazine.com/tutorials/get-started-webrtc
* http://mozilla.com.cn/post/45435/
