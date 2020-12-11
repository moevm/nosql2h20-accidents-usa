let Map = ol.Map;
let View = ol.View;
let fromLonLat = ol.proj.fromLonLat;
let VectorLayer = ol.layer.Vector;
let TileLayer = ol.layer.Tile;
let VectorSource = ol.source.Vector;
let Stamen = ol.source.Stamen;
let Feature = ol.Feature;
let Point = ol.geom.Point;
let OSM = ol.source.OSM;
let WebGLPointsLayer = ol.layer.WebGLPoints;

let source = new VectorSource();

let map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new Stamen({
                layer: 'toner'
            })
            /*
            source: new OSM()
             */
        }),
        /*
        new WebGLPointsLayer({
            source: source,
            style: {
                symbol: {
                    symbolType: 'square',
                    size: 10,
                    color: 'rgba(255,0,0,0.5)'
                }
            }
        })

         */
        new VectorLayer({
           source: source
        })

    ],
    view: new View({
        center: ol.proj.fromLonLat([-84.5, 39.82]),
        zoom: 6
    })
});

function ajaxPut(url) {
    let state = document.getElementById("state").value;
    let year = document.getElementById("year").value;
    let month = document.getElementById("month").value;

    let xhttp = new XMLHttpRequest();
    //action after finish
    xhttp.onreadystatechange = function() { // (3)
        if(this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            loadPointsToMap(this.responseText);

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
function loadPointsToMap(points){
    //source = new VectorSource();
    source.clear(true);
    points = JSON.parse(points);
    const features = [];
    for (let i = 0; i < points.length; i++) {
        const coords = fromLonLat([points[i].start.lng, points[i].start.lat]);
        features.push(new Feature({
            geometry: new Point(coords)
        }));
    }
    console.log(features);
    source.addFeatures(features);
}