$(function () {
    //隐藏错误提示框
    $('.add-error-info').css("display", "none");
    $('.edit-error-info').css("display", "none");

    $("#jqGrid").jqGrid({
        url: 'admin/user/list',
        datatype: "json",
        colModel: [
            {label: 'id', name: 'id', index: 'id', width: 50, hidden: true, key: true},
            {label: '登录名', name: 'nickname', index: 'nickname', sortable: false, width: 80},
            {label: '添加时间', name: 'createTime', index: 'createTime', sortable: false, width: 80}
        ],
        height: 485,
        rowNum: 10,
        rowList: [10, 30, 50],
        styleUI: 'Bootstrap',
        loadtext: '信息读取中...',
        rownumbers: true,
        rownumWidth: 35,
        autowidth: true,
        multiselect: true,
        pager: "#jqGridPager",
        loadBeforeSend:function(xhr){
            xhr.setRequestHeader('Oauth-Token', getCookie("Oauth-Token"));
        },
        jsonReader: {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames: {
            page: "pageNo",
            rows: "pageSize",
            order: "asc",
            sidx:"id"
        },
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });

    //importV1
    new AjaxUpload('#importV1Button', {
        action: 'users/importV1',
        name: 'file',
        autoSubmit: true,
        responseType: "json",
        onSubmit: function (file, extension) {
            if (!(extension && /^(xlsx)$/.test(extension.toLowerCase()))) {
                alert('只支持xlsx格式的文件！', {
                    icon: "error",
                });
                return false;
            }
        },
        onComplete: function (file, r) {
            if (r.code == 0) {
                alert("成功导入" + r.data + "条记录！");
                reload();
                return false;
            } else {
                alert(r.message);
            }
        }
    });

    //importV2
    new AjaxUpload('#uploadExcelV2', {
        action: 'upload/file',
        name: 'file',
        autoSubmit: true,
        responseType: "json",
        onSubmit: function (file, extension) {
            if (!(extension && /^(xlsx)$/.test(extension.toLowerCase()))) {
                alert('只支持xlsx格式的文件！', {
                    icon: "error",
                });
                return false;
            }
        },
        onComplete: function (file, r) {
            if (r.resultCode == 200) {
                console.log(r);
                $("#fileUrl").val(r.data);
                return false;
            } else {
                alert(r.message);
            }
        }
    });
});

function userAdd() {
    //点击添加按钮后执行操作
    var modal = new Custombox.modal({
        content: {
            effect: 'fadein',
            target: '#modalAdd'
        }
    });
    modal.open();
}

function userEdit() {
    var id = getSelectedRow();
    if (id == null) {
        return;
    }

    $('#userId').val(id);

    //点击编辑按钮后执行操作
    var modal = new Custombox.modal({
        content: {
            effect: 'fadein',
            target: '#modalEdit'
        }
    });
    modal.open();
}

//绑定modal上的保存按钮
$('#saveButton').click(function () {
    //验证数据
    if (validObjectForAdd()) {
        //一切正常后发送网络请求
        //ajax
        var account = $("#account").val();
        var password = $("#password").val();
        var email = $("#email").val();
        var phone = $("#phone").val();
        var nickname = $("#nickname").val();

        var data = {"account": account, "password": password, "email": email, "phone": phone, "nickname": nickname};
        $.ajax({
            type: 'POST',//方法类型
            dataType: "json",//预期服务器返回的数据类型
            url: '/admin/user/save',//url
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            beforeSend: function (request) {
                //设置header值
                request.setRequestHeader("Oauth-Token", getCookie("Oauth-Token"));
            },
            success: function (result) {
                console.log(result);//打印服务端返回的数据
                checkResultCode(result.code);
                if (result.code == 0) {
                    closeModal();
                    alert("保存成功");
                    //reload
                    reload();
                }
                else {
                    closeModal();
                    alert(result.message);
                }
                ;
            },
            error: function () {
                reset();
                alert("操作失败");
            }
        });

    }
});

//绑定modal上的编辑按钮
$('#editButton').click(function () {
    //验证数据
    if (validObjectForEdit()) {
        //一切正常后发送网络请求
        var password = $("#passwordEdit").val();
        var id = $("#userId").val();
        var data = {"id": id, "password": password};
        $.ajax({
            type: 'POST',//方法类型
            dataType: "json",//预期服务器返回的数据类型
            url: '/admin/user/updatePassword',//url
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            beforeSend: function (request) {
                //设置header值
                request.setRequestHeader("Oauth-Token", getCookie("Oauth-Token"));
            },
            success: function (result) {
                checkResultCode(result.code);
                console.log(result);//打印服务端返回的数据
                if (result.code == 0) {
                    closeModal();
                    alert("修改成功");
                    //reload
                    reload();
                }
                else {
                    closeModal();
                    alert(result.message);
                }
                ;
            },
            error: function () {
                reset();
                alert("操作失败");
            }
        });

    }
});

//绑定modal上的编辑按钮
$('#importV2Button').click(function () {
    var fileUrl = $("#fileUrl").val();
    $.ajax({
        type: 'POST',
        dataType: "json",
        url: '/admin/user/importV2?fileUrl=' + fileUrl,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            checkResultCode(result.code);
            console.log(result);
            if (result.code == 0) {
                closeModal();
                reload();
                alert("成功导入" + result.data + "条记录！");
            }
            else {
                closeModal();
                alert(result.message);
            }
            ;
        },
        error: function () {
            reset();
            alert("操作失败");
        }
    });
});

