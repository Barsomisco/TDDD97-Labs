var tab;
var lastsearched;
var data;
var backbutton;
var xmlhttp = new XMLHttpRequest();
var socket = new WebSocket("ws://localhost:5000/socket");
//var page = require("page");


socket.onopen = function() {
    if (localStorage.getItem("token") !== null) {
        socket.send(localStorage.getItem("token"));
        socket.onmessage = function(event) {
            if (event.data == 'Signout')
                signOut();
        };
    }
};

window.onpopstate = function() {
    savehistory = false;
};

window.onload = function() {
    savehistory = false;
    displayView();
};


window.onbeforeunload = function() {
    socket.send("close connection");
    socket.close();
};


displayView = function() {
    if (localStorage.getItem("token") !== null) {
        document.getElementById("view").innerHTML = document.getElementById("profileview").innerHTML;
        initialize_page();
    } else {
        document.getElementById("view").innerHTML = document.getElementById("welcomeview").innerHTML;
        initialize_page();
    }
};

logInValidation = function(signInForm) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            if (data.success) {
                localStorage.token = data.token;
                socket.send(localStorage.getItem('token'));

                socket.onmessage = function(event) {
                    if (event.data == 'Signout')
                        signOut();
                };
                document.getElementById("view").innerHTML = document.getElementById("profileview").innerHTML;
                selected(document.getElementById("home"));
                page.redirect('/home');
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
    var password = document.getElementById("newpassword").value;
    var message = document.getElementById("newpassmessage");
    message.style.color = "Red";
    if (password.length < 7) {
        message.innerHTML = "Password is to short";
        return false;
    } else if (!checkNewRepeatedPassword()) {
        return false;
    } else {
        message.innerHTML = "";
        return false;
    }
};

checkNewRepeatedPassword = function(newrepeatedpassword) {
    var password = document.getElementById("newpassword").value;
    var repeatedPassword = document.getElementById("newrepeatedpassword").value;
    var message = document.getElementById("newpassmessage");
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

changePassword = function(formData) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            message.style.color = "Green";
            message.innerHTML = data.message;
        }
    };
    var token = localStorage.getItem("token");
    var oldPassword = formData.oldpassword.value;
    var newPassword = formData.newpassword.value;
    var repeatedNewPassword = formData.newrepeatedpassword.value;
    var message = document.getElementById("newpassmessage");
    message.style.color = "Red";
    if (newPassword.length < 7) {
        message.innerHTML = "Password is to short";
        return false;
    }
    if (newPassword != repeatedNewPassword) {
        message.innerHTML = "Passwords do not match";
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
            if (data.success) {
                document.getElementById("view").innerHTML = document.getElementById("welcomeview").innerHTML;
                page.redirect('/');
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

    var old_tab = tab;

    tab = item.innerHTML;

    if (item.innerHTML == "Home") {
        document.getElementById("homeview").style.display = "block";
        document.getElementById("browseview").style.display = "none";
        document.getElementById("accountview").style.display = "none";
        if (tab != old_tab) {
            page.redirect('/home');
            save_to_history("Home");
        }
        updateHome();
    } else if (item.innerHTML == "Browse") {
        document.getElementById("homeview").style.display = "none";
        document.getElementById("browseview").style.display = "block";
        document.getElementById("accountview").style.display = "none";
        if (tab != old_tab) {
            page.redirect('/browse');
            save_to_history("Browse");
        }
        searchUser();
    } else {
        document.getElementById("homeview").style.display = "none";
        document.getElementById("browseview").style.display = "none";
        document.getElementById("accountview").style.display = "block";
        if (tab != old_tab) {
            page.redirect('/account');
            save_to_history("Account");
        }
    }
};

save_to_history = function(historyname) {
    if (savehistory) {
        var stateObj = {name:historyname};
        history.pushState(stateObj, historyname, historyname);
    }
    savehistory = true;
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
    for (var i = messages[0].length - 1; i >= 0; --i) {
        if (i === messages[0].length - 1)
            document.getElementById("messages").innerHTML = "<div draggable=\"true\" ondragstart=\"drag(event)\">" + messages[1][i] + " - " + messages[0][i] + "</div>";
        else
            document.getElementById("messages").innerHTML += "<div draggable=\"true\" ondragstart=\"drag(event)\">"+ messages[1][i] + " - " + messages[0][i] + "</div>";
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
            if (data.success) {
                showMessages(data);
            }
            updateMedia(email);
        }
    };

    var token = localStorage.getItem("token");
    var params;
    if (email == null) {
        if (tab == "Browse") {
            email = lastsearched;
            xmlhttp.open("POST", "/messages/email");
            params = "token="+token+"&email="+email;
        } else {
            xmlhttp.open("POST", "/messages/token", true);
            params = "token="+token;
        }
    } else {
        xmlhttp.open("POST", "/messages/email", true);
        params = "token="+token+"&email="+email;
    }

    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
};

searchUser = function(formData) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            if (data.success) {
                showHome(data);
                updateMessages(data.email);
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

initialize_page = function() {
    page('/welcome', function() {
        if (localStorage.getItem("token") !== null) {
            page.redirect('/home');
        }
    });

    page('/home', function() {
        if (localStorage.getItem("token") !== null) {
            selected(document.getElementById("home"));
        }
        else {
            page.redirect('/welcome');
        }
    });

    page('/browse', function() {
        if (localStorage.getItem("token") !== null) {
            selected(document.getElementById("browse"));
        }
        else {
            page.redirect('/welcome');
        }
    });

    page('/account', function() {
        if (localStorage.getItem("token") !== null) {
            selected(document.getElementById("account"));
        }
        else {
            page.redirect('/welcome');
        }
    });

    page('*', function() {
        if (localStorage.getItem("token") !== null) {
            page.redirect('/home');
        }
        else {
            page.redirect('/welcome');
        }
    });

    page.start();
};
