const User = require("../models/User");

// Search user according to email address starting with a given string
const searchUser = async (req, res) => {
  const { emailAddress } = req.params;

  try {
    // Use regex to search for emails that start with the provided string
    const users = await User.find({
      email: { $regex: `^${emailAddress}`, $options: "i" }, // `^` means start with and `i` means case insensitive
    }).select("-password -createdAt -updatedAt -__v");

    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

module.exports = { searchUser };
