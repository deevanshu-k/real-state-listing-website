'use strict'

let sample = {};

sample.sample = (req,res) => {
    return res.send("Hello Sample");
}

module.exports = sample;