/**
 * 用户删除
 */
function userDel() {
    var ids = getSelectedRows();
    if (ids == null) {
        return;
    }
    $.ajax({
        type: "POST",
        url: "/admin/user/delete",
        contentType: "application/json",
        beforeSend: function (request) {
            //设置header值
            request.setRequestHeader("Oauth-Token", getCookie("Oauth-Token"));
        },
        data: JSON.stringify(ids),
        success: function (r) {
            checkResultCode(r.code);
            if (r.code == 0) {
                alert("删除成功");
                $("#jqGrid").trigger("reloadGrid");
            } else {
                alert(r.message);
            }
        }
    });
}

/**
 * 用户导入功能V1
 */
function importV1() {
    alert("importV1");
}

/**
 * 用户导入功能V2
 */
function importV2() {
    //点击编辑按钮后执行操作
    var modal = new Custombox.modal({
        content: {
            effect: 'fadein',
            target: '#importV2Modal'
        }
    });
    modal.open();
}




//添加Modal关闭
$('#cancelAdd').click(function () {
    closeModal();
})

//编辑Modal关闭
$('#cancelEdit').click(function () {
    closeModal();
})

//导入Modal关闭
$('#cancelImportV2').click(function () {
    closeModal();
})

/**
 * 数据验证
 */
function validObjectForAdd() {
    var account = $('#account').val();
    if (isNull(account)) {
        showErrorInfo("用户名不能为空!");
        return false;
    }
    if (!validUserName(account)) {
        showErrorInfo("请输入符合规范的用户名!");
        return false;
    }
    var password = $('#password').val();
    if (isNull(password)) {
        showErrorInfo("密码不能为空!");
        return false;
    }
    if (!validPassword(password)) {
        showErrorInfo("请输入符合规范的密码!");
        return false;
    }
    return true;
}

/**
 * 数据验证
 */
function validObjectForEdit() {
    var userId = $('#userId').val();
    if (isNull(userId) || userId < 1) {
        showErrorInfo("数据错误！");
        return false;
    }
    var password = $('#passwordEdit').val();
    if (isNull(password)) {
        showErrorInfo("密码不能为空!");
        return false;
    }
    if (!validPassword(password)) {
        showErrorInfo("请输入符合规范的密码!");
        return false;
    }
    return true;
}

/**
 * 关闭modal
 */
function closeModal() {
    //关闭前清空输入框数据
    reset();
    Custombox.modal.closeAll();
}

/**
 * 重置
 */
function reset() {
    //隐藏错误提示框
    $('.add-error-info').css("display", "none");
    $('.edit-error-info').css("display", "none");
    //清空数据
    $('#password').val('');
    $('#passwordEdit').val('');
    $('#userName').val('');
}

/**
 * jqGrid重新加载
 */
function reload() {
    reset();
    var page = $("#jqGrid").jqGrid('getGridParam', 'page');
    $("#jqGrid").jqGrid('setGridParam', {
        page: page
    }).trigger("reloadGrid");
}