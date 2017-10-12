const express = require('express');
const geocode_api_key = "AIzaSyCnKaZ7Q8zKqlAC4TBZz64iua1EYd8xlgc";
const google = require('googleapis');
var request = require("request")
const place_api_key = "AIzaSyBjLuTq1WL8jvIQ5wb-qIWe712MxDmyu7A";
var x;

/* GET home page. */
exports.index_get = (req, res) => {
    res.header('Access-Control-Allow-Origin', "*")
    res.render('pages/index');
};

exports.index_post = (req, res) => {
    res.render('pages/index');
};

exports.temple_get = (req, res) => {
    var x = {};
    x.name = getName(),
        x.image_link = getImage(),
        x.address_link = getAddress(),
        x.nearby_link = getNearByTemples();

    console.log("abra------->" + getName());

    console.log("caling global value -> " + x);

    // console.log("Calling from get -- > " + image_link);
    let location_name = req.params.temple_name;
    console.log("location name --> " + location_name);
    let location_unique_id;
    get_location_id(location_name);

    console.log("Calling Image -- > " + getImage());
    let location_info = get_location_details(location_unique_id);
    console.log("location_info --> " + location_info);

    res.header('Access-Control-Allow-Origin', "*");
    res.render('pages/temple', {
        data: x
    });
};


function get_location_id(location_name) {
    let modified_name = location_name.split(' ').join('+');
    console.log("modified_name -- > " + modified_name);
    // get place id from here
    let geocode_url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + modified_name + "&sensor=false&key=" + geocode_api_key;
    request({
        url: geocode_url,
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode === 200 && body.status === "OK") {
            // console.log(body); // Print the json response
            get_location_details(body.results[0].place_id);
        }
    });

};

function get_location_details(location_id) {
    // get details of place using place id
    console.log("id -- >" + location_id);
    var place_url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + location_id + "&key=" + place_api_key;
    request({
        url: place_url,
        json: true
    }, function(error, response, body) {
        console.log("received ---- " + response.statusCode);
        if (!error && response.statusCode === 200 && body.status === "OK") {
            var result = body.result;
            if (result == undefined) {
                console.log("got undefines - " + JSON.stringify(body));
            } else {
                var out_result = result;
                if (out_result == undefined) {
                    console.log("undefined addr - " + JSON.stringify(out_result));
                } else {
                    console.log(" value - " + JSON.stringify(out_result.name));
                    x = out_result;
                    // getTempleDetails(out_result);

                    setTimeout(function() {
                        getName(JSON.stringify(out_result.name));
                        getImage(JSON.stringify(out_result.formatted_address));
                        getAddress(JSON.stringify(out_result.icon));
                        getNearByLocations(out_result.geometry.location.lat, out_result.geometry.location.lng, out_result.types[0]);
                    }, 1000);
                }

            }
        }

    });
};


function getNearByLocations(lat, lng, typ) {
    console.log("lat -- >" + lat);
    console.log("lng -- >" + lng);
    console.log("typ -- >" + typ);
    let location_array = [];
    var near_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lng + "&radius=5000&type=" + typ + "&key=" + place_api_key;
    request({
        url: near_url,
        json: true
    }, function(error, response, body) {
        console.log("received ---- nearby " + response.statusCode);
        if (!error && response.statusCode === 200 && body.status === "OK") {
            var result = body.results;
            if (result == undefined) {
                console.log("got undefines - " + JSON.stringify(body));
            } else {
                var out_result = result;
                if (out_result == undefined) {
                    console.log("undefined addr - " + JSON.stringify(out_result));
                } else {
                    out_result.forEach(function(i) {
                        location_array.push(i.name);
                        // console.log(location_array);
                    }, this);
                    getNearByTemples(location_array);
                }

            }
        }
    });
}


function getName(name) {
    // var temp_name = name;
    console.log("Geeting name " + name);
    // return 'Rajendra Sarovar';
    return name;
}

function getImage(image_link) {
    // return 'https://maps.gstatic.com/mapfiles/place_api/icons/worship_hindu-71.png';
    return image_link;
}

function getAddress(address_link) {
    // return 'Bihar, Sadhnapuri, Sadhapur, Chhapra, Bihar 841301, India';
    return address_link;
}

function getNearByTemples(array_link) {
    // var arr = ["वेंकितापुरम पेरूमल कोइल (SRI करानाराजर सनिधि)", "खाखी महाराज मंदिर", "अप्पा पिथियम स्वामी मंदिर", "शिव मंदिर", "नीलकंठ मंदिर", "इस्क्कों गुरुवायुर", "Swaminarayan mandir", "DADA MAI WALA MANDIR BANKNER", "हनुमान मंदिर", "हनुमान एंड श्री बालाजी मंदिर", "सिथाम्पलम सिवान मंदिर", "झूले लाल मंदिर", "विश्वकर्मा मंदिर", "काली मंदिर", "श्री सिद्धि विनायक गणेश मन्दिर"];
    console.log(array_link);
    return array_link;
}