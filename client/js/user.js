var user = function() {
	initButtons = function(){
		network.getCurrentUserInfo(function(res) {
			if (res.status == 1000)
			{
				$("#loginButton").css("display", "none");
				if (res.is_mobile_phone_user == "0")
				{
					$("#changePasswordButton").css("display", "");
				}
				$("#logoutButton").css("display", "");
				$("#payVipButton").css("display", "");
				$("#registerButton").css("display", "none");
				$("#usernameSpanText").text(res.user_name);
				$("#usernameSpan").css("display", "");
			}
		});
		
		// For login function.
		$("#loginButton").click(function() {
			$("#loginMethodModal").modal();
		});
		$("#defaultLoginButton").click(function() {
			$("#loginMethodModal").modal("hide");
			// Init login modal.
			$("#loginUsername").val("");
			$("#loginPassword").val("");
			
			$("#loginModal").modal();
		});
		$("#phoneLoginButton").click(function() {
			$("#loginMethodModal").modal("hide");
			// Init login modal.
			$("#loginPhoneNumber").val("");
			$("#loginIdentifyingCode").val("");
			
			$("#phoneLoginModal").modal();
			$("#phoneLoginGetCodeButton").css("display", "")
		});
		$("#phoneLoginGetCodeButton").click(function() {
			$("#phoneLoginGetCodeButton").attr("disabled", "disabled");
			logic.doPhoneGetCode($("#loginPhoneNumber").val(), function(err, res) {
				$("#phoneLoginGetCodeButton").removeAttr("disabled");
				$("#phoneLoginGetCodeButton").css("display", "none")
				if (err != undefined) {
					alert("获取失败： " + err);
					return;
				}
				else {
					alert("已发送，请注意查收。");
					return;
				}
			});
		});
		$("#phoneLoginConfirmButton").click(function() {
			$("#phoneLoginConfirmButton").attr("disabled", "disabled");
			
			// Call logic login interface.
			logic.doPhoneLogin($("#loginPhoneNumber").val(), $("#loginIdentifyingCode").val(), function(err, res) {
				$("#phoneLoginConfirmButton").removeAttr("disabled");
				
				if (err != undefined) {
					alert("登录失败： " + err);
					$("#loginIdentifyingCode").val("");
					return;
				}
				
				// Login ok
				$("#phoneLoginModal").modal("hide");
				$("#loginButton").css("display", "none");
				$("#logoutButton").css("display", "");
				$("#payVipButton").css("display", "");
				$("#registerButton").css("display", "none");
				$("#usernameSpanText").text(res.username);
				$("#usernameSpan").css("display", "");
				ui.start();
			});
		});
		$("#loginSubmitButton").click(function() {
			$("#loginSubmitButton").attr("disabled", "disabled");
			
			// Call logic login interface.
			logic.doLogin($("#loginUsername").val(), $("#loginPassword").val(), function(err, res) {
				$("#loginSubmitButton").removeAttr("disabled");
				
				if (err != undefined) {
					alert("登录失败： " + err);
					$("#loginPassword").val("");
					return;
				}
				
				// Login ok
				$("#loginModal").modal("hide");
				$("#loginButton").css("display", "none");
				$("#changePasswordButton").css("display", "");
				$("#logoutButton").css("display", "");
				$("#payVipButton").css("display", "");
				$("#registerButton").css("display", "none");
				$("#usernameSpanText").text(res.username);
				$("#usernameSpan").css("display", "");
				ui.start();
			});
		});
		
		// For logout function.
		$("#logoutButton").click(function() {
			$("#logoutButton").attr("disabled", "disabled");
			
			// Call logic logout interface.
			logic.doLogout(function(err, res) {
				$("#logoutButton").removeAttr("disabled");
				
				if (err != undefined) {
					alert("登出失败： " + err);
					return;
				}
				
				// Logout ok
				$("#logoutButton").css("display", "none");
				$("#payVipButton").css("display", "none");
				$("#changePasswordButton").css("display", "none");
				$("#loginButton").css("display", "");
				$("#registerButton").css("display", "");
				$("#usernameSpanText").text("");
				$("#usernameSpan").css("display", "none");
				ui.start();
			});
		});
		
		// For register function.
		$("#registerButton").click(function() {
			// Init register modal.
			$("#registerUsername").val("");
			$("#registerEmail").val("");
			$("#registerPassword").val("");
			$("#registerPassword2").val("");
			
			$("#registerModal").modal();
		});
		$("#registerSubmitButton").click(function() {
			$("#registerSubmitButton").attr("disabled", "disabled");
			
			// Call logic register interface.
			logic.doRegister($("#registerUsername").val(), $("#registerEmail").val(), $("#registerPassword").val(), $("#registerPassword2").val(), function(err, res) {
				$("#registerSubmitButton").removeAttr("disabled");
				
				if (err != undefined) {
					alert("注册失败： " + err);
					$("#registerPassword").val("");
					$("#registerPassword2").val("");
					return;
				}
				
				// Register ok
				alert("注册成功！");
				$("#registerModal").modal("hide");
			});
		});
		
		// For change password function.
		$("#changePasswordButton").click(function() {
			// Init changePassword modal.
			$("#changePasswordUsername").text($("#usernameSpanText").text());
			$("#changePasswordNewPassword").val("");
			$("#changePasswordNewPassword2").val("");
			
			$("#changePasswordModal").modal();
		});
		$("#changePasswordSubmitButton").click(function() {
			$("#changePasswordSubmitButton").attr("disabled", "disabled");
			
			// Call logic changePassword interface.
			logic.doChangePassword($("#changePasswordNewPassword").val(), $("#changePasswordNewPassword2").val(), function(err, res) {
				$("#changePasswordSubmitButton").removeAttr("disabled");
				
				if (err != undefined) {
					alert("修改失败： " + err);
					$("#changePasswordNewPassword").val("");
					$("#changePasswordNewPassword2").val("");
					return;
				}
				
				// Change password ok
				alert("修改成功！");
				$("#changePasswordModal").modal("hide");
			});
		});

		$("#payVipButton").click(function() {
			$("#payVipModal").modal();
		});

		$("#payVipSubmitButton1").click(function() {
			$("#payVipSubmitButton1").attr("disabled", "disabled");
			
			logic.doPayVip(function(err, res) {
				$("#payVipSubmitButton1").removeAttr("disabled");
				
				if (err != undefined) {
					alert("付费失败： " + err);
					return;
				}
				alert("付费成功！");
				$("#payVipModal").modal("hide");
				ui.start();
			});
		});
		$("#payVipSubmitButton2").click(function() {
			$("#payVipSubmitButton2").attr("disabled", "disabled");
			
			logic.doPayVip(function(err, res) {
				$("#payVipSubmitButton2").removeAttr("disabled");
				
				if (err != undefined) {
					alert("付费失败： " + err);
					return;
				}
				alert("付费成功！");
				$("#payVipModal").modal("hide");
				ui.start();
			});
		});
		$("#payVipSubmitButton").click(function() {
			$("#payVipSubmitButton").attr("disabled", "disabled");
			
			logic.doPayVip(function(err, res) {
				$("#payVipSubmitButton").removeAttr("disabled");
				
				if (err != undefined) {
					alert("付费失败： " + err);
					return;
				}
				alert("付费成功！");
				$("#payVipModal").modal("hide");
				ui.start();
			});
		});


		$("#newLevelButton").click(function() {
			// Init login modal.
			// $("#newLevelContent").val(logic.getUserContent);
			// $("#newLevelModal").modal();
			window.location.href = "creator.html";
		});
		$("#returnMainButton").click(function() {
			// Init login modal.
			// $("#newLevelContent").val(logic.getUserContent);
			// $("#newLevelModal").modal();
			window.location.href = "codechef.html";
		});
	};

	return {
		initButtons: initButtons
	};
}();
