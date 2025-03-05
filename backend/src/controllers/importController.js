const Collection = require("../models/Collection");
const Request = require("../models/Request");
const fs = require("fs");
const path = require("path");

// Import the collection
const importCollection = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Read the uploaded JSON file
  const filePath = path.join(__dirname, "../uploads", req.file.filename);

  try {
    // Use fs.promises.readFile instead of the callback version
    const data = await fs.promises.readFile(filePath, "utf8");

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseError) {
      // If JSON parsing fails, delete the file and return the error response
      await fs.promises.unlink(filePath);
      return res.status(400).json({ message: "Invalid JSON format." });
    }

    // Add userId to jsonData
    jsonData.userId = req.user.id;

    new Collection(jsonData).save();

    // Delete the file after processing (optional cleanup)
    await fs.promises.unlink(filePath);

    res.status(200).json({
      message: "File processed and data saved successfully.",
    });
  } catch (err) {
    // Handle any errors that occur during reading the file, database operations, or file deletion
    console.error("Error processing file:", err);
    if (err.code === "ENOENT") {
      return res.status(500).json({ message: "Failed to read file." });
    }
    await fs.promises.unlink(filePath); // Make sure to delete the file if an error occurs
    res.status(500).json({ message: "Failed to process file." });
  }
};

// Import the request
const importRequest = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Read the uploaded JSON file
  const filePath = path.join(__dirname, "../uploads", req.file.filename);

  try {
    // Use fs.promises.readFile instead of the callback version
    const data = await fs.promises.readFile(filePath, "utf8");

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseError) {
      // If JSON parsing fails, delete the file and return the error response
      await fs.promises.unlink(filePath);
      return res.status(400).json({ message: "Invalid JSON format." });
    }

    const { collectionId } = req.body;
    const { id } = req.user;

    // Iterate over each object in jsonData and add userId and collectionId
    jsonData.forEach((data) => {
      data.collectionId = collectionId;
      data.userId = id;
    });

    // Insert the data into the database
    try {
      await Request.insertMany(jsonData); // Wait for insertion to complete
    } catch (insertError) {
      console.error("Error saving data:", insertError);
      await fs.promises.unlink(filePath); // Make sure to delete the file if an error occurs
      return res
        .status(500)
        .json({ message: "Failed to save data to the database." });
    }

    // Delete the file after processing (optional cleanup)
    try {
      await fs.promises.unlink(filePath);
    } catch (unlinkErr) {
      console.error("Error deleting file:", unlinkErr);
    }

    res.status(200).json({
      message: "File processed and data saved successfully.",
    });
  } catch (err) {
    // Handle any errors that occur during reading the file, database operations, or file deletion
    console.error("Error processing file:", err);
    if (err.code === "ENOENT") {
      return res.status(500).json({ message: "Failed to read file." });
    }
    try {
      await fs.promises.unlink(filePath); // Make sure to delete the file if an error occurs
    } catch (unlinkErr) {
      console.error("Error deleting file:", unlinkErr);
    }
    res.status(500).json({ message: "Failed to process file." });
  }
};

// Import both collection and requests
const importBoth = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Read the uploaded JSON file
  const filePath = path.join(__dirname, "../uploads", req.file.filename);

  try {
    // Use fs.promises.readFile to read the file asynchronously
    const data = await fs.promises.readFile(filePath, "utf8");

    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (parseError) {
      // If JSON parsing fails, delete the file and return an error response
      await fs.promises.unlink(filePath);
      return res.status(400).json({ message: "Invalid JSON format." });
    }

    // Extract collection and requests data
    const { collection, requests } = parsedData;
    if (!collection || !requests || !Array.isArray(requests)) {
      await fs.promises.unlink(filePath); // Cleanup the file
      return res.status(400).json({ message: "Invalid data format." });
    }

    // Add userId to the collection data
    collection.userId = req.user.id;

    // Create and save the collection
    const newCollection = new Collection(collection);
    await newCollection.save();

    // Prepare requests data by adding collectionId and userId to each request
    const { id } = req.user;
    const requestsWithIds = requests.map((reqData) => ({
      ...reqData,
      collectionId: newCollection._id, // Add the newly created collection's ID
      userId: id, // Add the user ID
    }));

    // Insert all the requests into the database
    await Request.insertMany(requestsWithIds);

    // Delete the uploaded file after processing (optional cleanup)
    try {
      await fs.promises.unlink(filePath);
    } catch (unlinkErr) {
      console.error("Error deleting file:", unlinkErr);
    }

    res.status(200).json({
      message: "Collection and requests processed and saved successfully.",
    });
  } catch (err) {
    // Handle any errors that occur during file reading, JSON parsing, or database operations
    console.error("Error processing file:", err);
    try {
      await fs.promises.unlink(filePath); // Make sure to delete the file if an error occurs
    } catch (unlinkErr) {
      console.error("Error deleting file:", unlinkErr);
    }
    res.status(500).json({ message: "Failed to process file." });
  }
};

module.exports = { importCollection, importRequest, importBoth };
