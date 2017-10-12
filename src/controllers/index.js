const express = require('express');
const geocode_api_key = "AIzaSyCnKaZ7Q8zKqlAC4TBZz64iua1EYd8xlgc";
const google = require('googleapis');
var request = require("request")
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
    let name, image_link, address_link, nearby_link = [];
    let location_name = req.params.temple_name;
    console.log("location name --> " + location_name);
    let location_unique_id;
    get_location_id(location_name);

    console.log("Calling Image -- > " + getImage());

    let location_info = get_location_details(location_unique_id);
    console.log("location_info --> " + location_info);

    res.header('Access-Control-Allow-Origin', "*");
    res.render('pages/temple', {
        name: getName(),
        image_link: getImage(),
        address_link: getAddress(),
        nearby_link: getNearByTemples()
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
        if (!error && response.statusCode === 200) {
            // console.log(body); // Print the json response
            // console.log(body.results[0].place_id)
            // body.results[0].place_id;
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
        if (!error && response.statusCode === 200) {
            // console.log("Address -- >" +
            //     body.result);
            // getImage(body.result.formatted_address);
            // getAddress(body.result.icon);
        }

    });
};

function getName(name_link) {
    return 'Rajendra Sarovar';
    // return name_link;
}

function getImage(image_link) {
    return 'https://maps.gstatic.com/mapfiles/place_api/icons/worship_hindu-71.png';
    // return image_link;
}

function getAddress(address_link) {
    return 'Bihar, Sadhnapuri, Sadhapur, Chhapra, Bihar 841301, India';
    // return address_link;
}

function getNearByTemples(nearby_link) {
    var arr = ["वेंकितापुरम पेरूमल कोइल (SRI करानाराजर सनिधि)", "खाखी महाराज मंदिर", "अप्पा पिथियम स्वामी मंदिर", "शिव मंदिर", "नीलकंठ मंदिर", "इस्क्कों गुरुवायुर", "Swaminarayan mandir", "DADA MAI WALA MANDIR BANKNER", "हनुमान मंदिर", "हनुमान एंड श्री बालाजी मंदिर", "सिथाम्पलम सिवान मंदिर", "झूले लाल मंदिर", "विश्वकर्मा मंदिर", "काली मंदिर", "श्री सिद्धि विनायक गणेश मन्दिर"];
    return arr;
}