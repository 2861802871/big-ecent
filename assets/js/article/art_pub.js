$(function () {
    var layer = layui.layer
    var form = layui.form

    // 定义一个获取分类列表并渲染的方法
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败！')
                }
                var htmlStr = template('tpl-cate', res)
                // 添加渲染
                $('[name=cate_id]').html(htmlStr)
                // 动态添加无法被监听到，需重新渲染form.render()
                form.render()
            }
        })
    }
    // 图片裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为封面选择按钮绑定点击事件,打开隐藏的文件选择框
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    // 监听文件选择框的change事件
    $("#coverFile").on('change', function (e) {
        // 获取到文件的数组列表
        var files = e.target.files
        if (files.length < 1) {
            return layer.msg('图片选择失败请重新选择！')
        }

        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'
    // 为存为草稿绑定点击事件处理函数
    $("#btnSave2").on('click', function () {
        art_state = '草稿'
    })

    // 监听表单获取表单数据
    $("#form-pub").on('submit', function (e) {
        e.preventDefault()
        // 基于form表单创建new FormData()  
        var fd = new FormData($(this)[0])
        // 将发表状态追加到数据
        fd.append('state', art_state)


        // 获取图片剪裁文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将文件上的内容转换为对象
                // 将对象追加到fd
                fd.append('cover_img', blob)
                console.log(fd);
                // 发起请求提交数据
                publisArtcle(fd)
            })


    })
    //发布文章的方法
    function publisArtcle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //提交formData格式数据必须加一下两个属性
            contentType: false,
            processData: false,
            success: function (res) {
                layer.msg('发表文章成功！')
                if (res.status !== 0) {
                    return layer.msg('发表文章失败！')
                }
                layer.msg('发表文章成功！')
                location.href = '/article/art_pub.html'
            }
        })
    }
})

