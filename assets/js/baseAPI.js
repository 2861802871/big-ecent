// 每次$.get, $.post, $.ajax都会调用该函数
$.ajaxPrefilter(function (options) {
    //http://api-breakingnews-web.itheima.net
    console.log(options.url);
    // 统一拼接
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})