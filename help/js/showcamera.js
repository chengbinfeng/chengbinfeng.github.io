function language()
{
    var items = ["camera_title"];
    for(var key in items)
    {
        eval("$('#" + items[key] + "').html($.i18n.prop('" + items[key] + "'))");
    }

}

function showCameraPanel()
{
    var panel_html = "";
    panel_html += "<div class=\"camera_panel\">";
    panel_html += "<div class=\"camera_panel_title\"><p id='camera_title'></p></div>";
    panel_html += "</div>";
    panel_html += "<div class=\"cleaner\"></div>";

    $("#camera_frm").html(panel_html);
    getCameraList();
//    language();
}

var videoObject = {
    //playerID:'ckplayer01',//播放器ID，第一个字符不能是数字，用来在使用多个播放器时监听到的函数将在所有参数最后添加一个参数用来获取播放器的内容
    container: '#video', //容器的ID或className
    variable: 'player', //播放函数名称
    loaded: 'loadedHandler', //当播放器加载后执行的函数
    loop: false, //播放结束是否循环播放
    //autoplay: true, //是否自动播放
    //duration: 500, //设置视频总时间
    config: '', //指定配置函数
    debug: false, //是否开启调试模式
    //flashplayer: true, //强制使用flashplayer
    drag: 'start', //拖动的属性
    seek: 0, //默认跳转的时间
    //playbackrate:1,//默认速度的编号，只对html5有效,设置成-1则不显示倍速
    //advertisements:'website:ad.json',
    //front:'frontFun',//上一集的操作函数
    //next:'nextFun',//下一集的操作函数
    //mobileCkControls:true,//是否在移动端（包括ios）环境中显示控制栏
    live:true,//是否是直播视频，true=直播，false=点播
};
var player;
function loadedHandler() {
    player.addListener('error', errorHandler); //监听视频加载出错
    player.addListener('loadedmetadata', loadedMetaDataHandler); //监听元数据
    player.addListener('duration', durationHandler); //监听播放时间
    player.addListener('time', timeHandler); //监听播放时间
    player.addListener('play', playHandler); //监听暂停播放
    player.addListener('pause', pauseHandler); //监听暂停播放
    player.addListener('buffer', bufferHandler); //监听缓冲状态
    player.addListener('seek', seekHandler); //监听跳转播放完成
    player.addListener('seekTime', seekTimeHandler); //监听跳转播放完成
    player.addListener('volume', volumeChangeHandler); //监听音量改变
    player.addListener('full', fullHandler); //监听全屏/非全屏切换
    player.addListener('ended', endedHandler); //监听播放结束
    player.addListener('screenshot', screenshotHandler); //监听截图功能
    player.addListener('mouse', mouseHandler); //监听鼠标坐标
    player.addListener('frontAd', frontAdHandler); //监听前置广告的动作
    player.addListener('wheel', wheelHandler); //监听视频放大缩小
    player.addListener('controlBar', controlBarHandler); //监听控制栏显示隐藏事件
    player.addListener('clickEvent', clickEventHandler); //监听点击事件
    player.addListener('definitionChange', definitionChangeHandler); //监听清晰度切换事件
    player.addListener('speed', speedHandler); //监听加载速度
}
function errorHandler() {
    console.log('出错')
    changeText('.playerstate', '状态：视频加载错误，停止执行其它动作，等待其它操作');
}

function loadedMetaDataHandler() {
    var metaData = player.getMetaDate();
    //console.log(metaData)
    var html = ''
    //console.log(metaData);
    if(parseInt(metaData['videoWidth']) > 0) {
        changeText('.playerstate', '状态：获取到元数据信息，如果数据错误，可以使用延迟获取');
        html += '总时间：' + metaData['duration'] + '秒，';
        html += '音量：' + metaData['volume'] + '（范围0-1），';
        html += '播放器的宽度：' + metaData['width'] + 'px，';
        html += '播放器的高度：' + metaData['height'] + 'px，';
        html += '视频宽度：' + metaData['videoWidth'] + 'px，';
        html += '视频高度：' + metaData['videoHeight'] + 'px，';
        html += '视频原始宽度：' + metaData['streamWidth'] + 'px，';
        html += '视频原始高度：' + metaData['streamHeight'] + 'px，';
        html += '是否暂停状态：' + metaData['paused'];
    } else {
        changeText('.playerstate', '状态：未正确获取到元数据信息');
        html = '没有获取到元数据';
    }
    console.log(html);
    player.videoProportion();
}

