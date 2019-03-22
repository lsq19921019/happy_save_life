window.onload = function () {
    var html = document.getElementsByTagName('html')[0];
    var deviceWidth = html.getBoundingClientRect().width;
    html.style.fontSize = deviceWidth / 12 + 'px';
//        var style = document.createElement('style');
//        style.innerHTML = 'html{font-size:' + deviceWidth / 12 + 'px;}';
//        document.head.appendChild(style);
};
window.onresize = function () {
    var html = document.getElementsByTagName('html')[0];
    var deviceWidth = html.getBoundingClientRect().width;
    var style = document.createElement('style');
    html.style.fontSize = deviceWidth / 12 + 'px';
}

/**
 * 移动设备上的浏览器默认会在用户点击屏幕大约延迟300毫秒后才会触发点击事件
 * 这是为了检查用户是否在做双击。为了能够立即响应用户的点击事件，才有了FastClick。
 */
$(function() {
    FastClick.attach(document.body);
});

/**
 * 获取url中 ? 后面的参数
 * @returns {Object}
 */
function getUrlParam() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function getBasePath() {
    // 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    // 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    // 获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    // 获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName
        .substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
}

/**
 * 请求路径
 * @returns {string}
 */
function ajaxhttp() {
    // return 'http://192.168.1.129:8100/kooun-pulutong-user'
    return 'http://pulutong.h5.infotoo.cn/kooun-pulutong-user'
}
function uploadUrl() {
    // return 'http://192.168.1.129:8095/kooun-file/file/pic/upload.wx'
    return 'http://pulutong.up.infotoo.cn/kooun-file/file/pic/upload.wx'
    // return 'http://pulutong.up.infotoo.cn/kooun-top_man-admin/file/video/upload'
}
/**
 * ajax 请求
 * @param param
 * @returns {Promise}
 */
 function setOpenId(openid) {
     // localStorage.setItem('openId', openid);
     localStorage.openId = openid;
 }

 function getOpenId() {
     return localStorage.getItem('openId');
 }
var storage=window.localStorage;
function getUserKey(key) {
    storage.userkey=key;
}
var ajaxRequest = function(param){
    var http = ajaxhttp();
    return new Promise(function (resolve, reject) {
        $.ajax({
            type : 'post',
            url: http + param.url,
            data: param.data || '',
            async: false,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'X-Requested-With': 'XMLHttprequest',
                'userkey': storage.userkey
            },
            success : function(res) {
                if(res.status == 'success') {
                    //请求成功的数据处理
                    resolve(res);
                } else if(res.status == 401) {
                    $.confirm(res.message, function() {
                        location.href = "../loginIndex/login.html";
                    }, function() {
                        //点击取消后的回调函数
                    });
                }else if(res.status == 'error') {
                    var isFunction = typeof (reject);
                    if(isFunction) {
                        reject(res);
                    } else {
                        $.alert("系统繁忙，请稍后重试", "提示");
                    }
                }
            },
            error : function(error) {
                $.alert("系统繁忙,请稍后重试error", "提示");
            },
        });
    })
};


Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


