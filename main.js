var data = null;
initDatabase(function(loadedData) {
    data = JSON.parse(loadedData);
    for(var i in data) {
        $("#colleges").append(
            '<div class="panel panel-default">' +
                '<div class="panel-body"><h4>' + 
                    (parseInt(i) + 1) + '. ' + data[i]["CollegeName"] + 
                '</h4></div>' +
            '</div>'
        );   
    }
});

function initDatabase(callback) {
    if(!localStorage["collegeData"]) {
        console.log("loading...");
        httpGetAsync("colleges.json", function(text) {
            console.log("loaded.");
            localStorage["collegeData"] = text;
            callback(text);
        });
    }
    else {
        console.log("just using local storage...");
        callback(localStorage["collegeData"]);
    }
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}