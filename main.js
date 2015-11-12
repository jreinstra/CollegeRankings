var sliders = {};
var values = {};

var data = null;
initDatabase(function(loadedData) {
    data = JSON.parse(loadedData);
    
    for(var i in data[0]) {
        if(data[0][i] && i != "CollegeName") {
            var id = "s_" + i.replace(/ /g, "-");
            $("#form").append('<div><h5>' + i + '</h5><span id="' + id + '"></span></div><span id="' + id + '_val">5</span><br/>');
            sliders[id] = $("#" + id).slider();
            values[id] = 5;
            $("#" + id).change(formChanged);
        }
    }
    rankColleges();
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
    rankColleges();
}

function displayColleges() {
    $("#colleges").html("");
    for(var i = 0; i < 10; i++) {
        $("#colleges").append(
            '<div class="panel panel-default">' + 
                '<div class="panel-body"><h4>' + 
                    (parseInt(i) + 1) + '. ' + data[i]["CollegeName"] + 
                '</h4><p>Weighted rank: ' + Math.round(data[i]["WeightedRank"] * 10) / 10.0 + '</p></div>' +
            '</div>'
        );   
    }
}

function rankColleges() {
    for(var i = 0; i < data.length; i++) {
        var totalRank = 0;
        var totalPoints = 0;
        
        for(var valueID in values) {
            var value = values[valueID];
            var dataID = valueID.substring(2, valueID.length).replace(/-/g, " ");
            
            totalRank += data[i][dataID] * value
            totalPoints += value
        }
        
        data[i]["WeightedRank"] = totalRank * 1.0 / totalPoints;
        //console.log(data[i]["CollegeName"] + ": " + (totalRank * 1.0 / totalPoints));
    }
    
    data.sort(function(a, b) {
        return a.WeightedRank - b.WeightedRank;
    });
    
    displayColleges(data);
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