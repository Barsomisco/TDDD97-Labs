var tab;
var lastsearched;
xmlhttp = new XMLHttpRequest();

displayView = function() {
    if (localStorage.getItem("token") !== null) {
        document.getElementById("view").innerHTML = document.getElementById("profileview").innerHTML;
        selected(document.getElementById("home"));
    } else {
        document.getElementById("view").innerHTML = document.getElementById("welcomeview").innerHTML;
    }
};

window.onload = function() {
    displayView();
};

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
        data = xmlhttp.responseText;
        console.log(data);
    }
};

logInValidation = function(signInForm) {
    xmlhttp.open("POST", "/signin", true);
    var params = "email="+signInForm.signinemail.value+"&password="+signInForm.signinpassword.value;
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
  //  var result = serverstub.signIn(signInForm.signinemail.value, signInForm.signinpassword.value);
  //  signinmessage.innerHTML = result.message;
  //  if (result.success) {
   //     localStorage.token = result.data;
  //      document.getElementById("view").innerHTML = document.getElementById("profileview").innerHTML;
  //      selected(document.getElementById("home"));
 //       return true;
 //   } else {
 //       return false;
 //   }
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
    } else {
        message.innerHTML = "";
        return false;
    }
};

postText = function() {
    var recipient;
    var text;
    var result;
    if (tab == "Browse") {
        text = document.getElementsByName("posttextarea");
        text = text[1].value;
        recipient = lastsearched;
        result = serverstub.postMessage(localStorage.getItem("token"), text, recipient);
        document.getElementsByName("posttextarea")[1].value = "";
        searchUser();
        return result.success;
    }
    else {
        text = document.getElementsByName("posttextarea");
        text = text[0].value;
        recipient = serverstub.getUserDataByToken(localStorage.getItem("token")).data.email;
        result = serverstub.postMessage(localStorage.getItem("token"), text, recipient);
        updateMessages(recipient);
        document.getElementsByName("posttextarea")[0].value = "";
        return result.success;
    }
};

checkPassword = function() {
    var password = document.getElementById("password").value;
    var message = document.getElementById("message");
    if (password.length < 7) {
        message.innerHTML = "Password is to short";
        return false;
    } else if (!checkRequiredPassword()) {
        return false;
    } else {
        message.innerHTML = "";
        return false;
    }
};

checkNewPassword = function(newpassword) {
    var password = newpassword.value;
    var message = document.getElementById("newpassmessage");
    if (password.length < 7) {
        message.innerHTML = "Password is to short";
        return false;
    }
    message.innerHTML = "";
    return true;
};

changePassword = function(formData) {
    var token = localStorage.getItem("token");
    var oldPassword = formData.oldpassword.value;
    var newPassword = formData.newpassword.value;
    var message = document.getElementById("newpassmessage");
    if (newPassword.length < 7) {
        message.innerHTML = "Password is to short";
        return false;
    }
    var result = serverstub.changePassword(token, oldPassword, newPassword);
    message.innerHTML = result.message;
    return result.success;
};

signUpValidation = function(formData) {
    var password = formData.password.value;
    if (password.length < 7) {
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
    if (m.success) {
        var result = serverstub.signIn(formData.email.value, formData.password.value);
        localStorage.token = result.data;
        document.getElementById("view").innerHTML = document.getElementById("profileview").innerHTML;
        selected(document.getElementById("home"));
        return true;
    }
    return false;
};

signOut = function() {
    var token = localStorage.getItem("token");
    localStorage.removeItem("token");
    var result = serverstub.signOut(token);
    document.getElementById("view").innerHTML = document.getElementById("welcomeview").innerHTML;
};

selected = function(item) {
    item.style.backgroundColor = "#999999";

    for (var i = 0; i < item.parentNode.childNodes.length; ++i) {
        if (item.parentNode.childNodes[i].nodeType == Node.ELEMENT_NODE && item.parentNode.childNodes[i].innerHTML != item.innerHTML)
            item.parentNode.childNodes[i].style.backgroundColor = "gray";
    }
    tab = item.innerHTML;

    if (item.innerHTML == "Home") {
        document.getElementById("homeview").style.display = "block";
        document.getElementById("browseview").style.display = "none";
        document.getElementById("accountview").style.display = "none";
        updateHome();
        updateMessages();
    } else if (item.innerHTML == "Browse") {
        document.getElementById("homeview").style.display = "none";
        document.getElementById("browseview").style.display = "block";
        document.getElementById("accountview").style.display = "none";
        searchUser();
    } else {
        document.getElementById("homeview").style.display = "none";
        document.getElementById("browseview").style.display = "none";
        document.getElementById("accountview").style.display = "block";
    }
};

updateHome = function(email) {
    if (email == null) {
        email = serverstub.getUserDataByToken(localStorage.getItem("token")).data.email;
    }

    var userdata = serverstub.getUserDataByEmail(localStorage.getItem("token"), email).data;
    document.getElementById("loggedinname").innerHTML = userdata.firstname;
    document.getElementById("loggedinfamilyname").innerHTML = userdata.familyname;
    document.getElementById("loggedingender").innerHTML = userdata.gender;
    document.getElementById("loggedincity").innerHTML = userdata.city;
    document.getElementById("loggedincountry").innerHTML = userdata.country;
    document.getElementById("loggedinemail").innerHTML = userdata.email;
};

updateMessages = function(email) {
    if (email == null) {
        email = serverstub.getUserDataByToken(localStorage.getItem("token")).data.email;
    }
    var messages = serverstub.getUserMessagesByEmail(localStorage.getItem("token"), email).data;
    for (var i = 0; i<messages.length; ++i) {
        if (i === 0)
            document.getElementById("messages").innerHTML = "<div>" + messages[i].writer + " - " + messages[i].content + "</div>";
        else
            document.getElementById("messages").innerHTML += "<div>"+ messages[i].writer + " - " + messages[i].content + "</div>";
    }
    return messages.success;
};

searchUser = function(formData) {
    var email;
    if (formData == null) {
        email = lastsearched;

    }
    else {
    email = formData.searchemail.value;
    lastsearched = email;
    }
    var result = serverstub.getUserDataByEmail(localStorage.getItem("token"), email);
    if (result.success) {
        updateHome(email);
        updateMessages(email);
        document.getElementById("userpage").innerHTML = document.getElementById("homeview").innerHTML;
        document.getElementsByName("header")[1].innerHTML = "";
        document.getElementById("wrongemail").innerHTML = "";
    }
    else {
        if (formData != null) {
            document.getElementById("wrongemail").innerHTML = result.message;
        }
        return false;
    }
};
