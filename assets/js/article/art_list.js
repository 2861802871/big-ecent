$(function () {
    var layer = layui.layer
    var form = layui.form
    // 分页
    var laypage = layui.laypage

    // 定义查询参数对象
    // 需要请求是将查询参数对象发送到服务器
    var q = {
        pagenum: 1,//默认请求第一页的值
        pagesize: 2,//默认每页显示两条数据
        cate_id: null,//文章分类的id
        state: null,//文章的发布状态
    }
    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date()

        var h = dt.getFullYear()
        var m = dt.getMonth() + 1
        m = padZero(m)
        var d = dt.getDate()
        d = padZero(d)

        var hh = dt.getHours()
        hh = padZero(hh)
        var mm = dt.getMinutes()
        mm = padZero(mm)
        var ss = dt.getSeconds()
        ss = padZero(ss)

        return h + '年' + m + '月' + d + '日' + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补0函数
    function padZero(n) {
        return n < 9 ? '0' + n : n
    }
    // 文章列表模拟数据：
    var data = {
        "status": 0,
        "message": "获取文章列表成功！",
        "data": [
            {
                "Id": 1,
                "title": "abab",
                "pub_date": "2020-01-03 12:19:57.690",
                "state": "已发布",
                "cate_name": "小冰的作品"
            },
            {
                "Id": 2,
                "title": "电饭煲",
                "pub_date": "2020-01-03 12:20:19.817",
                "state": "已发布",
                "cate_name": "股市"
            }, {
                "Id": 3,
                "title": "abab",
                "pub_date": "2020-01-03 12:19:57.690",
                "state": "已发布",
                "cate_name": "小冰"
            }, {
                "Id": 4,
                "title": "3456梵蒂冈",
                "pub_date": "2020-01-03 12:20:19.817",
                "state": "已发布签完",
                "cate_name": "股市"
            }, {
                "Id": 5,
                "title": "第三方达",
                "pub_date": "2020-01-03 12:20:19.817",
                "state": "已发布签完",
                "cate_name": "股市"
            },
        ],
        "total": 100
    }
    initTable();
    // 获取文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // res = data
                // 通过模板硬气渲染数据
                var htmlStr = template('tpl-table', res)
                $("tbody").html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }

        })
    }

    // 获取全部分类的数据
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类失败！")
                }
                var htmlStr = template('tpl-list', res)
                $('#cate_id').html(htmlStr)
                // 模板引擎已经渲染完毕为什么不显示？
                //原因layui的渲染机制问题，模板添加内容的时候没有被layui.js所监听到
                //解决方法调用layui表单的render方法重新渲染
                form.render()
            }
        })
    }
    // 将筛选的数据保存到q中
    $("#btn-form").on("click", function (e) {
        // 获取表单中选中的值
        var cat_id = $('[name=cate_id]').val()//定义模板时在value中存放了id
        var state = $('[name=state]').val()
        //为查询参数q对应的属性赋值
        q.cate_id = cat_id
        q.state = state
        initTable();
        console.log('ok');
    })
    // 定义分页的方法
    function renderPage(total) {
        // console.log(total);
        //调用laypage.render({})渲染分页
        laypage.render({
            elem: 'pageBox',//id前面不用加#
            count: total,//总数据条数
            limit: q.pagesize,//每页显示几条
            curr: q.pagenum,//当前要显示的页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//配置分页结构
            limits: [2, 3, 4, 5, 10, 20],//每页展示条目数选择数值
            // 分页切换的时候触发改函数
            jump: function (obj, first) {
                // //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数


                // 拿到页码值和每页的条目数给q重新赋值再发起请求
                q.pagenum = obj.curr
                q.pagesize = obj.limit

                // initTable()
                // 会出现死循环，原因触发了jump:点击页码或调用laypage.render()方法=>原因initTable()内部会调用laypage.render()方法，laypage.render()方法内部调用laypage.render()出现死循环；解决方法在if(!first){}'first'如果是调用laypage.render()触发first值将会变为true否则为undefined
                //首次不执行
                if (!first) {
                    //do something  
                    initTable()
                }
            }
        })
    }


    /*-----------------------------------------------------------*/
    // 实现删除文章的功能
    $("tbody").on('click', '.btn-delete', function () {

        // 1.获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len);
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            var id = $(this).attr("data-id")
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 删除完成后先判断这一页还有没有数据，如果没有则先将页码值 - 1 再重新渲染上一页的数据
                    //实现：点击删除的时候判断有几个删除按钮，当按钮个数为1时，删除完毕后页码值-1

                    if (len === 1) {//删除成功后此页面就没有数据了
                        // 页码值最小为1
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                    }
                    // 删除成功重新加载数据
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})