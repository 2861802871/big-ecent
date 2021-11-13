// 监听注册表单的提交操作
$('#btn_reg').on('click', function (e) {
    var userData = { id: 0, username: $('#set_name').val(), password: $('#set_password').val() }
    console.log(userData);
    regUser(userData);
    console.log(userList);
})
// 注册账号regUser并将数据添加到用户列表中
function regUser(data) {
    var flag = true
    $.each(userList.list, function (i, val) {
        if (val.username == data.username) {
            flag = false
            return console.log('该用户名已经被注册！');
        } else {
            console.log("未被占用");
        }
    })
    // 根据flag值判断是否添加注册用户
    if (flag == true) {
        $('#set_name')[0].value = ''
        $('#set_password')[0].value = ''
        $('#re_password')[0].value = ''
        data.id = userList.list.length + 1
        userList.list.push(data)
    } else {
        flag == true
        alert('该用户名已经被注册！');
    }

}
// 用户列表数据
var userList = {
    list: [{
        id: 1,
        username: 'xiaobin',
        password: '123456'
    },
    {
        id: 2,
        username: 'xiaoyi',
        password: '123456'
    }]
}
