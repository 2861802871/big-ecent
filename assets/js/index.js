$(function () {
    var layer = layui.layer

    // 获取用户基本信息
    getUserInfo();
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // 请求头配置对象,携带身份验证信息,已统一在$.ajaxPrefilter中设置
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                // 用户头像渲染
                rendAvatar(res.data);
            },
            // 无论成功失败
            complete: function (res) {
                // 获取服务器返回的数据res.responseJSON.status

                if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                    localStorage.removeItem('token')
                    location.href = '/login.html'
                }
            }

        })
    }
    function rendAvatar(user) {
        // 获取用户名
        var uname = user.nickname || user.username
        $('#welcom').html('欢迎&nbsp&nbsp' + uname)
        // 按需渲染用户头像
        if (user.user_pic !== null) {
            // 图片头像
            $('.layui-nav-img').attr('src', user.user_pic).show()
            $('.text-avatar').hide()
        } else {
            // 文字头像uname[0]
            var first = uname.slice(0, 1).toUpperCase()
            $('.layui-nav-img').hide()
            $('.text-avatar').html(first).show()
        }
    }

    // 退出功能
    $('#btnLogout').on('click', function () {
        // 提示用户是否退出，并清除身份验证信息localStorage
        layer.confirm('&nbsp&nbsp确定退出登录', { icon: 3, title: '提示' }, function (index) {
            // 清除身份验证信息
            localStorage.removeItem('token')
            // 跳转到登录页面
            location.href = '/login.html'
            // 自带关闭弹出层
            layer.close(index)
        });
    })
})