function setupOpenSitesAction()
{
    var onOpen = function(event){
        if(this.className!="sites_list_item")
            return;
        
        var url = this.attributes["site_url"].nodeValue;
        window.open(url);
        event.stopPropagation();
    };

    var lists = $('.sites_list_item'); 
    for(var index in lists)
    {
        var li = lists[index];
        if(li == null)
            continue;

        li.onclick = onOpen;
    }

}

function setupOpenOfficialSiteAction()
{
    var onClick = function(event){
        if(!this.className)
            return;
        if(this.className.indexOf("official_site") == -1)
            return;
        
        var url = this.attributes["site_url"].nodeValue;
        if(url!="undefined")
        {
            window.open(url);
            event.stopPropagation();
        }
    };

    var lists = $('.official_site'); 
    for(var index in lists)
    {
        var li = lists[index];
        if(li == null)
            continue;

        li.onclick = onClick;
    }

}

var install_param;
function getInstallParam()
{
    return install_param;
}


function setupInstallAction()
{
    var pre;
    var onClickBtn = function(event){
        if(this.className!="install_button")
            return;
        var id = this.getAttribute("_name_id");
        var title = $.i18n.prop('site_install') + " " + this.getAttribute("sitename"); 

        var packJson = {"command":"getSiteInstallNeeds", "_name_id":id};
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
                install_param = response;

                layer.open({
                  type: 2,
                  title: title,
                  shadeClose: false,
                  skin: "layui-layer-molv",
                  shade: [0.8, '#393D49'],
                  maxmin: false, //开启最大化最小化按钮
                  area: ['520px', '248px'],
                  content: './install.html',
                    success: function (layero, index) {
//                        setupInstallFrm(layero, response);
                    }
            });
                
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
            }
        });
    
        event.stopPropagation();
    };

    var install_button = document.createElement("input");
    install_button.type = "button";
    install_button.value = $.i18n.prop('site_install');
    install_button.className = "install_button";
    install_button.onclick = onClickBtn;
    
    var onSelect = function(event){
        if(this.className!="default_info_item")
            return;
        if(pre)
        {
            pre.style.backgroundColor = "lightgray";
            pre.removeChild(install_button);
        }
        this.style.backgroundColor = "#DB5673";
        this.appendChild(install_button)    
        pre = this;
        install_button.setAttribute("_name_id", this.getAttribute("_name_id"));
        install_button.setAttribute("sitename", this.getAttribute("sitename"));
        
        event.stopPropagation();
    };

    lists = $('.default_info_item'); 
    for(var index in lists)
    {
        var li = lists[index];
        if(li == null)
            continue;

        li.onclick = onSelect;
    }
}

function setupSitesAction()
{
    setupOpenSitesAction();
    setupOpenOfficialSiteAction();
    setupInstallAction();
    
}

function showMySitesPanel(sitesinfo)
{
    var panel_html = "";
    panel_html += "<div class=\"sites_panel\">";
    panel_html += "<div class=\"video_panel_title\"><p id='my_sites'></p></div>";
    panel_html += "<ul class=\"sites_list\">";
    for(var site in sitesinfo)
    {
        var sitename = sitesinfo[site].sitename;
        var url = sitesinfo[site].url;
        var icon = sitesinfo[site].icon;
        var signature = sitesinfo[site].signature;

        panel_html += "<li class=\"sites_list_item\" site_url=\"" + url + "\"><img src=\"" + icon + "\" /><div class=\"text_block\" align=\"left\"><p class=\"title_text\">" + sitename + "</p><p>" + signature + "</p></div></li>";
    }
    panel_html += "</ul>";
    panel_html += "</div>";
    panel_html += "<div class=\"cleaner\"></div>";

    return panel_html;
}

function showInstallPanel(sitesinfo)
{
    var panel_html = "";
    panel_html += "<div class=\"default_info_panel\">";
    panel_html += "<div class=\"video_panel_title\"><p id='install_new_site'></p></div>";
    panel_html += "<ul class=\"default_info_list\">";
    for(var site in sitesinfo)
    {
        var sitename = sitesinfo[site]._name;
        var sitename_id = sitesinfo[site]._name_id;
        var type = sitesinfo[site].type;
        var _icon_name = sitesinfo[site]._icon_name;
        var _description = sitesinfo[site]._description;
        var official_site = sitesinfo[site].official_site;

        panel_html += "<li class=\"default_info_item\" sitename=\"" + sitename + "\" _name_id =" + sitename_id + ">";
        panel_html += "<div class=\"default_info_title\" align=\"left\"><img src=\"" + _icon_name + "\" class=\"official_site\" site_url=\"" + official_site + "\"/><p class=\"default_title official_site\" site_url=\"" + official_site + "\">" + sitename + "</p><p class=\"default_type\">" + type + "</p></div>";
        panel_html += "<textarea class=\"auto_scroll\" readonly>" + _description + "</textarea></li>";
    }
    panel_html += "</ul>";
    panel_html += "</div>";
    panel_html += "<div class=\"cleaner\"></div>";

    return panel_html;    
}

function showSitesPanel()
{
    var packJson = {"command":"getSitesInfo"};  
    var params = "json=" + JSON.stringify(packJson);
    var sites_html = "";
    $.ajax({
        url:'getsitesinfo.php',
        type:'post',
        dataType:'json',
        data:params,
        success:function(getted){
            var response_str = getted.response;
            var sitesinfo = jQuery.parseJSON(response_str).sitesinfo;

            sites_html += showMySitesPanel(sitesinfo);
            
            packJson = {"command":"getDefaultPHPInfo"};  
            params = "json=" + JSON.stringify(packJson);
            $.ajax({
                url:'getsitesinfo.php',
                type:'post',
                dataType:'json',
                data:params,
                success:function(getted){
                    if(getted.response)
                    {
                        var response_str = getted.response;
                        var sitesinfo = jQuery.parseJSON(response_str).infos;
    
                        sites_html += showInstallPanel(sitesinfo);
                    }
                        
                    $("#sites_frm").html(sites_html);
                    setupSitesAction();

                    var items = ["my_sites"];
                    for(var key in items)
                    {
                        eval("$('#" + items[key] + "').html($.i18n.prop('" + items[key] + "'))");
                    }

                    if(getted.response)
                    {
                        items = ["install_new_site"];
                        for(var key in items)
                        {
                            eval("$('#" + items[key] + "').html($.i18n.prop('" + items[key] + "'))");
                        }
                    }
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