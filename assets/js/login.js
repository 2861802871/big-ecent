$(function () {
    // 登录和注册页面切换
    $('#link_reg').on('click', function () {
        $('#reg_box').show()
        $('#login_box').hide()
    })
    $('#link_login').on('click', function () {
        $('#login_box').show()
        $('#reg_box').hide()
    })

    var form = layui.form
    var layer = layui.layer
    // 注册新用户
    // $('#form_reg [name=password]') form下名子是password的标签
    $('#btn_reg').on('click', function () {
        // 获取表单输入的数据
        var inputData = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', inputData, function (res) {

            layer.msg(res.message);
            if (res.status !== 0) {
                // return console.log('注册失败！');
            } else {
                // 注册成功模拟点击行为返回登录界面
                $('#link_login').click()
            }

        })
    })

    // 登录
    // 监听登录提交事件
    $('#btn_login').on('click', function (e) {
        // e.preventDefalut()
        console.log('监测到登录提交');
        var inputData = { username: $('#form_login [name=username]').val(), password: $('#form_login [name=password]').val() }
        console.log(inputData);
        $.post('/api/login', inputData, function (res) {

            // layer.msg(res.message);
            if (res.status !== 0) {
                layer.msg('登录失败！');
            } else {
                layer.msg('登录成功！')
                // 跳转到主页
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
                var token = res.token

                console.log(token);

            }

        })
    })
})