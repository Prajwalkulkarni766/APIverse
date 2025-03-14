import { useState, useRef, useEffect } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import axiosInstance from "../axios/axiosInstance";
import axios from "axios";

export default function RequestUI({
  selectedRequest,
  showMethodDropdown,
  setShowMethodDropdown,
  showAuthDropdown,
  setShowAuthDropdown,
  handleUpdateRequestName,
}) {
  // Request section states
  const [requestName, setRequestName] = useState(selectedRequest?.name || "");
  const [url, setUrl] = useState(selectedRequest?.url || "");
  const [activeTab, setActiveTab] = useState("Authorization");
  const [bodyType, setBodyType] = useState(selectedRequest?.bodyType || "none");
  const [bodyData, setBodyData] = useState(selectedRequest?.body || null);
  const [method, setMethod] = useState(selectedRequest?.method || "GET");
  const [authType, setAuthType] = useState(
    selectedRequest.authType || "No Auth"
  );
  const [authToken, setAuthToken] = useState(selectedRequest.authToken || "");
  const [headers, setHeaders] = useState(selectedRequest.headers || []);
  const [file, setFile] = useState(null);

  // Environment variable states
  const [envVariableNames, setEnvVariableNames] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState("");
  const [dataOfSelectedEnv, setDataOfSelectedEnv] = useState([]);

  // Response section states
  const [responseTab, setResponseTab] = useState("Body");
  const [responseBody, setResponseBody] = useState(null);
  const [headersReceivedInResponse, setHeadersReceivedInResponse] = useState(
    []
  );

  // Collapsible section states
  const [isTabsCollapsed, setIsTabsCollapsed] = useState(true);
  const [isResponseCollapsed, setIsResponseCollapsed] = useState(false);

  // Request send button state
  const [sending, setSending] = useState(false);

  // Refs for dropdown containers
  const methodDropdownRef = useRef(null);
  const authDropdownRef = useRef(null);

  // Available HTTP methods
  const httpMethods = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "HEAD",
    "OPTIONS",
  ];

  // Handle clicks outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Close method dropdown if clicked outside
      if (
        methodDropdownRef.current &&
        !methodDropdownRef.current.contains(event.target)
      ) {
        setShowMethodDropdown(false);
      }

      // Close auth dropdown if clicked outside
      if (
        authDropdownRef.current &&
        !authDropdownRef.current.contains(event.target)
      ) {
        setShowAuthDropdown(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowMethodDropdown, setShowAuthDropdown]);

  // Handle Request name changes
  const handleRequestNameChange = (e) => {
    setRequestName(e.target.value);
  };

  // Handle URL changes
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    // You might want to add a callback to parent component if needed
    // onUrlChange(e.target.value);
  };

  // Handle method selection
  const handleMethodSelect = (selectedMethod) => {
    setMethod(selectedMethod);
    setShowMethodDropdown(false);
  };

  // Handle auth selection
  const handleAuthSelect = (selectedAuth) => {
    setAuthType(selectedAuth);
    setShowAuthDropdown(false);
  };

  // Handle token input change
  const handleTokenChange = (e) => {
    setAuthToken(e.target.value);
  };

  // Handle adding a new header
  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  // Handle header key/value changes
  const handleHeaderChange = (index, field, value) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][field] = value;
    setHeaders(updatedHeaders);
  };

  // Handle removing a header
  const removeHeader = (index) => {
    const updatedHeaders = headers.filter((_, i) => i !== index);
    setHeaders(updatedHeaders);
  };

  // Handle file selection for binary body type
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Toggle collapsibility for tabs
  const toggleTabs = () => {
    setIsTabsCollapsed((prev) => !prev);
  };

  // Toggle collapsibility for response
  const toggleResponse = () => {
    setIsResponseCollapsed((prev) => !prev);
  };

  // Save request to server
  const handleSave = async () => {
    console.log(selectedRequest._id);
    try {
      const response = await axiosInstance.patch(
        `/requests/${selectedRequest?._id}/save`,
        {
          name: requestName,
          url: url,
          method: method,
          authType: authType,
          authToken: authToken,
          headers: headers,
          bodyType: bodyType,
          body: bodyType === "raw" ? bodyData : file,
          envId: selectedEnv,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        handleUpdateRequestName(selectedRequest?._id, requestName);
      } else {
        throw new Error("Failed to save request");
      }
    } catch (error) {
      console.error("Error saving request:", error);
    }
  };

  const extractEnvVariableName = (str) => {
    const regex = /\{\{ (.*?) \}\}/;
    const match = str.match(regex);
    return match ? match[1] : null; // Return null if the pattern is not found
  };

  // Send request and save to history
  const handleSend = async () => {
    setSending(true);

    let updatedUrl = url;
    let variable = extractEnvVariableName(url);
    let isFound = false;

    if (variable !== null) {
      dataOfSelectedEnv.variables.forEach((data) => {
        if (variable === data.variable) {
          updatedUrl = url.replace(`{{ ${variable} }}`, data.value);
          isFound = true;
        }
      });
    }

    if (variable && !isFound) {
      alert(
        "Inavlid variable name. Provided variable not found in environment that you have selected"
      );
      return;
    }

    updatedUrl = updatedUrl.replace(/\s+/g, "");
    // setUrl(updatedUrl);

    // Create request configuration based on user inputs
    const config = {
      method: method,
      url: updatedUrl,
      headers: {},
    };

    // Add Authorization if applicable
    if (authType && authType !== "No Auth" && authToken) {
      if (authType === "Bearer Token") {
        config.headers["Authorization"] = `Bearer ${authToken}`;
      } else if (authType === "Basic Auth") {
        config.headers["Authorization"] = `Basic ${btoa(authToken)}`; // You may need to encode user credentials
      } else if (authType === "OAuth 2.0") {
        config.headers["Authorization"] = `Bearer ${authToken}`;
      }
    }

    // Add any custom headers
    headers.forEach((header) => {
      if (header.key && header.value) {
        config.headers[header.key] = header.value;
      }
    });

    // Add body content for POST, PUT, PATCH, etc.
    if (method !== "GET" && bodyType !== "none") {
      if (bodyType === "raw") {
        config.data = bodyData; // Send raw body data
      } else if (bodyType === "binary" && file) {
        const formData = new FormData();
        formData.append("file", file);
        config.data = formData; // Send file data as form-data
      }
    }

    let response = null;
    const startTime = Date.now(); // Record the start time

    // Send the request using axios
    try {
      response = await axios(config);

      // Calculate response time
      const responseTime = Date.now() - startTime;

      // Get the response size (in bytes)
      const responseSize = new TextEncoder().encode(
        JSON.stringify(response.data)
      ).length;

      // Parse response body based on content type
      let parsedResponseBody = response.data;
      const contentType = response.headers["content-type"];

      if (contentType.includes("application/json")) {
        // Handle JSON response
        parsedResponseBody = JSON.stringify(response.data, null, 2);
      } else if (contentType.includes("text/html")) {
        // Handle HTML response
        parsedResponseBody = response.data;
      } else if (
        contentType.includes("application/xml") ||
        contentType.includes("text/xml")
      ) {
        // Handle XML response
        parsedResponseBody = response.data;
      } else if (contentType.includes("text/plain")) {
        // Handle plain text response
        parsedResponseBody = response.data;
      } else if (contentType.includes("text/csv")) {
        // Handle CSV response
        parsedResponseBody = response.data;
      } else {
        // Handle other content types
        parsedResponseBody = response.data;
      }

      // Set the response body
      setResponseBody(parsedResponseBody);

      // Handle headers
      setHeadersReceivedInResponse(
        Object.entries(response.headers).map(([key, value]) => ({
          key: key,
          value: value,
        }))
      );

      // Determine status ("success" or "error")
      const status =
        response.status >= 200 && response.status < 300 ? "SUCCESS" : "ERROR";

      // Post to history
      await axiosInstance.post("/history", {
        method,
        url: updatedUrl,
        statusCode: response.status,
        status,
        responseTime,
        responseSize,
      });
    } catch (error) {
      console.error("Error sending request:", error);

      setResponseBody(error.message);
      setHeadersReceivedInResponse([]);

      // Handle any error that occurs during the request
      await axiosInstance.post("/history", {
        method,
        url: updatedUrl,
        statusCode: error.response ? error.response.status : null,
        status: "ERROR", // If request failed, store "error"
        responseTime: Date.now() - startTime, // Handle response time
        responseSize: 0, // Set response size to 0 if error occurred
      });
    } finally {
      setSending(false);
    }
  };

  // Fetch environment variable names
  const fetchEnvVariableNames = async () => {
    try {
      const envVariableName = await axiosInstance.get("/environments/name");
      setEnvVariableNames(envVariableName.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle change in the dropdown selection and fetch sub env variables according to selection
  const handleEnvChange = async (e) => {
    e.preventDefault();
    setSelectedEnv(e.target.value);
    try {
      const envData = await axiosInstance(
        `/environments/detail/${e.target.value}`
      );
      setDataOfSelectedEnv(envData.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEnvVariableNames();
    if (selectedRequest.envId) {
      setSelectedEnv(selectedRequest?.envId);
    }
  }, []);

  return (
    <div>
      <div className="flex mb-3">
        <input
          type="text"
          value={requestName}
          onChange={handleRequestNameChange}
          className=" px-4 py-2 border border-gray-200 rounded-md focus:outline-none"
        />

        <button
          className="px-4 py-2 border border-[#FF6C37] text-[#FF6C37] rounded-md ml-auto cursor-pointer"
          onClick={handleSave}
        >
          Save All Changes
        </button>
      </div>

      {/* Request Section */}
      <div className="flex items-center gap-2 mb-5">
        {/* Method Dropdown */}
        <div className="relative" ref={methodDropdownRef}>
          <button
            onClick={() => setShowMethodDropdown(!showMethodDropdown)}
            className="w-24 px-4 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between cursor-pointer"
          >
            {method}
            <span className="text-xs">▼</span>
          </button>

          {/* Method Dropdown Menu */}
          {showMethodDropdown && (
            <div className="absolute left-0 top-full mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {httpMethods.map((httpMethod) => (
                <button
                  key={httpMethod}
                  onClick={() => handleMethodSelect(httpMethod)}
                  className="w-full text-left px-4 py-2 hover:bg-[#FF6C37] hover:text-white  cursor-pointer"
                >
                  {httpMethod}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* URL Input */}
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-md"
        />

        {/* Send Button */}
        <button
          className={`px-6 py-2 rounded-md cursor-pointer ${
            sending
              ? "border border-[#FF6C37] text-[#FF6C37]"
              : "text-white hover:bg-[#ff5719] bg-[#FF6C37]"
          }  `}
          onClick={handleSend}
          disabled={sending}
        >
          {sending ? "Sending" : "Send"}
        </button>
      </div>

      {/* Tabs */}
      <div className="rounded-md mb-5">
        <div className="flex px-4 py-2 bg-gray-50 border-b border-gray-200">
          <p>Request</p>

          <button
            className={`px-4 pb-2 ml-auto align-end text-gray-500 cursor-pointer`}
            onClick={toggleTabs}
          >
            {isTabsCollapsed ? <BsChevronUp /> : <BsChevronDown />}
          </button>
        </div>
        {isTabsCollapsed && (
          <div className="min-h-68">
            <div className="border-b border-gray-200">
              <div className="flex gap-4 mt-2">
                {["Authorization", "Headers", "Body", "Env in url"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 pb-2 -mb-px cursor-pointer ${
                        activeTab === tab
                          ? "border-b-2 border-[#FF6C37] text-[#FF6C37]"
                          : "text-gray-500"
                      }`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === "Body" && (
                <div>
                  <div className="flex gap-4 mb-4">
                    {["none", "raw", "binary"].map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="bodyType"
                          checked={bodyType === type}
                          onChange={() => setBodyType(type)}
                          className="text-[#FF6C37]"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                  {bodyType === "raw" && (
                    <textarea
                      value={bodyData}
                      className="w-full h-40 p-4 border border-gray-200 rounded-md"
                      placeholder="Enter request body"
                      onChange={(e) => setBodyData(e.target.value)}
                    />
                  )}

                  {/* New section for binary file input */}
                  {bodyType === "binary" && (
                    <div className="mt-4">
                      <label className="block mb-2">Select file</label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="px-4 py-2 border border-gray-200 rounded-md w-full"
                      />
                      {file && (
                        <p className="mt-2 text-sm text-gray-500">
                          Selected file: {file.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Headers UI goes here */}
              {activeTab === "Headers" && (
                <div>
                  <div>
                    {headers.map((header, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Header Key"
                          value={header.key}
                          onChange={(e) =>
                            handleHeaderChange(index, "key", e.target.value)
                          }
                          className="px-4 py-2 border border-gray-200 rounded-md w-1/2"
                        />
                        <input
                          type="text"
                          placeholder="Header Value"
                          value={header.value}
                          onChange={(e) =>
                            handleHeaderChange(index, "value", e.target.value)
                          }
                          className="px-4 py-2 border border-gray-200 rounded-md w-1/2"
                        />
                        <button
                          onClick={() => removeHeader(index)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addHeader}
                      className="bg-[#FF6C37] text-white px-4 py-2 rounded mt-4 cursor-pointer"
                    >
                      Add Header
                    </button>
                  </div>
                </div>
              )}

              {/* Authorization UI goes here */}
              {activeTab === "Authorization" && (
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2">Type</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-200 rounded-md"
                        value={authType}
                        onChange={(e) => handleAuthSelect(e.target.value)}
                      >
                        <option className="hover:bg-[#FF6C37] hover:text-white">
                          No Auth
                        </option>
                        <option className="hover:bg-[#FF6C37] hover:text-white">
                          Bearer Token
                        </option>
                        <option className="hover:bg-[#FF6C37] hover:text-white">
                          Basic Auth
                        </option>
                        <option className="hover:bg-[#FF6C37] hover:text-white">
                          OAuth 2.0
                        </option>
                      </select>
                    </div>
                  </div>

                  {(authType === "Bearer Token" ||
                    authType === "Basic Auth" ||
                    authType === "OAuth 2.0") && (
                    <div className="mt-2">
                      <label className="block mb-2">Token</label>
                      <input
                        type="text"
                        value={authToken}
                        onChange={handleTokenChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-md"
                        placeholder="Enter token"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab == "Env in url" && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2">Type</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-200 rounded-md"
                        value={selectedEnv}
                        onChange={handleEnvChange}
                      >
                        <option value="">Select Environment Variable</option>
                        {envVariableNames.map((envName, index) => (
                          <option key={index} value={envName._id}>
                            {envName.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Response Section */}
      <div className="rounded-md">
        <div className="flex px-4 py-2 bg-gray-50 border-b border-gray-200">
          <p>Response</p>

          <button
            className={`px-4 pb-2 ml-auto align-end text-gray-500 cursor-pointer`}
            onClick={toggleResponse}
          >
            {isResponseCollapsed ? <BsChevronUp /> : <BsChevronDown />}
          </button>
        </div>

        {isResponseCollapsed && (
          <div className="p-4">
            <div className="flex gap-4 mb-4">
              {["Body", "Headers"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setResponseTab(tab)}
                  className={`px-4 py-1 rounded-md cursor-pointer ${
                    responseTab === tab ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {responseTab === "Body" && (
              <div>
                <textarea
                  readOnly
                  className="w-full h-40 p-4 border border-gray-200 rounded-md bg-gray-50"
                  placeholder="Response will appear here"
                  value={responseBody}
                />
              </div>
            )}

            {responseTab === "Headers" && (
              <div>
                <table className="w-full border-collapse mt-4">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2 text-left">Key</th>
                      <th className="px-4 py-2 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {headersReceivedInResponse.map((header, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-4 py-2">{header.key}</td>
                        <td className="px-4 py-2">{header.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
