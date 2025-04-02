const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ReviewSchema = new mongoose.Schema({
    schoolId: String,
    rating: Number,
    comment: String,
    userId: String
});
const Review = mongoose.model("Review", ReviewSchema);

const SECRET_KEY = "your_secret_key";

module.exports = async (req, res) => {
    await mongoose.connect(process.env.MONGO_URI);

    // 解析用户身份
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "未授权" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
    } catch (err) {
        return res.status(401).json({ error: "无效令牌" });
    }

    // 处理评分提交
    if (req.method === "POST") {
        const { schoolId, rating, comment } = req.body;
        const review = new Review({ schoolId, rating, comment, userId: req.userId });
        await review.save();
        res.json(review);
    }
};
