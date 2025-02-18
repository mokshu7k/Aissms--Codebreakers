const sendDonationRequest = async (req, res) => {
  try {
    const { donorId, foodId, donationDetails } = req.body;

    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    const donorLocation = donor.location;
    const distanceLayers = [5000, 10000, 15000, 20000, 50000]; // 5km, 10km, 15km, 20km, 50km
    const timeoutDuration = 30000; // 30 seconds timeout per layer
    let acceptedNgo = null;

    // Function to send notification to NGOs
    const sendNotifications = async (ngos, donorId, foodId) => {
      await Promise.all(
        ngos.map(async (ngo) => {
          const notification = new Notification({
            donorId,
            foodId,
            ngoId: ngo._id,
            message: `New donation request from ${donor.name} for food item ${foodId}`,
            status: "pending",
          });

          await notification.save();
        })
      );
    };

    // Loop through each layer
    for (let i = 0; i < distanceLayers.length; i++) {
      const maxDistance = distanceLayers[i];

      // Find NGOs in the current layer
      const ngos = await NGO.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: donorLocation.coordinates },
            distanceField: "dist.calculated",
            maxDistance: maxDistance,
            query: { availableForDonation: true },
            spherical: true,
          },
        },
        { $sort: { "dist.calculated": 1 } },
      ]);

      if (ngos.length) {
        // Send notifications to NGOs in the current layer
        await sendNotifications(ngos, donor._id, foodId);

        // Wait for a response for the timeout duration, allowing responses from all layers so far
        const startTime = Date.now();
        while (Date.now() - startTime < timeoutDuration) {
          // Check for acceptance from NGOs in all layers so far
          if (acceptedNgo) {
            return res.status(200).json({ message: "Donation request accepted", ngoId: acceptedNgo });
          }

          // Wait for 1 second before checking again
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // If no NGO accepted, move to the next layer
      }
    }

    // If no NGO accepts the donation after all layers
    res.status(404).json({ message: "No NGO accepted the donation" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};





// Function to keep checking for responses from all notified NGOs
const checkPendingRequests = async () => {
    // Periodically check all pending donation requests
    const pendingRequests = await Notification.find({ status: "pending" });
  
    for (let request of pendingRequests) {
      // Check each NGO in the request
      const accepted = await processNgoResponse(request.ngoId);  // Simulated response
      if (accepted) {
        // If an NGO accepts, update the status
        await Notification.updateOne(
          { _id: request._id },
          { $set: { status: "accepted" } }
        );
        // Notify the donor
        // needs to be updated
        console.log(`Donation request accepted by NGO ${request.ngoId}`);
      }
    }
};