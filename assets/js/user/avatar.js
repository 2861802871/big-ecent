$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 用点击按钮代替点击文件选择框
    $('#btnChooseImage').on('click', function (e) {
        $('#file').click()
    })
    // 文件选择框发生变化时
    var layer = layui.layer
    $('#file').on('change', function (e) {
        // 判断是否选择图片
        var filelist = e.target.files
        if (filelist.length == 0) {
            return layer.msg('请选择照片！')
        }
        // 拿到用户的文件，文件为伪数组的形式
        var file = filelist[0]
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 先 销毁 旧的裁剪区域，再 重新设置图片路径 ，之后再 创建新的裁剪区域 ：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 为确定按钮绑定点击按钮
    $('#btnUpload').on('click', function () {
        // 拿到用户裁剪过后的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL//base64 格式的字符串
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(dataURL);
                layer.msg(res.message)
                // 调用父页面中的方法更新用户信息
                window.parent.getUserInfo();
            }
        })
    })




})
