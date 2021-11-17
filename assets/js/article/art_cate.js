$(function () {
    var layer = layui.layer
    var form = layui.form
    // 获取文章分类列表
    initArtCatelist();
    function initArtCatelist() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
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
    $('body').on('submit', '#form-add', function (e) {
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
            title: '修改类别',
            content: $('#dialog-edit').html()
        })
        // 通过模板字符给编辑按钮新建属性data - Id存放数据id，在点击编辑按钮时获取属性data-id的值存放在id中
        var id = $(this).attr('data-id')
        console.log(id);
        // 发请求获取对应Id的数据
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res);
                // res.data = {
                //     id: 1, name: '123', alisa: '456'
                // }
                form.val('form-edit', res.data)
            }
        })

        // 监听编辑表单的提交事件，同样委托给body
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault()
            $.ajax({
                method: "POST",
                url: '/my/article/updatecate',
                data: $('#form-edit').serialize(),
                // $(this).serialize()无法获取表单值/
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('修改分类失败！')
                    }
                    // 更新分类
                    initArtCatelist();
                    layer.msg('修改分类成功！')
                    // 关闭弹出层
                    layer.close(indexEdit)
                }
            })
        })
    })

    // 删除操作动态创建的标签用事件委托，委托给不是动态创建的元素
    $("body").on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 发起删除请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    // 更新分类
                    initArtCatelist();
                    layer.msg('删除分类成功！')
                }
            })
            // 关闭弹出层
            layer.close(index);
        });
    })




})