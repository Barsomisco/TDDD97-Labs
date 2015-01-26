displayView = function(){
    // the code required to display a view
    document.getElementById("showwelcomeview").innerHTML = document.getElementById("welcomeview").innerHTML;
};

window.onload = function(){
    displayView();
};

logInValidation = function(){
    var password = document.forms.logInForm.logInPass.value;
    if (password.length < 7){
        alert("Password should be at least 7 characters long");
        return false;
    }
};

checkPassword = function() {
    var password = document.getElementById("password").value;
    var repeatedPassword = document.getElementById("repeatpassword").value;
    var message = document.getElementById("message");
    if (password != repeatedPassword) {
        message.style.color = "#ff6666";
        message.innerHTML = "Passwords does not match";
        return false;
    }
    else {
        message.style.color = "#66cc66";
        message.innerHTML = "";
        return false;
    }
};

signUpValidation = function(formData){
    var password = formData.password.value;
    if (password.length < 7){
        alert("Password should be at least 7 characters long");
        return false;
    }
    var repeatedPassword = formData.repeatpassword.value;
        if (repeatedPassword != password) {
            
    //    alert("Passwords do not match");
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

      var m = serverstub.signUp(regData);
      alert(m.message);
};