function playHandler() {
    //player.animateResume();//继续播放所有弹幕
//        changeText('.playstate', getHtml('.playstate') + ' 播放');
    window.setTimeout(function() {
        loadedMetaDataHandler();
    }, 1000);
    loadedMetaDataHandler();
}

function pauseHandler() {
    //player.animatePause();//暂停所有弹幕
    loadedMetaDataHandler();
}

function timeHandler(time) {
}

function durationHandler(duration) {
}

function seekHandler(state) {
}

function seekTimeHandler(time) {
}

var screen_width;
var screen_height;

function bufferHandler(buffer) {
    //console.log(buffer);
    if(screen_width != null)
        player.videoProportion(screen_width, screen_height);
}

function volumeChangeHandler(vol) {
}
function speedHandler(n) {
}
function screenshotHandler(obj) {
}

function fullHandler(b) {
    if(b) {
        html = ' 全屏';
    } else {
        html = ' 否';
    }
}

function endedHandler() {
}

function mouseHandler(obj) {
//        changeText('.mouse', '鼠标位置，x：' + obj['x'] + '，y：' + obj['y']);
}

function frontAdHandler(status) {
}
var zoomNow = 1;

function wheelHandler(n) {
    if(n > 0) {
        if(zoomNow < 5) {
            zoomNow += 0.1;
        }
    } else {
        if(zoomNow > 0) {
            zoomNow -= 0.1;
        }
    }
    player.videoZoom(zoomNow);//支持鼠标滚轮控制放大缩小
}
function controlBarHandler(show){
    if(show) {
        html = ' 显示';
    } else {
        html = ' 隐藏';
    }
}
function clickEventHandler(eve){
//        changeText('.clickEvent', getHtml('.clickEvent') + ' '+eve);
}
function definitionChangeHandler(num){
}

var run = false;
var precamera;

function sendStopCameraMsg(onStoped)
{
    if(!run)
        return;
    run = false;

    var packJson = {"command":"rtmpCamera", "run":false};
    var params = "json=" + JSON.stringify(packJson);
    var sites_html = "";
    $.ajax({
        url:'getsitesinfo.php',
        type:'post',
        dataType:'json',
        data:params,
        success:function(getted){
            if(onStoped != null)
                onStoped();
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        }
    });
}

function onLeaveCameraPage() {
    player = null;
    precamera = null;
    sendStopCameraMsg();
}

function changeVideo(videoUrl) {
    if(player == null) {
        return;
    }

    var newVideoObject = {
        container: '#video', //容器的ID
        variable: 'player',
        autoplay: true, //是否自动播放
        loaded: 'loadedHandler', //当播放器加载后执行的函数
        video: videoUrl
    }
    //判断是需要重新加载播放器还是直接换新地址

    if(player.playerType == 'html5video') {
        if(player.getFileExt(videoUrl) == '.flv' || player.getFileExt(videoUrl) == '.m3u8' || player.getFileExt(videoUrl) == '.f4v' || videoUrl.substr(0, 4) == 'rtmp') {
            player.removeChild();

            player = null;
            player = new ckplayer();
            player.embed(newVideoObject);
        } else {
            player.newVideo(newVideoObject);
        }
    } else {
        if(player.getFileExt(videoUrl) == '.mp4' || player.getFileExt(videoUrl) == '.webm' || player.getFileExt(videoUrl) == '.ogg') {
            player = null;
            player = new ckplayer();
            player.embed(newVideoObject);
        } else {
            player.newVideo(newVideoObject);
        }
    }
}

