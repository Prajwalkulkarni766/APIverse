const Request = require("../models/Request");

const createRequest = async (req, res) => {
  try {
    const { method, url, headers, body, params, collectionId } = req.body;

    const request = new Request({
      method,
      url,
      headers,
      body,
      params,
      collectionId,
    });
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

const toggleFavorite = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.favorite = !request.favorite;
    await request.save();

    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createBlankRequest = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;

    const request = await new Request({
      collectionId: collectionId,
      userId: req.user.id,
    }).save();

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    await Request.findByIdAndUpdate(requestId, req.body);

    res.status(200).json({ msg: "updated" });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createRequest,
  getRequestsByCollection,
  deleteRequest,
  toggleFavorite,
  getRequestById,
  createBlankRequest,
  updateRequest,
};
