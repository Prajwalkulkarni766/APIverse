const Request = require("../models/Request");

const createRequest = async (req, res) => {
  try {
    const { method, url, headers, body, params, collectionId } = req.body;

    const request = new Request({ method, url, headers, body, params, collectionId });
    await request.save();

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRequestsByCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;

    const requests = await Request.find({ collectionId });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await Request.findByIdAndDelete(id);

    res.status(200).json({ message: "Request deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createRequest, getRequestsByCollection, deleteRequest };
