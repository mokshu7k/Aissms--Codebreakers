import { Requests } from "../models/Requests.models.js";

const acceptRequest = async (req, res) => {
    try {
        const requestId = req.body.requestId; // Get request ID from frontend
        console.log(`request id: ${requestId}`);
        console.log(`NGO ID: ${req.user}`);

        const ngoId = req.user._id; // Assuming NGO is authenticated
        //Find the request
        const request = await Requests.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "Request already processed" });
        }

        // Update request status and assign the NGO
        request.status = "accepted";
        request.acceptedBy = ngoId;
        await request.save();

        res.status(200).json({ 
            message: "Request accepted successfully", 
            // requestId: request._id 
        });  /// HANDLE REMOVAL OF REQUEST IN FRONTEND

    } catch (error) {
        console.error("Error accepting request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export { acceptRequest };

