
var next_style = "opacity: 1;border-radius: 8px;padding: 8px 4px 8px;background: white;margin: 32px 4px 32px 0px;float: right;";
var next_style_disable = next_style + "visibility: hidden;";
var pre_style = "opacity: 1;border-radius: 8px;padding: 8px 4px 8px;background: white;margin: 32px 8px 32px 4px;float: left;display: inline-block;";
var pre_style_disable = pre_style + "visibility: hidden;";

var pre_folder_id;
var pre_begin_image_id;
var pre_end_image_id;
var pre_number;

function initial_gallary(images, imageid, next_or_pre, isEnd) {
    var number = images.length;
    var camera_text = "";
    var i;
    for (i = 0; i < number; i++)
    {
        camera_text += "<div data-thumb=\"http://" + window.location.host + images[i]["img_thum_www"]+ "\" data-src=\"http://" + window.location.host + images[i]["img_www"] + "\" ></div>";
    }
    $("#camera_wrap").html(camera_text);

        var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;

            items = parseThumbnailElements(galleryElement);
            thrumb_images = items;

            // define options (if needed)
            options = {

                galleryUID: galleryElement.getAttribute('data-pswp-uid'),

                getThumbBoundsFn: function(index) {
                    // See Options->getThumbBoundsFn section of docs for more info
                    var thumbnail = items[index].el.children[0],
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect(); 

                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                },

                addCaptionHTMLFn: function(item, captionEl, isFake) {
                    if(!item.title) {
                        captionEl.children[0].innerText = '';
                        return false;
                    }
                    captionEl.children[0].innerHTML = item.title +  '<br/>';
                    return true;
                },

            };


            if(fromURL) {
                if(options.galleryPIDs) {
                    // parse real index when custom PIDs are used 
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for(var j = 0; j < items.length; j++) {
                        if(items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }

            // exit if index not found
            if( isNaN(options.index) ) {
                return;
            }

            var radios = document.getElementsByName('gallery-style');
            for (var i = 0, length = radios.length; i < length; i++) {
                if (radios[i].checked) {
                    if(radios[i].id == 'radio-all-controls') {

                    } else if(radios[i].id == 'radio-minimal-black') {
                        options.mainClass = 'pswp--minimal--dark';
                        options.barsSize = {top:0,bottom:0};
                        options.captionEl = false;
                        options.fullscreenEl = false;
                        options.shareEl = false;
                        options.bgOpacity = 0.85;
                        options.tapToClose = true;
                        options.tapToToggleControls = false;
                    }
                    break;
                }
            }

            if(disableAnimation) {
                options.showAnimationDuration = 0;
            }

            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

            // see: http://photoswipe.com/documentation/responsive-images.html
            var realViewportWidth,
                useLargeImages = false,
                firstResize = true,
                imageSrcWillChange;

            gallery.listen('beforeResize', function() {

                var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
                dpiRatio = Math.min(dpiRatio, 2.5);
                realViewportWidth = gallery.viewportSize.x * dpiRatio;


                if(realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200 ) {
                    if(!useLargeImages) {
                        useLargeImages = true;
                        imageSrcWillChange = true;
                    }

                } else {
                    if(useLargeImages) {
                        useLargeImages = false;
                        imageSrcWillChange = true;
                    }
                }

                if(imageSrcWillChange && !firstResize) {
                    gallery.invalidateCurrItems();
                }

                if(firstResize) {
                    firstResize = false;
                }

                imageSrcWillChange = false;

            });

            gallery.listen('gettingData', function(index, item) {
                if( useLargeImages ) {
                    item.src = item.o.src;
                    item.w = item.o.w;
                    item.h = item.o.h;
                } else {
                    item.src = item.m.src;
                    item.w = item.m.w;
                    item.h = item.m.h;
                }
            });

            gallery.init();
        };

    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            items = [],
            el,
            item;

        for(var i = 0; i < number; i++)
        {
            el = thumbElements[i];

            // include only element nodes 
            if(el.nodeType !== 1) {
              continue;
            }

            item = {
                src: images[i]["img_www"],
                w: images[i]["img_width"],
                h: images[i]["img_height"],
                el: thumbElements[i],
                msrc: images[i]["img_thum_www"],
                title: images[i]["img_name"]
            };
            item.o = {
                src: item.src,
                w: item.w,
                h: item.h
            };

            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    var onThumbnailsClick = function(e) {

        var clickedGallery = $(".camera_thumbs_cont")[0].children[0].children[1];
        var childNodes = clickedGallery.childNodes,
            numChildNodes = childNodes.length,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            var list = childNodes[i].classList;
            for(var j = 0; j < list.length; j++)
            {
                if(list[j] == "cameracurrent") {
                    index = i;
                    i = numChildNodes;
                    break;
                }
            }
        }

        if(index >= 0) {
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) { // pid=1
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var initPhotoSwipeForCamera = function() {

        var thrumb_images = [];

        var x = document.getElementsByClassName("camera_thumbs_cont");
        var ul = x[0].firstChild.firstChild;
        var galleryElements = ul.childNodes;

        for(var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i+1);
        }

    };

    jQuery('#camera_wrap').camera({
        height: '700px',
        loader: 'bar',
        pagination: false,
        thumbnails: true,
        transPeriod: 500,
        portrait: true,
        autoAdvance: false,
        playPause: false,
        pauseOnClick: false,
        time: 3000,
        onEndTransition: function() {
            var click_func = function(){
                onThumbnailsClick($("li.cameracurrent"));	
            };

            var big = $("div.cameraContent.cameracurrent");
            if(big.get("settedonclick"))
                ;
            else {
                big.attr("settedonclick", true);
                for(var i = 0, l = big.length; i < l; i++) {
                    big[i].onclick = click_func;
                }
            }

            var x = document.getElementsByClassName("imgLoaded");
            for(var i = 0, l = x.length; i < l; i++) {
                var big = x[i]; 
                if(big.getAttribute("settedonclick"))
                    ;
                else {
                    big.setAttribute("settedonclick", true);
                    big.onclick = click_func;
                }
            }

            if($(".camera_thumbs_cont")[0])
                $(".camera_thumbs_cont")[0].children[0].children[1].style.margin=0;
        }
    });

    initPhotoSwipeForCamera();
    var thrumbs_div = $(".camera_thumbs_cont")[0].children[0];

    var nextimg = document.createElement('img');
    var preimg = document.createElement('img');
    if((navigator.language || navigator.browserLanguage).toLowerCase() == 'zh-cn')
    {
        nextimg.src ="images/next2.png";
        preimg.src ="images/pre2.png";
    }
    else
    {
        nextimg.src ="images/next2_en.png";
        preimg.src ="images/pre2_en.png";
    }
    nextimg.className = "thrumb_page_pre_next";
    thrumbs_div.appendChild(nextimg);

    preimg.className = "thrumb_page_pre_next";
    thrumbs_div.insertBefore(preimg, thrumbs_div.firstChild);
    
    if(next_or_pre)
    {
        if(imageid >= 0)
        {
            preimg.setAttribute("style", pre_style);
        }
        else
        {
            preimg.setAttribute("style", pre_style_disable);
            nextimg.setAttribute("style", next_style);
        }
            
        if(isEnd == 1)
        {
            nextimg.setAttribute("style", next_style_disable);
        }
        else
        {
            nextimg.setAttribute("style", next_style);
        }
    }
    else
    {
        nextimg.setAttribute("style", next_style);
        if(isEnd == 1)
        {
            preimg.setAttribute("style", pre_style_disable);
        }
        else
        {
            preimg.setAttribute("style", pre_style);
        }
    }
}

function getImagesDataAndSetupGallary(folder, imageid, number, next_or_pre)
{
    pre_folder_id = folder;
    pre_number = number;
    var request = {"command":"getImagesData", "folder_id":folder, "image_id":imageid, "next_or_pre":next_or_pre, "number":number};
    var params = "json=" + JSON.stringify(request);
    
    $.ajax({
        url:'getimagedata.php',
        type:'post',
        dataType:'json',
        data:params,
        success:function(response){
            var images = response['images'];
            if(!next_or_pre)
                images.reverse();
            
            var isEnd = response['is_end'];
            
            var number = images.length;
            pre_end_image_id = images[number - 1]["img_id"];
            pre_begin_image_id = images[0]["img_id"];

            $("#camera_wrap").html('');
            initial_gallary(images, imageid, next_or_pre, isEnd);

            var nextbutton = $(".camera_thumbs_cont")[0].children[0].children[2];
            var prebutton = $(".camera_thumbs_cont")[0].children[0].children[0];
            
            var onNext = function(){
                getImagesDataAndSetupGallary(pre_folder_id, pre_end_image_id, pre_number, 1);
            };
            var onPre = function(){
                getImagesDataAndSetupGallary(pre_folder_id, pre_begin_image_id, pre_number, 0);
            };
            nextbutton.onclick = onNext;
            prebutton.onclick = onPre;

            var thrumbs = $(".camera_thumbs_cont")[0].children[0].children[1]
            thrumbs.style.display="inline";
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            $("#my_hint").html(textStatus);
        }
    });

}

function getFoldersDataAndSetupMenu()
{
    var params = "";
    var request = {"command":"getimagefolders"};
    var params = "json=" + JSON.stringify(request);

    $.ajax({
//        url:'getimagefolders.php',
        url:'getsitesinfo.php',
        type:'post',
        dataType:'json',
        data:params,
        success:function(getted){
            var response = jQuery.parseJSON(getted.response);
            var folders = response['folders'];

            var number = folders.length;
            var menuhtml = "";
            var cameraid;
            for(var i = 0; i < number; i++)
            {
                if(folders[i]["img_name"] == "Camera")
                {
                    menuhtml += "<li class=\"active\" folder_id=" + folders[i]["img_folder_id"] + "><span id='img_photo'></span></li>"
                    cameraid = parseInt(folders[i]["img_folder_id"]);
                    folders.splice(i, 1);
                    break;
                }
            }

            menuhtml += "<li folder_id=" + "0" + "><span id='img_all'></span></li>"
            for(var i = 0; i < number && i < 4; i++)
            {
                try
                {
                    var foldername = $.i18n.prop(folders[i]["img_name"]);
                    menuhtml += "<li folder_id=" + folders[i]["img_folder_id"] + "><span>" + foldername + "</span></li>"
                }
                catch(e)
                {
                    menuhtml += "<li folder_id=" + folders[i]["img_folder_id"] + "><span>" + folders[i]["img_name"] + "</span></li>"
                }
            }
            $("#picture_folder_menu").html(menuhtml);
            getImagesDataAndSetupGallary(cameraid, -1, 10, 1);
            
            var lis = $("#picture_folder_menu")[0].children;
            number = lis.length;
            
            for(var i = 0; i < number; i++)
            {
                var onOpen = function(event){
                    var others = $("#picture_folder_menu")[0].children;
                    for(var one in others)
                        {
                            if(others[one].classList && others[one].classList.contains("active"))
                                others[one].classList.remove("active");
                        }
                    this.classList.add("active");
                    var id = parseInt(this.attributes["folder_id"].nodeValue);
                    getImagesDataAndSetupGallary(id, -1, 10, 1);
                };
                lis[i].onclick = onOpen;
            }

            var items = ["img_photo", "img_all"];
            for(var key in items)
            {
                eval("$('#" + items[key] + "').html($.i18n.prop('" + items[key] + "'))");
            }
        
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            $("#my_hint").html(textStatus);
        }
    });

}


