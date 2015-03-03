showMedia = function(pictures) {
    document.getElementById("uploads").innerHTML = "";  
    for (var i = pictures.length - 1; i >= 0; --i) {
        if (i === pictures.length - 1)
            document.getElementById("uploads").innerHTML = "<img src=\"data:image/jpeg;base64,"+pictures[i]+"\" />";
        else
            document.getElementById("uploads").innerHTML += "<img src=\"data:image/jpeg;base64,"+pictures[i]+"\" />";
    }
    if (tab == "Browse") {
        document.getElementById("userpage").innerHTML = document.getElementById("homeview").innerHTML;
        document.getElementsByName("header")[1].innerHTML = "";
        document.getElementById("wrongemail").innerHTML = "";
        document.getElementsByName("uploadmedia")[1].innerHTML = "";
    }
};

updateMedia = function(email) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            console.log(data.success);
            if (data.success) {
               showMedia(data.pictures);
            }
        }
    };

    var token = localStorage.getItem("token");
    var params;
    if (email == null) {
        if (tab == "Browse") {
            email = lastsearched;
            xmlhttp.open("POST", "/pictures/email");
            params = "token="+token+"&email="+email;
            console.log("is wrong");
        } else {
            xmlhttp.open("POST", "/pictures/token", true);
            params = "token="+token;
            console.log("is in correct?");
        }
    } else {
        xmlhttp.open("POST", "/pictures/email", true);
        params = "token="+token+"&email="+email;
    }

    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
    
};

postMedia = function() {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            console.log(data.success);
            alert(data.message);
            if (data.success) {
              alert(data.message); 
            }
        }
    };
    
    var file = document.getElementById("browsefile").files[0];
    console.log(file);
//    var params;
    var token = localStorage.getItem("token");
    var formData = new FormData();
    xmlhttp.open('POST', '/postpicture', true);
//    params = "token="+token+"&picture="+file;
    formData.append("token", token);
    formData.append("picture", file);
 //   xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(formData);

};
