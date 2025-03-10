const Environment = require("../models/Environment");

const createEnvironment = async (req, res) => {
  const { name, variables } = req.body;
  const userId = req.user.id;

  try {
    const newEnvironment = new Environment({
      name,
      variables,
      userId,
    });

    await newEnvironment.save();
    res.status(201).json(newEnvironment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create environment", error: err.message });
  }
};

const getAllEnvironments = async (req, res) => {
  const userId = req.user.id;

  try {
    const environments = await Environment.find({ userId });
    res.status(200).json(environments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch environments", error: err.message });
  }
};

const getEnvironmentsName = async (req, res) => {
  const userId = req.user.id;

  try {
    const environments = await Environment.find({ userId }).select("_id name");
    res.status(200).json(environments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch environments", error: err.message });
  }
};

const getEnvironmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const environment = await Environment.findById(id);

    if (!environment) {
      return res.status(404).json({ message: "Environment not found" });
    }

    res.status(200).json(environment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch environment", error: err.message });
  }
};

const getEnvironmentDetailById = async (req, res) => {
  const { id } = req.params;

  try {
    const environment = await Environment.findById(id).select("variables");

    if (!environment) {
      return res.status(404).json({ message: "Environment not found" });
    }

    res.status(200).json(environment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch environment", error: err.message });
  }
};

const updateEnvironment = async (req, res) => {
  const { id } = req.params;
  const { name, variables } = req.body;

  try {
    const environment = await Environment.findById(id);

    if (!environment) {
      return res.status(404).json({ message: "Environment not found" });
    }

    environment.name = name || environment.name;
    environment.variables = variables || environment.variables;

    await environment.save();

    res.status(200).json(environment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update environment", error: err.message });
  }
};

const deleteEnvironment = async (req, res) => {
  const { id } = req.params;

  try {
    const environment = await Environment.findById(id);

    if (!environment) {
      return res.status(404).json({ message: "Environment not found" });
    }

    await environment.deleteOne();
    res.status(200).json({ message: "Environment deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete environment", error: err.message });
  }
};

module.exports = {
  createEnvironment,
  getAllEnvironments,
  getEnvironmentById,
  updateEnvironment,
  deleteEnvironment,
  getEnvironmentsName,
  getEnvironmentDetailById,
};
