const mongoose = require("mongoose")
const source = process.env.MONGO_URI

const connection = async () => {
    const db = await mongoose.connect(source)
    console.log(`MongoDB connected: ${db.connection.host}`)
}

module.exports = connection