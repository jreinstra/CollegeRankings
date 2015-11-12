var sliders = {};
var values = {};

var data = null;
initDatabase(function(loadedData) {
    data = JSON.parse(loadedData);
    displayColleges(data);
    
    for(var i in data[0]) {
        if(
            data[0][i] &&
            i != "Setting" &&
            i != "Athletic Association" &&
            i != "CollegeName" &&
            i != "School Type"
          ) {
            var id = "s_" + i.replace(/ /g, "-");
            $("#form").append('<div><h5>' + i + '</h5><span id="' + id + '"></span></div><span id="' + id + '_val">5</span><br/>');
            sliders[id] = $("#" + id).slider();
            values[id] = 5;
            $("#" + id).change(formChanged);
        }
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
        callback(localStorage["collegeData"]);
    }
}

function formChanged(e) {
    var id = e.currentTarget.id;
    var value = sliders[id].slider('getValue');
    values[id] = value;
    $("#" + id + "_val").html(value);
}

function displayColleges(data) {
    for(var i = 0; i < 10; i++) {
        $("#colleges").append(
            '<div class="panel panel-default">' + 
                '<div class="panel-body"><h4>' + 
                    (parseInt(i) + 1) + '. ' + data[i]["CollegeName"] + 
                '</h4></div>' +
            '</div>'
        );   
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