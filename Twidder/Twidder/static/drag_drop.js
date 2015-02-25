drag = function(e) {
    var message = e.target.innerHTML.split(" - ");
    var text="";
    for (var i = 1; i < message.length; i++) {
        if (message.length - 1 != i){
            text += message[i]+" - ";
        }
        else {
            text += message[i];

        }
    }
    e.dataTransfer.setData("text", text);
    console.log(text);
};

drop = function(e){
    e.preventDefault();
    var text = e.dataTransfer.getData("text");
    if (tab == "Browse")
        document.getElementsByName("posttextarea")[1].value += text;
    else
        document.getElementsByName("posttextarea")[0].value += text;
};

allowDrop = function(e){
    e.preventDefault();
};
