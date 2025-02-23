import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const sendWamsg = async (number) => {
    try {
        const response = await axios.post(
            "https://graph.facebook.com/v22.0/605419819315736/messages",
            {
                messaging_product: "whatsapp",
                to: `${number}`,
                type: "template",
                template: {
                    name: "hello_world",
                    language: { code: "en_US" }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("Message sent:", response.data);
    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
    }
};

// const numbers = [+917217747304, +919307811583, +917741989282, +917066196601];

// for(let number of numbers){
//     sendWamsg(number);
// }

export default sendWamsg;
 

