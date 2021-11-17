$(function () {
    var layer = layui.layer
    var form = layui.form
    initPwd()
    function initPwd() {
        $('#btn_pwd').on('click', function () {
            // 获取表单数据
            var data = $('#form_pwd').serialize()
            // 验证两次密码输入是否一样
            if ($('.btn_pwd1').val() !== $('.btn_pwd2').val()) {
                return layer.msg('两次密码输入不一致！')
            }
            // 验证通过发起请求修改密码
            $.ajax({
                method: "POST",
                url: '/my/updatepwd',
                data: data,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('修改密码失败！')
                    }
                    layer.msg('修改密码成功！')
                }
            })
        })
    }

})