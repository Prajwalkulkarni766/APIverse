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

const aboutUser = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id).select(
      "-password -createdAt -updatedAt -__v"
    );

    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user profile", error: err.message });
  }
};

const updateUserData = async (req, res) => {
  const { email, firstName, lastName } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email || user.email;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    await user.save();

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user });
  } catch (err) {
    return res.status(500).json({ message: "Error updating user data" });
  }
};

module.exports = { searchUser, aboutUser, updateUserData };
