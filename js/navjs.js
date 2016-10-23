/**
 * Created by 王亚龙 on 2016/10/8.
 */
$(function() {
	/*当为移动端设备时，将登录、注册导航居中*/
	function removeClassName() {
		var width = $(window).innerWidth();
		if(width < 768) {
			$("header nav .pull-right").removeClass("pull-right");
		}
	}
	$(window).on("resize", function() {
		removeClassName();
	}).trigger("resize");
	$("#user,#login_out").hide();
	/*判断cookie是否存在封装*/
	function cookie() {
		if($.cookie("user")) {
			$("#user,#login_out").show();
			$("#login_in,#register").hide();
			/*显示目前登录人*/
			$("#user a").html($.cookie("user"));
		} else {
			$("#user,#login_out").hide();
			$("#login_in,#register").show();
		}
	};
	/*判断cookie是否存在结束*/
	cookie();
	$("#login_out").click(function() {
		$.removeCookie("user");
		cookie();
		$(".comment-detial").hide();/*退出评论区隐藏*/
	})
	/*注册模块*/
	$("#form_reg").validate({
		submitHandler: function(form) {
			$(form).ajaxSubmit({
				url: "add.php",
				type: "POST",
				beforeSubmit: function() {
					$("#reg button").attr("disabled", true);
					alert("数据交互中，请稍微等候");
				},
				success: function(responseText, statusText) {
					if(responseText) {
						alert("注册成功")
						$("#reg button").removeAttr("disabled")
						/*生成user cookie*/
						$.cookie("user", $("#reg_user").val());

						$("#form_reg").resetForm();
						setTimeout(function() {
							$("#reg").modal('hide');
							cookie();
						}, 500)
					}
				}
			})
		},
		rules: {
			reg_user: {
				required: true,
				minlength: 3,
				maxlength: 15,
				remote: {
					url: "is_user.php",
					type: "POST",
				}
			},
			reg_password: {
				required: true,
				minlength: 8,

			},
			reg_password_again: {
				required: true,
				equalTo: "#reg_password"
			},
			email: {
				required: true,
				email: true,
			}
		},
		messages: {
			reg_user: {
				required: "账号不得为空",
				minlength: "账号不得少于3位",
				maxlength: "账号不得多于15位",
				remote: "账号被占用"
			},
			reg_password: {
				required: "密码不得为空",
				minlength: "密码长度不得少于8位",
			},
			reg_password_again: {
				required: "确认密码不得为空",
				equalTo: "两次密码不一致"
			},
			email: {
				required: "邮箱不得为空",
				email: "邮箱格式不正确",
			}
		}
	});
	/*注册模块结束*/
	/*登录模块*/
	$("#form_login").validate({
		submitHandler: function(form) {
			$(form).ajaxSubmit({
				url: "login.php",
				type: "POST",
				beforeSubmit: function() {
					alert("数据交互中，请稍微等候");
					$("#login button").attr("disabled", true);
					
				},
				success: function(responseText, statusText) {
//					console.log(responseText)
					if(responseText) {
						$("#login button").removeAttr("disabled");
						if($('#checkbox').is(':checked')){
							$.cookie('user', $('#login_user').val(),{ expires:30, }); 
						}
						else{ 
							$.cookie('user', $('#login_user').val()); 
						}

						alert("登录完成");
						cookie();
						$("#form_login").resetForm();
						setTimeout(function(){
							$("#login").modal('hide');
							
						},500)
					}
				}
			})
		},
		rules: {
			login_user: {
				required: true,
				minlength: 3
			},
			login_password: {
				required: true,
				minlength: 8,
				remote: {
					url: "login.php",
					type: "POST",
					data: {
						login_user: function(){
							return $("#login_user").val();
						},
					}
				}

			}
		},
		messages:{
			login_user: {
				required: "账户名不得为空",
				minlength: "账户名不得少于3位"
			},
			login_password: {
				required: "密码不得为空",
				minlength: "密码不得少于8位",
				remote: "用户名或者密码不正确！"
			}
			
		}
	})
	/*登录模块结束*/
})