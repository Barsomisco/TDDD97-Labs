displayView = function(){
    // the code required to display a view
    document.getElementById("show welcomeview").innerHTML = document.getElementById("welcomeview").innerHTML;
};

window.onload = function(){
    displayView();
};

logInValidation = function(){
    var password = document.forms["logInForm"]["logInPass"].value;
    if (password.length < 7){
        alert("Password should be at least 7 characters long");
        return false;
    }
};

signUpValidation = function(){
    var password = document.forms["signUpForm"]["signUpPass"].value;
    if (password.length < 7){
        alert("Password should be at least 7 characters long");
        return false;
    }
    var repeatedPassword = document.forms["signUpForm"]["repeatPass"].value;
    if (repeatedPassword != password) {
        alert("Passwords do not match");
        return false;
    }
};


