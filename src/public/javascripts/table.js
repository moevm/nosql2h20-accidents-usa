let page = 1;
let _points = [];
function ajaxPut(url) {
    let state = document.getElementById("state").value;
    let year = document.getElementById("year").value;
    let month = document.getElementById("month").value;

    let xhttp = new XMLHttpRequest();
    //action after finish
    xhttp.onreadystatechange = function() { // (3)
        if(this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            _points = JSON.parse(this.responseText);
            loadPointsToTable(_points);

        }
    }
    xhttp.open("PUT", `${url}/giveMePoints`, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        state: state,
        year: year,
        month: month
    }));
}
function loadPointsToTable(points) {
    let content = document.getElementById("content");
    content.innerHTML = '';
    //points = JSON.parse(points);
    //console.log(points);
    let string = "<tr><th>No.</th><th>Latitude</th><th>Longitude</th><th>State</th><th>Time</th></tr>";
    content.innerHTML += string;
    let end = Number(page)*10;
    for (let i = Number(page-1)*10; i < end; i++) {
        let string = "<tr><td>"+ Number(i+1) +"</td><td>" + points[i].start.lat + "</td><td>" + points[i].start.lng + "</td>" +
            "<td>" + points[i].state + "</td>" + "<td>" + points[i].time.start + "</td></tr>";
        content.innerHTML += string;
    }

}
function prev() {
    if (page > 1) {
        page--;
        loadPointsToTable(_points);
    }
}
function next() {
    let maxPage = _points.length/10;
    if (page<parseInt(maxPage.toString())){
        page++;
        loadPointsToTable(_points);
    }
}