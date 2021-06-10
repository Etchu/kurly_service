// join.js
$(function(){
	let id_check = false;
	let email_check = false;
	
	$("#dup_check").click(function(){
		$.ajax({
			url:"/member/id_check?id="+$("#user_id").val(),
			type:"get",
			success:function(result){
				if(result.status == "OK"){
					id_check = true;
				}
				alert(result.message);
			}
		});
	});
	$("#user_id").change(function(){
		id_check = false;
	});
	
	$("#email_dup_check").click(function(){
		$.ajax({
			url:"/member/email_check?email="+$("#user_email").val(),
			type:"get",
			success:function(result){
				if(result.status == "OK"){
					email_check = true;
				}
				alert(result.message);
			}
		});
	});
	$("#user_email").change(function(){
		email_check = false;
	});
	
	$("#join_btn").click(function(){
		//alert("회원가입");
		let id = $("#user_id").val();
		if(id.length == 0) {
			alert("아이디를 입력하세요")
			return;
		}
		if(!inputValidation(id)) {
			return;
		}
		if(!id_check) {
			alert("아이디 중복을 확인 해주세요");
			return;
		}
		
		let pwd = $("#user_pwd").val();
		
		if(pwd.length == 0) {
			alert("비밀번호를 입력하세요");
			return;
		}
		else if(pwd != $("#user_pwd_confirm").val()){
			alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
			return;
		}
		let name = $("#user_name").val();
		if(pattern_spc.test(name)){
			alert("이름에 특수문자를 사용할 수 없습니다.");
			return;
		}
		if(pattern_blank.test(name)){
			alert("이름에 공백문자를 사용할 수 없습니다.");
			return;
		}
		let email = $("#user_email").val();
		if(!pattern_email.test(email)) {
			alert("올바른 이메일을 입력하세요");
			return;
		}
		if(!email_check) {
			alert("이메일 중복을 확인 해주세요");
			return;
		}
		let year = $("#user_birth_year").val();
		let month = $("#user_birth_month").val();
		let date = $("#user_birth_date").val();
		if(!pattern_number.test(year) || !pattern_number.test(month) || !pattern_number.test(date)) {
			alert("올바른 생년월일을 입력하세요");
			return;
		}
		let birth = new Date(year+"-"+month+"-"+date);
		if(birth == "Invalid Date") {
			alert("올바른 생년월일을 입력하세요");
			return;
		}
		
		let receive_type = 0;
		
		if($("#info_receive_sms").prop("checked") && $("#info_receive_email").prop("checked")) {
			receive_type = 3;
		}
		if($("#info_receive_sms").prop("checked") && !$("#info_receive_email").prop("checked")) {
			receive_type = 1;
		}
		if(!$("#info_receive_sms").prop("checked") && $("#info_receive_email").prop("checked")) {
			receive_type = 2;
		}
		
		let data = {
		  "mkm_id": $("#user_id").val(),
		  "mkm_name": $("#user_name").val(),
		  "mkm_pwd": $("#user_pwd").val(),
		  "mkm_email": $("#user_email").val(),
		  "mkm_phone": "010-1234-5678",
		  "mkm_address": "대구광역시 중구 중앙대로 394 제일빌딩 4층 403호",
		  "mkm_gen": $(".user_gender:checked").val(),
		  "mkm_birth": $("#user_birth_year").val()+"-"+$("#user_birth_month").val()+"-"+$("#user_birth_date").val(),
		  "mkm_terms": $("#agree_terms").prop("checked")?1:0,
		  "mkm_collect_agree_mk": $("#agree_info_save1").prop("checked")?1:0,
		  "mkm_collect_agree_other": $("#agree_info_save2").prop("checked")?1:0,
		  "mkm_info_receive": $("#agree_info_receive").prop("checked")?1:0,
		  "mkm_info_receive_type": receive_type,
		  "mkm_age_confirm": $("#more_than_14").prop("checked")?1:0
		}
		
		console.log(JSON.stringify(data));
		$.ajax({
			url:"/member/join",
			type:"post",
			contentType:"application/json",
			data:JSON.stringify(data),
			success:function(result) {
				alert(result.message);
				location.href="/";
			},
			error:function(e) {
				alert("에러");
				console.log(e);
			}
		})
		
	})
	
	$("#agree_all").change(function(){
		if($("#agree_all").prop("checked")) {
			$("#agree_terms").prop("checked", true);
			$("#agree_info_save1").prop("checked", true);
			$("#agree_info_save2").prop("checked", true);
			$("#agree_info_receive").prop("checked", true);
			$("#info_receive_sms").prop("checked", true);
			$("#info_receive_email").prop("checked", true);
			$("#more_than_14").prop("checked", true);
		}
		else {
			$("#agree_terms").prop("checked", false);
			$("#agree_info_save1").prop("checked", false);
			$("#agree_info_save2").prop("checked", false);
			$("#agree_info_receive").prop("checked", false);
			$("#info_receive_sms").prop("checked", false);
			$("#info_receive_email").prop("checked", false);
			$("#more_than_14").prop("checked", false);
		}
	})
})


// final
// const - 상수 : 한 번 값이 지정되면 다음부터 바꿀 수 없음.
const pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
const pattern_spc = /[!@#$%^&*()_+|<>?:{}]/;
const pattern_blank = /[\s]/g;
const pattern_email = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
const pattern_number = /[0-9]/;
// 함수(메서드)
function inputValidation(text) {
	if(pattern_kor.test(text)){
		alert("아이디는 한글을 사용하실 수 없습니다.");
		return false;
	}
	if(pattern_spc.test(text)) {
		alert("아이디에 특수문자를 사용하실 수 없습니다.");
		return false;
	}
	if(pattern_blank.test(text)) {
		alert("아이디에 공백문자를 사용하실 수 없습니다.");
		return false;
	}
	return true;
	
	// return !pattern_kor.test(text) && !pattern_spc.test(text) && !pattern_blank.test(text);
}

















