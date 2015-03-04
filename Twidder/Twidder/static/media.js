isPicture = function(file) {
    file_extension = file[1];
    if (file_extension != 'ogg' && file_extension != 'mp4')
        return true;
    return false;
};

showMedia = function(pictures) {
    document.getElementById("uploads").innerHTML = "";
    for (var i = pictures.length - 1; i >= 0; --i) {
        if (isPicture(pictures[i])) {
            if (i === pictures.length - 1)
                document.getElementById("uploads").innerHTML = "<img src=\"data:image/" + pictures[i][1] + ";base64,"+pictures[i][0]+"\" />";
            else
                document.getElementById("uploads").innerHTML += "<img src=\"data:image/" + pictures[i][1] + ";base64,"+pictures[i][0]+"\" />";
        }
        else {
            if (i === pictures.length - 1)
                document.getElementById("uploads").innerHTML = "<audio controls><source src=\"data:audio/" + pictures[i][1] + ";base64,"+pictures[i][0]+"\" />";
            else
                document.getElementById("uploads").innerHTML += "<audio controls><source src=\"data:audio/" + pictures[i][1] + ";base64,"+pictures[i][0]+"\" />";
        }
    }
};

updateMedia = function(email) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            if (data.success) {
                showMedia(data.media);
            }
        }
        if (xmlhttp.readyState == 2 & xmlhttp.status == 200) {
            if (tab == "Browse") {
                document.getElementById("userpage").innerHTML = document.getElementById("homeview").innerHTML;
                document.getElementsByName("header")[1].innerHTML = "";
                document.getElementById("wrongemail").innerHTML = "";
                document.getElementsByName("uploadmedia")[1].innerHTML = "";
                document.getElementById("uploadmessage").innerHTML = "";
            }
        }
    };

    var token = localStorage.getItem("token");
    var params;
    if (email == null) {
        if (tab == "Browse") {
            email = lastsearched;
            xmlhttp.open("POST", "/media/email");
            params = "token="+token+"&email="+email;
        } else {
            xmlhttp.open("POST", "/media/token", true);
            params = "token="+token;
        }
    } else {
        xmlhttp.open("POST", "/media/email", true);
        params = "token="+token+"&email="+email;
    }

    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);

};

postMedia = function() {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            message.innerHTML = data.message;
            if (data.success) {
                message.style.color = "Green";
                if (tab == "Browse")
                    updateMedia(lastsearched);

                else 
                    updateMedia(document.getElementById("loggedinemail").innerHTML);
            }
        }
    };

    var file = document.getElementById("browsefile").files[0];
    var message = document.getElementById("uploadmessage");
    message.style.color = "Red";
    var token = localStorage.getItem("token");
    var formData = new FormData();
    xmlhttp.open('POST', '/postmedia', true);
    formData.append("token", token);
    formData.append("media", file);
    xmlhttp.send(formData);

};
