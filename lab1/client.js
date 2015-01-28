displayView = function(){
    if (localStorage.getItem("token") !== null) {
        document.getElementById("view").innerHTML = document.getElementById("profileview").innerHTML;
        selected(document.getElementById("home"));
    }
    else {
        document.getElementById("view").innerHTML = document.getElementById("welcomeview").innerHTML;
    }
};

window.onload = function(){
    displayView();
};

logInValidation = function(signInForm) {
    var result = serverstub.signIn(signInForm.signinemail.value, signInForm.signinpassword.value);
    signinmessage.innerHTML = result.message;
    if (result.success) {
        localStorage.token = result.data;
        document.getElementById("view").innerHTML = document.getElementById("profileview").innerHTML;
        return true;
    }
    else {
        return false;
    } 
};

checkRequiredPassword = function() {
    var password = document.getElementById("password").value;
    var repeatedPassword = document.getElementById("repeatpassword").value;
    var message = document.getElementById("message");
    if (password.length < 7) {
        message.innerHTML = "Password is to short";
        return false;
    }
    if (password != repeatedPassword) {
        message.innerHTML = "Passwords does not match";
        return false;
    }
    else {
        message.innerHTML = "";
        return false;
    }
};

checkPassword = function() {
    var password = document.getElementById("password").value;
    var message = document.getElementById("message");
    if (password.length < 7){
        message.innerHTML = "Password is to short";
        return false;
    } 
    else if(!checkRequiredPassword()) {
        return false;
    } 
    else {
        message.innerHTML = "";
        return false;
    }
};

signUpValidation = function(formData){
    var password = formData.password.value;
    if (password.length < 7){
        return false;
    }
    var repeatedPassword = formData.repeatpassword.value;
    if (repeatedPassword != password) {
        return false;
    }

    var regData = {
        "firstname": formData.firstname.value,
        "familyname": formData.familyname.value,
        "gender": formData.gender.value,
        "city": formData.city.value,
        "country": formData.country.value,
        "email": formData.email.value,
        "password": formData.password.value        
    };

    var message = document.getElementById("message");
    var m = serverstub.signUp(regData);
    message.innerHTML = m.message;
    if (m.success){
        serverstub.signIn(formData.email.value, formData.password.value);
        localStorage.token = result.data;
        document.getElementById("view").innerHTML = document.getElementById("profileview").innerHTML;
        return true;
    }
    return false;
};

selected = function(item) {
    item.style.backgroundColor = "#999999";

    for (var i = 0; i<item.parentNode.childNodes.length; ++i) {
        if (item.parentNode.childNodes[i].nodeType == Node.ELEMENT_NODE && item.parentNode.childNodes[i].innerHTML != item.innerHTML)
            item.parentNode.childNodes[i].style.backgroundColor = "gray";
    }

    if (item.innerHTML == "Home") {
        document.getElementById("homeview").style.display = "block";
        document.getElementById("browseview").style.display = "none";
        document.getElementById("accountview").style.display = "none";
    }
    else if (item.innerHTML == "Browse") {
        document.getElementById("homeview").style.display = "none";
        document.getElementById("browseview").style.display = "block";
        document.getElementById("accountview").style.display = "none";
    }
    else {
        document.getElementById("homeview").style.display = "none";
        document.getElementById("browseview").style.display = "none";
        document.getElementById("accountview").style.display = "block";
    }
};
