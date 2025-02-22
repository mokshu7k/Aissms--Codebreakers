import { Donors} from "../models/Donor.models.js"
import {NGO} from "../models/Ngo.models.js";
import  Requests  from "../models/Requests.models.js";
import { Notification } from "../models/Notifications.models.js";

// import { io } from "../db/socket.js"; // Import the io instance from your socket setup




//donate request is generated
const sendDonationRequest = async(req, res) => {
    // MongoDB automatically provides a unique _id for every document.
    
    const donorId = req.body.donorId;
    const foodId = req.body.foodId;
    const name = req.body.name;
    const donationDetails = req.body.donationDetails;
    const io = req.io;
    // getting donor's location
    const donor = await Donors.findById(donorId);

    const donorlocation = donor.location;


    // Find all NGOs sorted by distance
    const ngos = await NGO.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: donorlocation.coordinates },
          distanceField: "distance",
          spherical: true
        }
      }
    ]);

    // if no ngos present 
    if (ngos.length === 0) {
      return res.status(404).json({ message: "No NGOs available" });
    }


    // Store notifications with distance
    const notifications = ngos.map(ngo => ({
      donorId,
      foodId,
      ngoId: ngo._id,
      distance: ngo.distance, // Store the calculated distance
      message: `New donation request from ${donor.name} for food item ${foodId}`,
      status: "pending"
    }));

    // save all notifications in bulk
    await Notification.insertMany(notifications);
    

    // Provide the generated notifications to mokshita 
    // how to emit notifications from here
    // **Emit Notifications via Socket.io**
    // ngos.forEach((ngo) => {
    //   io.to(ngo._id.toString()).emit("newDonationRequest", {
    //       donorId,
    //       foodId,
    //       ngoId: ngo._id,
    //       message: `New donation request from ${donor.name} for food item ${foodId}`,
    //   });
    // });

    // store this particular request in requestschema to show available requests to ngo
    const newrequest = new Requests({
      donorId,
      name : name,
      donationdetails : donationDetails,
      expirydate : req.body.expirydate,
      // store the location of donor
      location : donorlocation,
      status : 'pending'
    })

    await newrequest.save();
    return res.status(201).json({ message: "Donation request sent successfully" });
}

export {sendDonationRequest};





  

