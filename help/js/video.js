function setupVideoList()
{
    var onOpen = function(event){
        if(this.className!="video_list_item")
            return;
        
        var width = this.attributes["video_width"].nodeValue;
        var height = this.attributes["video_height"].nodeValue;
        var duration = this.attributes["video_duration"].nodeValue;
        var url = this.attributes["video_src"].nodeValue;
        playvideo = "videoplayer.html?width=" + width + "&height=" + height + "&duration=" + duration + "&url=" + encodeURI(encodeURI(url));
        window.open(playvideo);
        event.stopPropagation();
    };

    var lists = $('.video_list_item'); 
    for(var index in lists)
    {
        var li = lists[index];
        if(li == null)
            continue;

        li.onclick = onOpen;
    }
}

function showVideoPanel()
{
    var folder_items = {};  // id ->> videos map;
    var folders = {};       // id ->> folder map

    var request = {"command":"getvideofolders"};
    var params = "json=" + JSON.stringify(request);

    $.ajax({
        url:'getsitesinfo.php',
        type:'post',
        dataType:'json',
        data:params,
        success:function(getted){
            var response = jQuery.parseJSON(getted.response)['folders'];
            var number = response.length;
            for(var i = 0; i < number; i++)
                folders[response[i]["folder_id"]] = response[i];
            
//            var params = "folder=0&id=-1&number=10000&next_or_pre=1";
            request = {"command":"getvideoData", "folder":0, "id":-1, "number":10000, "next_or_pre":1};
            params = "json=" + JSON.stringify(request);
            $.ajax({
                url:'getsitesinfo.php',
                type:'post',
                dataType:'json',
                data:params,
                success:function(getted){
                    var videos = jQuery.parseJSON(getted.response)['videos'];
                    var number = videos.length;
                    for(var i = 0; i < number; i++)
                    {
                        var items = folder_items[videos[i]["video_folder_id"]];
                        if(items == null)
                            items = [];
                        items.push(videos[i]);
                        folder_items[videos[i]["video_folder_id"]] = items;
                    }
                    
                    var video_html = "";
                    for(var key in folders)
                    {
                        var items = folder_items[key];
                        if(items == null)
                            continue;

                        var panel_html = "";
                        panel_html += "<div class=\"video_panel\">";
                        
                        panel_html += "<div class=\"video_panel_title\"><p>" + folders[key]["folder_name"] + "</p></div>";
                        
                        panel_html += "<ul class=\"video_list\">";
                        for(var j = 0; j < items.length; j++)
                        {
                            var imgurl;
                            if(items[j]["video_thum_www"] != null)
                                imgurl = items[j]["video_thum_www"];
                            else
                                imgurl = "/img/video.jpg";
                            panel_html += "<li class=\"video_list_item\" video_width=\"" + items[j]["video_width"] + "\" video_height=\"" + items[j]["video_height"] + "\" video_duration=\"" + items[j]["video_duration"] + "\" video_src=\"" + items[j]["video_www"] + "\"><img src=\"" + imgurl + "\" /><p>" + items[j]["video_name"] + "</p></li>";
                        }
                        panel_html += "</ul>";
                        panel_html += "</div>";
                        panel_html += "<div class=\"cleaner\"></div>";
                        
                        video_html += panel_html;
                    }
                    $("#video_frm").html(video_html);
                    setupVideoList();
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    $("#my_hint").html(textStatus);
                }
            });
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            $("#my_hint").html(textStatus);
        }
    });
}