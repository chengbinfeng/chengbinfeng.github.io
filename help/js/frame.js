var which;


function onLeavePage(which)
{
    if(which.getAttribute("id") == "menu_camera")
    {
        onLeaveCameraPage();
    }
    else if(which.getAttribute("id") == "menu_screen")
    {
        onLeaveScreenPage();
    }
}

function onCloseSite()
{
    var others = $("#menu")[0].children;
    for(var one in others)
    {
        if(others[one].classList)
        {
            if(others[one].classList.contains("active"))
            {
                onLeavePage(others[one]);
                break;
            }
        }
    }
}

function setHint(hint)
{
    var html = "";
    var pos = hint.split('\n');
    for(var one in pos)
        if(pos[one].length > 0)
            html += "<li>" + pos[one] + "</li>";
    $('#hint_detail').html(html);
}

function setup_menu() {
    var lis = $("#menu")[0].children;
    number = lis.length;

    for(var i = 0; i < number; i++)
    {
        var onOpen = function(event){
            var others = $("#menu")[0].children;
            for(var one in others)
            {
                if(others[one].classList)
                {
                    if(others[one].classList.contains("active"))
                    {
                        others[one].classList.remove("active");
                        onLeavePage(others[one]);
                    }
                }
                else
                    others[one].className = "";
            }

            if(this.classList)
                this.classList.add("active");
            else
                this.className = "active";

            if(which == this)
                return;
            which = this;
            
            if(this.getAttribute("id") == "menu_gallery")
                $('.right_side').load('images.html', function(){setHint($.i18n.prop('galleryhint'));getFoldersDataAndSetupMenu();});
            else if(this.getAttribute("id") == "menu_video")
                $('.right_side').load('video.html', function(){setHint($.i18n.prop('videohint'));showVideoPanel();});
            else if(this.getAttribute("id") == "menu_webs")
                $('.right_side').load('sites.html', function(){setHint($.i18n.prop('websitehint'));showSitesPanel();});
            else if(this.getAttribute("id") == "menu_camera")
                $('.right_side').load('camera.html', function(){setHint($.i18n.prop('camerahint'));showCameraPanel();});
                else if(this.getAttribute("id") == "menu_screen")
                $('.right_side').load('screen.html', function(){setHint($.i18n.prop('screenhint'));showScreenPanel();});
            else if(this.getAttribute("id") == "menu_manual")
                if((navigator.language || navigator.browserLanguage).toLowerCase() == 'zh-cn')
                    $('.right_side').load('help_cn.html', function(){setHint("");});
                else
                    $('.right_side').load('help_en.html', function(){setHint("");});
        };
        lis[i].onclick = onOpen;
    }

    var items = ["hint_title","menu_gallery", "menu_video", "menu_webs", "menu_manual", "menu_camera", "menu_screen"];
    for(var key in items)
    {
        eval("$('#" + items[key] + "').html($.i18n.prop('" + items[key] + "'))");
    }
    
    var packJson = {"command":"getMyInfo"};  
    var params = "json=" + JSON.stringify(packJson);
    $.ajax({
        url:'getsitesinfo.php',
        type:'post',
        dataType:'json',
        data:params,
        success:function(videos){
            var response_str = videos.response;
            var myinfo = jQuery.parseJSON(response_str).myinfo;
            var username = myinfo.username;
            var icon = myinfo.icon;
            var signature = myinfo.signature;
            
            $("#my_name").html(username);
            $("#my_hint").html(signature);
            document.getElementById("my_icon").src=icon; 
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            $("#my_hint").html(errorThrown);
        }
   });
}
