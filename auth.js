const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

const SECRET_KEY = "your_secret_key"; // 推荐用环境变量存储

module.exports = async (req, res) => {
    await mongoose.connect(process.env.MONGO_URI);
    
    if (req.method === "POST") {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "用户不存在" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "密码错误" });

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({ token });
    }
};
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB 连接成功"))
    .catch(err => console.error("MongoDB 连接失败:", err));
