// this will be the page that shows the NGO available requests for accepting them
import { request } from "express";
import { Requests } from "../models/Requests.models";
import axios from "axios";
const notifications = require("../models/Notifications.models");

const calculatedistance = async (start,end) => {
    const apikey = "5b3ce3597851110001cf6248f61e177caabc400d80a2f0a4a2c45308";
    const url = "https://api.openrouteservice.org/v2/matrix/driving-car";

    const response = await axios.post(url, {
        // body
        locations : [start,end],
        metrics : ["distance"]
    },
    {
        //extra metadata with authorisation key
        headers : {
            "Authorization" : apikey,
            "Content-Type": "application/json",
        }
    })

    return response.data.distances[0][1]; // Distance in meters
}

const showrequests = async (req,res) => {
    const requests = await Requests.find({status : 'pending'});
    
    const ngo = req.user;
    const [ngolong,ngolat] = ngo.location.coordinates;

    const finaldata = [];
    for(const reqq of requests) {
        const [donorlong,donorlat] = reqq.location.coordinates;

        const dist = await calculatedistance([ngolong,ngolat],[donorlong,donorlat]);
        reqq.distance = dist;
        finaldata.push(reqq);
    }

    res.json(finaldata);
}