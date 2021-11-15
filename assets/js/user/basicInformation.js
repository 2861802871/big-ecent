$(function () {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称必须在 1-6个字符之间'
            }
        },
    })
    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                // 调用form.vai('给哪个表单赋值','要赋的值')快速为表单赋值
                form.val('forUserInfo', res.data)
            },
        })
    }
    initUserInfo();

    // 重置表单
    $('#btnRest').on('click', function (e) {
        console.log(123);
        initUserInfo();
    })

    // 监听表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 数据为表单数据
            data: $(this).serialize(),

            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！')
                initUserInfo();
                // 在子页面中调用父页面的方法
                // 然而发生了错误 so.....手动刷新[机智][机智]

                //解决了！！！！！！
                //父页的getUserinfo是否在window作用域下，而不是放到了其他函数内部变成私有函数，这样子页面是无法访问父页getuserinfo方法的，要放到window作用域下
                //解决方法将index.js中getUserinfo方法写到jQuery入口函数的外面，入口偶函数里面调用正常，window.parent调用也正常
                window.parent.getUserInfo()

            }
        })
    })
})