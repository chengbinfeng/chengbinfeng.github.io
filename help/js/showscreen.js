function showScreenPanel()
{
    var panel_html = "";
    panel_html += "<div class=\"screen_panel\">";
    panel_html += "<div class=\"screen_panel_title\"><p id='screen_title'></p></div>";
    panel_html += "</div>";
    panel_html += "<div class=\"cleaner\"></div>";

    $("#screen_frm").html(panel_html);
    showScreenBtn();
}

var screenObject = {
    //playerID:'ckplayer01',//播放器ID，第一个字符不能是数字，用来在使用多个播放器时监听到的函数将在所有参数最后添加一个参数用来获取播放器的内容
    container: '#screen', //容器的ID或className
    variable: 'screen_player', //播放函数名称
    loaded: 'screenloadedHandler', //当播放器加载后执行的函数
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

var screen_player;
function screenloadedHandler() {
    screen_player.addListener('error', errorHandler); //监听视频加载出错
    screen_player.addListener('loadedmetadata', loadedMetaDataHandler); //监听元数据
    screen_player.addListener('duration', durationHandler); //监听播放时间
    screen_player.addListener('time', timeHandler); //监听播放时间
    screen_player.addListener('play', playHandler); //监听暂停播放
    screen_player.addListener('pause', pauseHandler); //监听暂停播放
    screen_player.addListener('buffer', bufferHandler); //监听缓冲状态
    screen_player.addListener('seek', seekHandler); //监听跳转播放完成
    screen_player.addListener('seekTime', seekTimeHandler); //监听跳转播放完成
    screen_player.addListener('volume', volumeChangeHandler); //监听音量改变
    screen_player.addListener('full', fullHandler); //监听全屏/非全屏切换
    screen_player.addListener('ended', endedHandler); //监听播放结束
    screen_player.addListener('screenshot', screenshotHandler); //监听截图功能
    screen_player.addListener('mouse', mouseHandler); //监听鼠标坐标
    screen_player.addListener('frontAd', frontAdHandler); //监听前置广告的动作
    screen_player.addListener('wheel', wheelHandler); //监听视频放大缩小
    screen_player.addListener('controlBar', controlBarHandler); //监听控制栏显示隐藏事件
    screen_player.addListener('clickEvent', clickEventHandler); //监听点击事件
    screen_player.addListener('definitionChange', definitionChangeHandler); //监听清晰度切换事件
    screen_player.addListener('speed', speedHandler); //监听加载速度
}
function errorHandler() {
    console.log('出错')
    changeText('.playerstate', '状态：视频加载错误，停止执行其它动作，等待其它操作');
}

var screen_width;
var screen_height;

var rotate = false;

function loadedMetaDataHandler() {
    var metaData = player.getMetaDate();
    //console.log(metaData)
    var html = ''
    //console.log(metaData);
    if(parseInt(metaData['videoWidth']) > 0) {
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
        html = '没有获取到元数据';
    }
    console.log(html);

    if(screen_width != null)
        screen_player.videoProportion(screen_width, screen_height);
}

function playHandler() {
    console.log("play");
}

function pauseHandler() {
    console.log("pause");
}

function timeHandler(time) {
}

function durationHandler(duration) {
    console.log("duration");
}

function seekHandler(state) {
}

function seekTimeHandler(time) {
}

function bufferHandler(buffer) {
    if(screen_width != null)
        screen_player.videoProportion(screen_width, screen_height);
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
//    console.log('鼠标位置，x：' + obj['x'] + '，y：' + obj['y']);
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
    screen_player.videoZoom(zoomNow);//支持鼠标滚轮控制放大缩小
}
function controlBarHandler(show){
    if(show) {
        html = ' 显示';
    } else {
        html = ' 隐藏';
    }
}
function clickEventHandler(eve){
    console.log("click");
}
function definitionChangeHandler(num){
    console.log("click");
}

var run = false;
function sendStopScreenMsg()
{
    if(!run)
        return;
    run = false;

    var packJson = {"command":"rtmpScreen", "run":false};
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
}

function onLeaveScreenPage() {
    screen_player = null;
    sendStopScreenMsg();
}

function playScreen(videoUrl) {
    if(screen_player == null) {
        return;
    }

    var newscreenObject = {
        container: '#screen', //容器的ID
        variable: 'screen_player',
        autoplay: true, //是否自动播放
        loaded: 'screenloadedHandler', //当播放器加载后执行的函数
        video: videoUrl
    }
    //判断是需要重新加载播放器还是直接换新地址

    if(screen_player.playerType == 'html5video') {
        if(screen_player.getFileExt(videoUrl) == '.flv' || screen_player.getFileExt(videoUrl) == '.m3u8' || screen_player.getFileExt(videoUrl) == '.f4v' || videoUrl.substr(0, 4) == 'rtmp') {
            screen_player.removeChild();

            screen_player = null;
            screen_player = new ckplayer();
            screen_player.embed(newscreenObject);
        } else {
            screen_player.newVideo(newscreenObject);
        }
    } else {
        if(screen_player.getFileExt(videoUrl) == '.mp4' || screen_player.getFileExt(videoUrl) == '.webm' || screen_player.getFileExt(videoUrl) == '.ogg') {
            screen_player = null;
            screen_player = new ckplayer();
            screen_player.embed(newscreenObject);
        } else {
            screen_player.newVideo(newscreenObject);
        }
    }
}

function showScreen() {
    run = !run;
    var packJson = {"command":"rtmpScreen", "run":run};
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
                    screen_player.videoProportion(screen_width, screen_height);
                }
                else
                {
                    screen_player.videoPause();
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        }
    });

    if(run)
    {
        if(screen_player != null)
        {
            screen_player.videoPlay();
            return;
        }

        screen_player = new ckplayer(screenObject);
        var videoUrl = "rtmp://" + window.location.hostname + ":1935/live/screen";
        playScreen(videoUrl);
    }
    else
    {
        if(screen_player != null)
        {
            screen_player.videoPause();
            return;
        }
    } 
}

function onClickOnScreenBtn(event){
    if(!this.classList)
        return;

    if(!this.classList.contains("screen_info"))
        return;

    showScreen();

    if(run)
    {
        this.classList.add("camera_active");
        $('#screen_text').html($.i18n.prop('stopshow'));
    }
    else
    {
        this.classList.remove("camera_active");
        $('#screen_text').html($.i18n.prop('showscreen'));
    }
    
    event.stopPropagation();
};


function showScreenBtn() {
    var html = "";
    html += "<div class=\"camera_info screen_info\" id=\"screen_show\" >";
    html += "<img class=\"camera_icon\" src=\"./images/screen.png\" />";
    html += "<p class=\"camera_title\" id=\"screen_text\">" + $.i18n.prop('showscreen') + "</p>";
    html += "</div>";
/*
    html += "<div id=\"screen_rotate\" class=\"camera_info\" >";
    html += "<img class=\"rotate_icon\" src=\"./images/rotate.png\" />";
    html += "</div>";
*/
    $("#screen_frm").html(html);

    $("#screen_show").on("click", onClickOnScreenBtn);
/*    
    $("#screen_rotate").on("click", function(event)
    {
        if(screen_player)
        {
            screen_player.videoRotation(1);
            rotate = !rotate;
            if(screen_width != null)
            {
                if(rotate)
                    screen_player.videoProportion(screen_height, screen_width);
                else
                    screen_player.videoProportion(screen_width, screen_height);
            }
        }

    });

    */
}
