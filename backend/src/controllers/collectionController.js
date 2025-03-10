const Collection = require("../models/Collection");
const Request = require("../models/Request");
const User = require("../models/User");

// Create a new collection
const createCollection = async (req, res) => {
  const { name, description, requests } = req.body;
  const userId = req.user.id;

  try {
    const newCollection = new Collection({
      userId,
      name,
      description,
      requests,
    });

    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create collection", error: err.message });
  }
};

// Get all collections for a user
const getCollections = async (req, res) => {
  const userId = req.user.id;

  try {
    const collections = await Collection.find({ userId });
    res.status(200).json(collections);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch collections", error: err.message });
  }
};

// Get all collections for a user with name and id
const getCollectionsName = async (req, res) => {
  const userId = req.user.id;

  try {
    const collections = await Collection.find({ userId }).select("name");
    res.status(200).json(collections);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch collections", error: err.message });
  }
};

// Get particular collection
const getCollectionById = async (req, res) => {
  const { collectionId } = req.params;

  try {
    const collection = await Collection.findById(collectionId);

    if (
      collection &&
      collection?.sharedWith &&
      collection.sharedWith.length > 0
    ) {
      // Get the user IDs from the sharedWith array
      const userIds = collection.sharedWith;

      // Fetch user details (firstName and lastName) for each user
      const users = await User.find({ _id: { $in: userIds } }).select("firstName lastName");

      collection.sharedWith = users;
    }

    const requests = await Request.find({ collectionId: collection._id });
    res.status(200).json({ collection, requests });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch collection", error: err.message });
  }
};

// Get collection requests name
const getCollectionRequestName = async (req, res) => {
  const { collectionId } = req.params;

  try {
    const collection =
      await Collection.findById(collectionId).select("requests");

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Extract only the 'name' and 'method' from each request
    const requests = collection.requests.map((request) => ({
      name: request.name,
      method: request.method,
    }));

    res.status(200).json(requests);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch requests", error: err.message });
  }
};

// Add a request to an existing collection
const addRequestToCollection = async (req, res) => {
  const { collectionId } = req.params;
  const { method, url, headers, body } = req.body;

  try {
    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    collection.requests.push({ method, url, headers, body });
    await collection.save();

    res
      .status(200)
      .json({ message: "Request added to collection", collection });
  } catch (err) {
    res.status(500).json({
      message: "Failed to add request to collection",
      error: err.message,
    });
  }
};

// Delete a collection
const deleteCollection = async (req, res) => {
  const { collectionId } = req.params;

  try {
    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    await collection.deleteOne();
    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete collection", error: err.message });
  }
};

const duplicateCollection = async (req, res) => {
  const { collectionId } = req.params;

  try {
    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const duplicatedCollection = new Collection({
      userId: req.user.id,
      name: `${collection.name} (Copy)`,
      description: collection.description,
      requests: collection.requests,
    });

    await duplicatedCollection.save();
    res.status(201).json(duplicatedCollection);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to duplicate collection", error: err.message });
  }
};

const shareCollection = async (req, res) => {
  const { collectionId } = req.params;
  const { sharedWithUserId } = req.body;

  try {
    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    if (collection.sharedWith.includes(sharedWithUserId)) {
      return res
        .status(400)
        .json({ message: "User is already a collaborator" });
    }

    collection.sharedWith.push(sharedWithUserId);
    await collection.save();

    res
      .status(200)
      .json({ message: "Collection shared successfully", collection });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to share collection", error: err.message });
  }
};

const searchAndFilterCollections = async (req, res) => {
  const { query, shared, startDate, endDate } = req.query;

  try {
    const filter = { userId: req.user.id };

    if (query) {
      filter.name = { $regex: query, $options: "i" };
    }

    if (shared === "true") {
      filter.sharedWith = { $exists: true, $not: { $size: 0 } };
    } else if (shared === "false") {
      filter.sharedWith = { $size: 0 };
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const collections = await Collection.find(filter).sort({ createdAt: -1 });

    res.status(200).json(collections);
  } catch (err) {
    res.status(500).json({
      message: "Failed to search and filter collections",
      error: err.message,
    });
  }
};

// Update the collection
const updateTheCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { name, description, requests, sharedWith } = req.body;

    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    if (name) collection.name = name;
    if (description) collection.description = description;
    if (requests) collection.requests = requests;
    if (sharedWith) collection.sharedWith = sharedWith;

    const updatedCollection = await collection.save();

    res.status(200).json(updatedCollection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCollection,
  getCollections,
  addRequestToCollection,
  deleteCollection,
  duplicateCollection,
  shareCollection,
  searchAndFilterCollections,
  getCollectionsName,
  getCollectionById,
  getCollectionRequestName,
  updateTheCollection,
};
