import User from "../user/model.js"


module.exports.applyAuthor = async (req, res) =>{
    const { userId } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, { isAuthor: true }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};