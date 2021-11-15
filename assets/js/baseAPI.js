// 每次$.get, $.post, $.ajax都会调用该函数
$.ajaxPrefilter(function (options) {
    //http://api-breakingnews-web.itheima.net
    // 统一拼接
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }
    options.complete = function (res) {
        // 获取服务器返回的数据res.responseJSON.status
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})