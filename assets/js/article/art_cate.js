$(function () {
    // 获取文章分类列表
    initArtCatelist();
    function initArtCatelist() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
            }
        })
    }

})