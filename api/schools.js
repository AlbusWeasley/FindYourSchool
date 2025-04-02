const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
    name: String,
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
});
const School = mongoose.model("School", SchoolSchema);

module.exports = async (req, res) => {
    await mongoose.connect(process.env.MONGO_URI);
    if (req.method === "GET") {
        const schools = await School.find().sort({ rating: -1 });
        res.json(schools);
    }
};
