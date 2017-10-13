const express = require('express');
const geocode_api_key = "AIzaSyCnKaZ7Q8zKqlAC4TBZz64iua1EYd8xlgc";
const google = require('googleapis');
var request = require("request")
const place_api_key = "AIzaSyBjLuTq1WL8jvIQ5wb-qIWe712MxDmyu7A";
var x;

// function getName(name) {
//     // var temp_name = name;
//     console.log("Geeting name " + name);
//     // return 'Rajendra Sarovar';
//     return name;
// }

// function getImage(image_link) {
//     // return 'https://maps.gstatic.com/mapfiles/place_api/icons/worship_hindu-71.png';
//     return image_link;
// }

// function getAddress(address_link) {
//     // return 'Bihar, Sadhnapuri, Sadhapur, Chhapra, Bihar 841301, India';
//     return address_link;
// }

// function getNearByTemples(array_link) {
//     // var arr = ["वेंकितापुरम पेरूमल कोइल (SRI करानाराजर सनिधि)", "खाखी महाराज मंदिर", "अप्पा पिथियम स्वामी मंदिर", "शिव मंदिर", "नीलकंठ मंदिर", "इस्क्कों गुरुवायुर", "Swaminarayan mandir", "DADA MAI WALA MANDIR BANKNER", "हनुमान मंदिर", "हनुमान एंड श्री बालाजी मंदिर", "सिथाम्पलम सिवान मंदिर", "झूले लाल मंदिर", "विश्वकर्मा मंदिर", "काली मंदिर", "श्री सिद्धि विनायक गणेश मन्दिर"];
//     console.log(array_link);
//     return array_link;
// }

/* GET home page. */
exports.index_get = (req, res) => {
    res.header('Access-Control-Allow-Origin', "*")
    res.render('pages/index');
};
exports.index_post = (req, res) => {
    res.render('pages/index');
};
exports.temple_get = (req, res) => {
    var meta_data = [];
    var nearby_list = [];
    console.log("caling global value -> " + x);
    // console.log("Calling from get -- > " + image_link);
    let location_name = req.params.temple_name;
    console.log("location name --> " + location_name);
    let location_unique_id;
    get_location_id(location_name).then(function(place_id) {
        console.log('bat', place_id)
        get_location_details(place_id).then(function(meta_data) {
            // console.log(meta_data);


            getNearByLocations(meta_data).then(function(nearby_list) {

                // nearby_list = meta_data[3].split(',');
                // console.log(nearby_list);

                // console.log("nearby_list -----> " + nearby_list);
                console.log("Calling Image -- > " + meta_data);
                res.header('Access-Control-Allow-Origin', "*");
                res.render('pages/temple', {
                    data: meta_data,
                    near_data: nearby_list
                });
            }).catch((err) => {
                console.log('errored');
            });
        });
    });
};

function get_location_id(location_name) {
    return new Promise(function(resolve) {
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
                // console.log(body, 'kehs');
                resolve(body.results[0].place_id);
            }
        });
    });
};

function get_location_details(location_id) {
    return new Promise(function(resolve) {
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
                        resolve([out_result.name, out_result.formatted_address, out_result.icon, [JSON.stringify(out_result.geometry.location.lat), JSON.stringify(out_result.geometry.location.lng), JSON.stringify(out_result.types[0])]]);
                    }
                }
            }
        });
    });
};

function getNearByLocations(inp_arr) {
    return new Promise(function(resolve) {
        var lat_arr = JSON.parse("[" + inp_arr[3] + "]");
        console.log(" check if input is array --- >" + lat_arr);
        console.log("lat -- >" + lat_arr[0]);
        console.log("lng -- >" + lat_arr[1]);
        console.log("typ -- >" + lat_arr[2]);
        let location_array = [];
        var near_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat_arr[0] + "," + lat_arr[1] + "&radius=5000&type=" + lat_arr[2] + "&key=" + place_api_key;
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
                        console.log("location_array" + location_array);
                        resolve(location_array);
                    }
                }
            }
        });
    });
}