const Collection = require("../models/Collection");
const Request = require("../models/Request");

// Export the collection
const exportCollection = async (req, res) => {
  const { collectionId } = req.params;

  try {
    const collection = await Collection.findById(collectionId).select(
      "-userId -sharedWith -createdAt -updatedAt -_id"
    );

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    let fileName = Math.floor(Math.random());

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}.json`
    );
    res.status(200).send(JSON.stringify(collection));
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to export collection", error: err.message });
  }
};

// Export the request
const exportRequests = async (req, res) => {
  const { collectionId } = req.params;

  try {
    const requests = await Request.find({ collectionId }).select(
      "-userId -createdAt -updatedAt -_id -collectionId"
    );

    if (!requests) {
      return res.status(204).json({ message: "Collection is empty" });
    }

    let fileName = Math.floor(Math.random());

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}.json`
    );
    res.status(200).send(JSON.stringify(requests));
  } catch (error) {}
};

// Export both the collection and its requests
const exportBoth = async (req, res) => {
  const { collectionId } = req.params;

  try {
    // Fetch the collection and its associated requests
    const collection = await Collection.findById(collectionId).select(
      "-_id -userId -sharedWith -createdAt -updatedAt"
    );
    const requests = await Request.find({ collectionId }).select(
      "-userId -createdAt -updatedAt -_id  -collectionId"
    );

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const dataToExport = {
      collection: collection,
      requests: requests,
    };

    let fileName = Math.floor(Math.random());

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}_with_requests.json`
    );
    res.setHeader("filename", `${fileName}_with_requests.json`);
    res.status(200).send(JSON.stringify(dataToExport));
  } catch (err) {
    res.status(500).json({
      message: "Failed to export both collection and requests",
      error: err.message,
    });
  }
};

module.exports = { exportCollection, exportRequests, exportBoth };
