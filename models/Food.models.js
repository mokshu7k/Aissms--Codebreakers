import mongoose from "mongoose";

/**
 * Types of food
 * packaged - quantity(number of packets)
 * unpackaged - quantity(weight)
 * 
 */
const foodSchema = new mongoose.Schema({
    foodtype : {
        type: String,
        // required: true,
    },
    foodQuantity : {
        type: String,
        // required: true,
    }
})

export const Food = mongoose.Model("Food",foodSchema)