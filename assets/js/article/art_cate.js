$(function () {
    var layer = layui.layer
    // 获取文章分类列表
    initArtCatelist();
    function initArtCatelist() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('.layui-table').html(htmlStr)
            }
        })
    }
    // 绑定添加类别按钮的事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        // layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 若你采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '251px'],
            title: '添加类别'
            , content: $('#dialog-add').html()
        })
    })

    // 监听分类表单提交事件,用body来代理，原因form-add在开始阶段变得没有添加到页面
    $('body').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            // $(this).serialize()无法获取表单值/
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCatelist();
                layer.msg('新增分类成功！')
                layer.close(indexAdd)
            }
        })
    })
    //----------------------------------------------------
    // 修改文章分类
    // 通过代理的形式给编辑按钮绑定事件,代理权给body
    var indexEdit = null
    $("body").on('click', '.btn-edit', function () {
        // 弹层对类别修改
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '251px'],
            title: '修改类别'
            , content: $('#dialog-edit').html()
        })
    })


})