function showCamera(id) {
    run = true;
    var packJson = {"command":"rtmpCamera", "run":run, "cameraid":id, "width":720, "height":576, "bitrate":1024*1024};
    var params = "json=" + JSON.stringify(packJson);
    var sites_html = "";
    $.ajax({
        url:'getsitesinfo.php',
        type:'post',
        dataType:'json',
        data:params,
        success:function(getted){
            if(run)
            {
                var response_str = getted.response;
                var response = jQuery.parseJSON(response_str);

                if(response && response["width"])
                {
                    screen_width = response["width"];
                    screen_height = response["height"];
                    player.videoProportion(screen_width, screen_height);
                }
                else
                {
                    player.videoPause();
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        }
    });

    if(player != null)
    {
        player.videoPlay();
        return;
    }

    player = new ckplayer(videoObject);
    var videoUrl = "rtmp://" + window.location.hostname + ":1935/live/camera";
    changeVideo(videoUrl);
}

function onSelectCamera(event){
    if(!this.classList)
        return;
    if(!this.classList.contains("camera_info"))
        return;

    var id = this.getAttribute("cameraid");
    if(precamera)
    {
        precamera.classList.remove("camera_active");
        if(precamera == this)
        {
            precamera = null;
            sendStopCameraMsg();
            player.videoPause();
            return;
        }
        else
        {
            sendStopCameraMsg(function()
            {
                player = null;
                showCamera(id);
            });
        }
    }
    else
    {
        showCamera(id);
    }

    this.classList.add("camera_active");
    precamera = this;
    
    event.stopPropagation();
};

function getNeedPopupHints(hint)
{
    var html = "<ul id=\"needpopupul\">";
    var pos = hint.split('\n');
    for(var one in pos)
        if(pos[one].length > 0)
            html += "<li>" + pos[one] + "</li>";
    html += "</ul>";
    return html;
}


function getCameraList() {
    var packJson = {"command":"camerainfo"};
    var params = "json=" + JSON.stringify(packJson);
    var sites_html = "";
    $.ajax({
        url:'getsitesinfo.php',
        type:'post',
        dataType:'json',
        data:params,
        success:function(getted){
            var response_str = getted.response;
            var response = jQuery.parseJSON(response_str);


            var html = "";
            var popup = response['popupability'];
            if(popup!= null)
            {
                html += "<div id=\"showappsetting\" class=\"camera_info\" >";
                html += getNeedPopupHints($.i18n.prop('needpopup'));
                html += "</div>";

                $("#camera_frm").html(html);
                $("#showappsetting").on("click", function(event)
                {
                    var packJson = {"command":"showappsetting"};
                    var params = "json=" + JSON.stringify(packJson);
                    var sites_html = "";
                    $.ajax({
                        url:'getsitesinfo.php',
                        type:'post',
                        dataType:'json',
                        data:params,
                        success:function(getted){
                                },
                        error:function(XMLHttpRequest, textStatus, errorThrown){
                        }
                        });
                });
            }
            else
            {
                var camera_info = response['camera_info'];
                var number = camera_info.length;
                for(var i = 0; i < number; i++)
                {
                    var item = camera_info[i];
    
                    html += "<div class=\"camera_info\" cameraid=" + item["id"] + ">";
                    html += "<img class=\"camera_icon\" src=\"/IMG/Icons/camera.png\" />";
    
                    if(item["facing"] == 0)
                        html += "<p class=\"camera_title\">" + $.i18n.prop('backcamera') + "</p>";
                    else
                        html += "<p class=\"camera_title\">" + $.i18n.prop('frontcamera') + "</p>";
    
                    html += "</div>";
                }
    
                html += "<div id=\"camera_rotate\" >";
                html += "<img class=\"rotate_icon\" src=\"./images/rotate.png\" />";
                html += "</div>";

                $("#camera_frm").html(html);

                var cameras = $('.camera_info'); 
                for(var index in cameras)
                {
                    var one = cameras[index];
                    if(one == null)
                        continue;
            
                    one.onclick = onSelectCamera;
                }
    
                $("#camera_rotate").on("click", function(event)
                {
                    if(player)
                        player.videoRotation(1);
                });
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        }
    });
}



function changeText(div, text) {
    player.getByElement(div).innerHTML = text;
}

function getHtml(div) {
    return player.getByElement(div).innerHTML;
}

var voice = true;
function mute(div) {
    if(!voice)
    {
        voice = true;
        player.videoEscMute();
    }
    else
    {
        voice = false;
        player.videoMute();
    }
    return player.getByElement(div).innerHTML;
}
