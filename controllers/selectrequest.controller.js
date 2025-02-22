import Requests from "../models/Requests.models.js";
import axios from "axios";

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





// const selectRequest = async (req, res) => { 
//     try {
//         const reqId = req.body.requestId;

//         if (!reqId) {
//             return res.status(400).json({ error: "Request ID is missing" });
//         }

//         const request = await Requests.findById(reqId);

//         const ngo = req.user;
//         const [ngolong,ngolat] = ngo.location.coordinates;
//         const [donorlong,donorlat] = request.location.coordinates;

//         const dist = await calculatedistance([ngolong,ngolat],[donorlong,donorlat]);

//         if (request) {
//             console.log("Request fetched successfully");
//             request.distance = dist;
//             return res.json(request);
//         } else {
//             console.log("Request not found!");
//             return res.status(404).json({ error: "Request not found" });
//         }
//     } catch (error) {
//         console.error("Error fetching request:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };

// export default selectRequest;

const selectRequest = async (req, res) => { 
    try {
        const reqId = req.body.requestId;

        if (!reqId) {
            return res.status(400).json({ error: "Request ID is missing" });
        }

        const request = await Requests.findById(reqId);

        if (!request || !request.location || !request.location.coordinates) {
            console.log("Request not found or missing location!");
            return res.status(404).json({ error: "Request not found or missing location" });
        }

        const ngo = req.user;
        
        if (!ngo || !ngo.location || !ngo.location.coordinates) {
            console.log("NGO location not found!");
            return res.status(400).json({ error: "NGO location not found" });
        }

        const [ngolong, ngolat] = ngo.location.coordinates;
        const [donorlong, donorlat] = request.location.coordinates;

        const dist = await calculatedistance([ngolong, ngolat], [donorlong, donorlat]);

        console.log("Request fetched successfully");

        return res.json({ ...request.toObject(), distance: dist });

    } catch (error) {
        console.error("Error fetching request:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default selectRequest;

