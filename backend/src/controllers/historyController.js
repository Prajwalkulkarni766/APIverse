const History = require("../models/History");

const getHistory = async (req, res) => {
  try {

    // console.log("Params: ", req.params);
    console.log("Query: ", req.query)

    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;  // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10;  // Default to 10 items per page
    const search = req.query.search || ''; // Search query
    const statusFilter = req.query.status && req.query.status !== 'ALL' ? req.query.status : null;
    const methodFilter = req.query.method && req.query.method !== 'ALL' ? req.query.method : null;

    // Build filter conditions
    const filterConditions = { userId };

    if (search) {
      filterConditions.url = { $regex: search, $options: 'i' };
    }
    if (statusFilter) {
      filterConditions.status = statusFilter;
    }
    if (methodFilter) {
      filterConditions.method = methodFilter;
    }

    // Get total count
    const total = await History.countDocuments(filterConditions);

    // Fetch paginated data
    const history = await History.find(filterConditions)
      .sort({ createdAt: -1 })  // Sort by latest entry
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      history,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteAllHistory = async (req, res) => {
  try {
    await History.deleteMany();
    res.status(200).json({ message: "History deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete history", error: err.message });
  }
};

const deleteHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const history = await History.findById(id);

    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    await history.deleteOne();
    res.status(200).json({ message: "History deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete history", error: err.message });
  }
};

const searchHistory = async (req, res) => {
  const { query } = req.query;
  const userId = req.user.id;

  try {
    const history = await History.find({
      userId,
      $or: [
        { url: { $regex: query, $options: "i" } },
        { method: { $regex: query, $options: "i" } },
        { statusCode: { $regex: query, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to search history", error: err.message });
  }
};


module.exports = { getHistory, deleteHistory, searchHistory, deleteAllHistory };