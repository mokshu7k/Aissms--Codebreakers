// this will be the page that shows the NGO available requests for accepting them
import { request } from "express";
import { Requests } from "../models/Requests.models";
const notifications = require("../models/Notifications.models");

const showrequests = async (req,res) => {
    const requests = await Requests.find({status : 'pending'});
    
    if(response.length > 0){
        res.json(requests);
    }   

    else {
        res.send("No Donations right now !");
    }
}