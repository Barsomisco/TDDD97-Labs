var tab;
var lastsearched;
var data;
var xmlhttp = new XMLHttpRequest();
var socket;



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

logInValidation = function(signInForm) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            console.log(data.success);
            if (data.success) {
                socket = new WebSocket("ws://localhost:5000/socket");
                localStorage.token = data.token;
                socket.onopen = function() {
                    socket.send(localStorage.getItem('token'));
                    console.log('hej');
                };

                socket.onmessage = function(event) {
                    console.log(event.data);
               //     console.log('onmsg');
                };
                document.getElementById("view").innerHTML = document.getElementById("profileview").innerHTML;
                selected(document.getElementById("home"));
            }
            else {
                signinmessage.innerHTML = data.message;
            }
        }
    };
    xmlhttp.open("POST", "/signin", true);
    var params = "email="+signInForm.signinemail.value+"&password="+signInForm.signinpassword.value;
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
};

checkRequiredPassword = function() {
    var password = document.getElementById("password").value;
    var repeatedPassword = document.getElementById("repeatpassword").value;
    var message = document.getElementById("signupmessage");
    message.style.color = "Red";
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
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            console.log(data.success);
            if (data.success) {
                if (tab == "Browse") {
                    document.getElementsByName("posttextarea")[1].value = "";
                    updateMessages(lastsearched);
                }
                else {
                    document.getElementsByName("posttextarea")[0].value = "";
                    updateMessages(document.getElementById("loggedinemail").innerHTML);
                }
            }
        }
    };
    var recipient;
    var text;
    var token = localStorage.getItem("token");
    xmlhttp.open("POST", "/postmessage", true);
    if (tab == "Browse") {
        text = document.getElementsByName("posttextarea");
        text = text[1].value;
        recipient = lastsearched;
    }
    else {
        text = document.getElementsByName("posttextarea");
        text = text[0].value;
        recipient = document.getElementById("loggedinemail").innerHTML;
    }
    var params = "email="+recipient+"&token="+token+"&message="+text;
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
};

checkPassword = function() {
    var password = document.getElementById("password").value;
    var message = document.getElementById("signupmessage");
    message.style.color = "Red";
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
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            console.log(data.success);
            message.innerHTML = data.message;
        }
    };
    var token = localStorage.getItem("token");
    var oldPassword = formData.oldpassword.value;
    var newPassword = formData.newpassword.value;
    var message = document.getElementById("newpassmessage");
    if (newPassword.length < 7) {
        message.innerHTML = "Password is to short";
        return false;
    }
    xmlhttp.open("POST", "/changepass", true);
    var params = "old_password="+oldPassword+"&token="+token+"&new_password="+newPassword;
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
};

signUpValidation = function(formData) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            console.log(data.success);
            if (data.success) {
                document.getElementById("signupmessage").style.color = "Green";
                document.getElementById("signupmessage").innerHTML = data.message;
            }
            else {
                document.getElementById("signupmessage").innerHTML = data.message;
            }
        }
    };

    var message = document.getElementById("signupmessage");
    message.style.color = "Red";
    var password = formData.password.value;
    if (password.length < 7) {
        message.innerHTML = "Password is too short";
        return false;
    }
    var repeatedPassword = formData.repeatpassword.value;
    if (repeatedPassword != password) {
        message.innerHTML = "Passwords do not match";
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

    xmlhttp.open("POST", "/signup", true);
    var params = "email="+regData.email+"&password="+regData.password+"&firstname="+regData.firstname+"&familyname="+regData.familyname+"&gender="+regData.gender+"&city="+regData.city+"&country="+regData.country;
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);

};

signOut = function() {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            console.log(data.success);
            if (data.success) {
                document.getElementById("view").innerHTML = document.getElementById("welcomeview").innerHTML;
            }
            lastsearched = "";
        }
    };
    var token = localStorage.getItem("token");
    localStorage.removeItem("token");
    xmlhttp.open("POST", "/signout", true);
    var params = "token="+token;
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
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

showHome = function(data) {
    document.getElementById("loggedinname").innerHTML = data.firstname;
    document.getElementById("loggedinfamilyname").innerHTML = data.familyname;
    document.getElementById("loggedingender").innerHTML = data.gender;
    document.getElementById("loggedincity").innerHTML = data.city;
    document.getElementById("loggedincountry").innerHTML = data.country;
    document.getElementById("loggedinemail").innerHTML = data.email; 
};

updateHome = function(email) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            console.log(data.success);
            if (data.success) {
                showHome(data);
                updateMessages(data.email);
            }
        }
    };

    var params;
    var token = localStorage.getItem("token");
    if (email == null) {
        xmlhttp.open("POST", "/userdata/token", true);
        params = "token="+token;
    } else {
        xmlhttp.open("POST", "/userdata/email", true);
        params = "token="+token+"&email="+email;
    }

    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
};

showMessages = function(data) {
    var messages = data.messages;
    console.log(data);
    for (var i = messages[0].length - 1; i >= 0; --i) {
        if (i === messages[0].length - 1)
            document.getElementById("messages").innerHTML = "<div>" + messages[1][i] + " - " + messages[0][i] + "</div>";
        else
            document.getElementById("messages").innerHTML += "<div>"+ messages[1][i] + " - " + messages[0][i] + "</div>";
    }
    if (tab == "Browse") {
        document.getElementById("userpage").innerHTML = document.getElementById("homeview").innerHTML;
        document.getElementsByName("header")[1].innerHTML = "";
        document.getElementById("wrongemail").innerHTML = "";
    }
};

updateMessages = function(email) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            console.log(data.success);
            if (data.success) {
                console.log(data.messages);
                showMessages(data);
            }
        }
    };

    var token = localStorage.getItem("token");
    if (email == null) {
        xmlhttp.open("POST", "/messages/token", true);
        var params = "token="+token;
    } else {
        xmlhttp.open("POST", "/messages/email", true);
        var params = "token="+token+"&email="+email;
    }

    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
};

searchUser = function(formData) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            console.log(data.success);
            if (data.success) {
                showHome(data);
                updateMessages(data.email)
            }
            else {
                document.getElementById("userpage").innerHTML = "";
                if (document.getElementById("searchemail").value == "") {
                    document.getElementById("wrongemail").innerHTML = "";
                } else 
                    document.getElementById("wrongemail").innerHTML = data.message;
            }
        }
    };

    var email;
    if (formData == null) {
        email = lastsearched;
    }
    else {
        email = formData.searchemail.value;
        lastsearched = email;
    }

    var token = localStorage.getItem("token");
    xmlhttp.open("POST", "/userdata/email", true);
    var params = "token="+token+"&email="+email;
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);

    return false;
};
