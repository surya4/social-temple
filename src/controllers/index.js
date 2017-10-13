const express = require('express');
const google = require('googleapis');
const request = require("request");

// google api secrets
const geocode_api_key = "AIzaSyCnKaZ7Q8zKqlAC4TBZz64iua1EYd8xlgc";
const place_api_key = "AIzaSyBjLuTq1WL8jvIQ5wb-qIWe712MxDmyu7A";

/* GET home page. */
exports.index_get = (req, res) => {
    res.header('Access-Control-Allow-Origin', "*")
    res.render('pages/index');
};
exports.index_post = (req, res) => {
    res.render('pages/index');
};
exports.temple_get = (req, res) => {
    var all_data = [];
    var nearby_list = [];

    // getting name of place from params
    let location_name = req.params.temple_name;
    console.log("location name --> " + location_name);
    let location_unique_id;

    // using promise to implement apis one after another
    get_location_id(location_name).then(function(place_id) {
        console.log('bat', place_id)
        get_location_details(place_id).then(function(all_data) {
            console.log(all_data);
            getNearByLocations(all_data).then(function(nearby_list) {
                console.log("Calling Image -- > " + all_data);
                res.header('Access-Control-Allow-Origin', "*");
                res.render('pages/temple', {
                    data: all_data,
                    near_data: nearby_list
                });
            }).catch((err) => {
                console.log('errored');
            });
        });
    });
};


// implementing geocode api to get place id for a given search of string
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
                // console.log("body"+body); // Print the json response
                resolve(body.results[0].place_id);
            }
        });
    });
};


// implementing place api to get location name, address and icon from received location id from previous result
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
                        // getTempleDetails(out_result);
                        resolve([out_result.name, out_result.formatted_address, out_result.icon, [JSON.stringify(out_result.geometry.location.lat), JSON.stringify(out_result.geometry.location.lng), JSON.stringify(out_result.types[0])]]);
                    }
                }
            }
        });
    });
};


// implementing place api with near by search to get nearby worship places under 5000 metre using latittude, longitude and types from result 
function getNearByLocations(inp_arr) {
    return new Promise(function(resolve) {
        var lat_arr = JSON.parse("[" + inp_arr[3] + "]");
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