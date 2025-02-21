const Environment = require("../models/Environment");
const History = require("../models/History");

const executeRequest = async (req, res) => {
  const { method, url, headers, body, environmentId } = req.body;

  try {
    // Fetch the environment variables if `environmentId` is provided
    let resolvedHeaders = headers;
    let resolvedBody = body;
    if (environmentId) {
      const environment = await Environment.findById(environmentId);

      if (environment) {
        const variables = environment.variables;

        // Replace placeholders in URL
        const resolvedUrl = url.replace(/\{\{(.*?)\}\}/g, (_, key) => variables[key.trim()] || "");

        // Replace placeholders in headers
        resolvedHeaders = Object.fromEntries(
          Object.entries(headers).map(([key, value]) => [
            key,
            value.replace(/\{\{(.*?)\}\}/g, (_, key) => variables[key.trim()] || ""),
          ])
        );

        // Replace placeholders in body (if it's JSON)
        if (typeof body === "object") {
          resolvedBody = JSON.parse(
            JSON.stringify(body).replace(/\{\{(.*?)\}\}/g, (_, key) => variables[key.trim()] || "")
          );
        }

        req.body.url = resolvedUrl; // Update the request URL
      }
    }

    // Execute the HTTP request using axios
    const axiosConfig = {
      method,
      url: req.body.url,
      headers: resolvedHeaders,
      data: resolvedBody,
    };

    const response = await axios(axiosConfig);
    const status = (response.status >= 200 && response.status < 300) ? 'SUCCESS' : 'FAILURE';
    
    // Save history

    const history = new History({
      userId: req.user.id,
      method,
      url: req.body.url,
      statusCode: response.status,
      status: status,
      headers: resolvedHeaders,
      body: resolvedBody,
      responseSize: Buffer.byteLength(JSON.stringify(response.data), 'utf8')
    });

    await history.save();

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Request execution failed", error: err.message });
  }
};

module.exports = { executeRequest }