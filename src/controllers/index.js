const express = require('express');

/* GET home page. */
exports.index_get = (req, res) => {
    res.header('Access-Control-Allow-Origin', "*")
    res.render('pages/index');
};



exports.index_post = (req, res) => {
    res.render('pages/index');
};