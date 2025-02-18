const Donor = require("../models/Donor.models");
const NGO = require("../models/Ngo.models");

//donate request is generated
const sendDonationRequest = async(req, res) => {
    // MongoDB automatically provides a unique _id for every document.
    
    const donorId = req.body.donorId;
    const foodId = req.body.foodId;
    const donationDetails = req.body.donationDetails;

    // getting donor's location
    const donor = await Donor.findById(donorId);

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
    io.emit("newDonationRequest", notifications);

    








}





  

