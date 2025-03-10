import { useState, useEffect, useRef } from "react";
import axiosInstance from "../axios/axiosInstance";
import RequestUI from "../components/RequestUI";
import CreateCollectionUI from "../components/CreateCollectionUI";
import TabItem from "../components/TabItem";
import { BsCloudDownload } from "react-icons/bs";

export default function Home() {
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [tabs, setTabs] = useState([]); // State to manage tabs
  const [activeTabId, setActiveTabId] = useState(null); // State to track active tab
  const [selectedOption, setSelectedOption] = useState("Collection"); // State to track export option
  const [selectedFile, setSelectedFile] = useState(null); // State to manage selected file for importing request
  const [userList, setUserList] = useState([]); // State to manage display of user list
  const [emailInput, setEmailInput] = useState(""); // State to manage email address entered by user for adding other users into collection
  const [searchResults, setSearchResults] = useState(null); // State to manage search result

  // Create a reference to the file input element to trigger it programmatically
  const fileInputRef = useRef(null);

  // Fetch collections
  const fetchCollections = async () => {
    try {
      const response = await axiosInstance.get("/collections/collection-name");
      setCollections(response.data);
    } catch (error) {
      console.error("Error fetching collections", error);
    }
  };

  // Handle request click - Updated to create a new tab
  const handleRequestClick = (request, collectionId) => {
    const newTab = {
      id: `request-${request._id || Date.now()}`, // Unique ID for the tab
      type: "request",
      data: request,
      label: request.name || `${request.method} Request`, // Tab label
      collectionId: collectionId, // Store the parent collection ID for context
    };

    // Check if the tab already exists
    const existingTab = tabs.find((tab) => tab.id === newTab.id);
    if (!existingTab) {
      setTabs((prevTabs) => [...prevTabs, newTab]); // Add new tab
    }
    setActiveTabId(newTab.id); // Set the new tab as active
  };

  // Fetch collection details
  const fetchCollectionDetails = async (id) => {
    try {
      const response = await axiosInstance.get(`/collections/${id}`);
      return response.data; // Return the fetched collection
    } catch (error) {
      console.error("Error fetching collection details", error);
    }
  };

  // Handle tab close
  const handleTabClose = (id) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id)); // Remove the tab
    if (activeTabId === id) {
      // Switch to another tab if available
      if (tabs.length > 1) {
        const otherTabs = tabs.filter((tab) => tab.id !== id);
        setActiveTabId(otherTabs[0].id);

        // If the active tab is a collection, sync its data
        const nextTab = otherTabs[0];
        if (nextTab.type === "collection") {
          setCollectionName(nextTab.data.name);
          setCollectionDescription(nextTab.data.description);
        }
      } else {
        setActiveTabId(null);
      }
    }
  };

  // Handle collection click (add a new tab)
  const handleCollectionClick = async (id) => {
    const collection = await fetchCollectionDetails(id);

    if (collection) {
      const newTab = {
        id: `collection-${id}`, // Unique ID for the tab
        type: "collection",
        data: collection, // The response is now the entire collection object
        label: collection.collection.name, // Tab label
        isEditing: false, // Track editing state per tab
      };

      // Check if the tab already exists
      const existingTab = tabs.find((tab) => tab.id === newTab.id);
      if (!existingTab) {
        setTabs((prevTabs) => [...prevTabs, newTab]); // Add new tab
      }
      setActiveTabId(newTab.id); // Set the new tab as active
      setCollectionName(collection.collection.name); // Sync collection name
      setCollectionDescription(collection.collection.description); // Sync collection description
    }
  };

  // Handle tab switch
  const handleTabSwitch = (id) => {
    setActiveTabId(id); // Set the clicked tab as active
    const activeTab = tabs.find((tab) => tab.id === id);

    // Ensure we are syncing the values with the active tab
    if (activeTab && activeTab.type === "collection") {
      setCollectionName(activeTab.data.collection.name); // Sync collection name from active tab
      setCollectionDescription(activeTab.data.collection.description); // Sync collection description from active tab
    }
  };

  // Get the active tab's data
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const handleSaveChanges = async () => {
    try {
      const updatedCollection = {
        name: collectionName,
        description: collectionDescription,
        sharedWith: activeTab.data.sharedWith,
      };

      // Save the updated collection
      await axiosInstance.put(
        `/collections/${activeTab.data.collection._id}`,
        updatedCollection
      );

      // Update the tab's data and disable editing
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeTabId
            ? {
                ...tab,
                data: {
                  ...tab.data,
                  collection: {
                    ...tab.data.collection,
                    name: collectionName,
                    description: collectionDescription,
                    sharedWith: activeTab.data.sharedWith,
                  },
                },
                label: collectionName, // Update the tab label
                isEditing: false,
              }
            : tab
        )
      );

      // Update the collections state (left sidebar)
      setCollections((prevCollections) =>
        prevCollections.map((collection) =>
          collection._id === activeTab.data.collection._id
            ? {
                ...collection,
                name: collectionName,
                description: collectionDescription,
              }
            : collection
        )
      );

      // Force update active tab UI
      setActiveTabId(activeTabId); // Trigger a re-render of the active tab
      alert("Collection updated successfully!");
    } catch (error) {
      console.error("Error saving collection changes", error);
    }
  };

  // Filter collections based on search term
  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle creating a new collection and adding it as a tab
  const handleCreateNewCollectionTab = () => {
    const newTab = {
      id: "create-collection", // Unique ID for the creation tab
      type: "create-collection",
      label: "Create New Collection", // Tab label
    };

    // Add a new tab for creating a collection
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setActiveTabId(newTab.id); // Set this tab as active
  };

  // Handle creating a new collection
  const handleSaveNewCollection = async (collectionData) => {
    try {
      await axiosInstance.post("/collections", collectionData);
      fetchCollections();
      setTabs((prevTabs) =>
        prevTabs.filter((tab) => tab.id !== "create-collection")
      ); // Remove the "Create Collection" tab
      alert("Collection created successfully!");
    } catch (error) {
      console.error("Error creating new collection", error);
      alert("Problem while creating collection");
    }
  };

  // Handle canceling collection creation
  const handleCancelCollection = () => {
    setTabs((prevTabs) =>
      prevTabs.filter((tab) => tab.id !== "create-collection")
    ); // Remove the "Create Collection" tab
  };

  // Fetch collections on mount
  useEffect(() => {
    fetchCollections();
  }, []);

  // Add new request to collection
  const handleAddNewRequest = async () => {
    try {
      // Call the API to create a blank request
      const response = await axiosInstance.post(
        `/requests/${activeTab.data.collection._id}`
      );

      // Create a new tab with the received request data
      const newRequest = response.data;

      const newTab = {
        id: `request-${newRequest._id}`,
        type: "request",
        data: newRequest,
        label: newRequest.name || `${newRequest.method} Request`,
        collectionId: activeTab.data.collection._id, // Assuming you want it in the current collection
      };

      const existingTab = tabs.find((tab) => tab.id === newTab.id);
      if (!existingTab) {
        setTabs((prevTabs) => [...prevTabs, newTab]); // Add new tab
      }
      setActiveTabId(newTab.id); // Set the new tab as active
    } catch (error) {
      console.error("Error creating blank request", error);
    }
  };

  // Delete request from collection
  const handleDeleteRequest = async (requestId) => {
    try {
      // Sending request to delete
      await axiosInstance.delete(`/requests/${requestId}`);

      // Remove the deleted request from the collection's list
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeTabId
            ? {
                ...tab,
                data: {
                  ...tab.data,
                  requests: tab.data.requests.filter(
                    (request) => request._id !== requestId
                  ),
                },
              }
            : tab
        )
      );
    } catch (error) {
      console.error("Error deleting request", error);
    }
  };

  // Updating request name
  const handleUpdateRequestName = async (id, name) => {
    // Once the API responds successfully, update the tab label
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === `request-${id}`
          ? { ...tab, label: name } // Update the tab label
          : tab
      )
    );

    setActiveTabId(`request-${_id}`); // Ensure the active tab stays active
  };

  // Export the data
  const handleExport = async (collectionId) => {
    try {
      let url = ""; // Initialize the URL variable

      // Check the selectedOption state and set the URL accordingly
      if (selectedOption === "Collection") {
        url = `/export/collection/${collectionId}`;
      } else if (selectedOption === "Requests") {
        url = `export/request/${collectionId}`;
      } else if (selectedOption === "Both") {
        url = `/export/both/${collectionId}`;
      }

      if (!url) {
        alert("Invalid option selected for export");
        return;
      }

      // Send the API request to the determined URL
      const response = await axiosInstance.get(url, { responseType: "blob" });

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: "application/json" });

      let fileName = Math.floor(Math.random() * 1000000);
      fileName += "-" + new Date().toISOString();
      fileName = fileName.replace(".", "-");

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.json`;
      link.click();

      alert("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting data", error);
      alert("Problem while exporting data");
    }
  };

  // Handle the file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
      handleImportFile();
    } else {
      alert("Please select a valid JSON file.");
    }
  };

  // Handle Import Requests - Send request to /import/request with selected JSON file
  const handleImportRequests = async () => {
    // Trigger the file input dialog when the user clicks on "Import Requests"
    fileInputRef.current.click();
  };

  // Handle file selection and import request
  const handleImportFile = async () => {
    if (!selectedFile) {
      alert("Please select a JSON file to import.");
      return;
    }

    // console.log("file imported successfully");
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("collectionId", activeTab.data.collection._id);

    try {
      await axiosInstance.post("/import/request", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSelectedFile(null);
      alert("Import operation successfully executed");
    } catch (error) {
      console.error("Error importing requests:", error);
      alert("Problem while importing file");
    }
  };

  // Handle email input change
  const handleEmailChange = async (e) => {
    const value = e.target.value;
    setEmailInput(value);

    if (value.trim() !== "") {
      try {
        const users = await axiosInstance.get(`users/search/${value}`);
        // const filteredUsers = users.data.filter((user) =>
        //   user.email.toLowerCase().includes(value.toLowerCase())
        // );
        setSearchResults(users.data);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Add the selected user to the sharedWith list
  const handleAddUser = async () => {
    console.log(searchResults);
    if (emailInput.trim() !== "") {
      const userToAdd = searchResults.find((user) => user.email === emailInput);

      if (userToAdd) {
        const currentSharedWith = activeTab.data.sharedWith || [];
        const updatedSharedWith = [...currentSharedWith, userToAdd._id];

        try {
          // Update the backend
          await axiosInstance.put(
            `/collections/${activeTab.data.collection._id}`,
            {
              sharedWith: updatedSharedWith,
            }
          );

          // Update the tab data locally
          setTabs((prevTabs) =>
            prevTabs.map((tab) =>
              tab.id === activeTabId
                ? {
                    ...tab,
                    data: {
                      ...tab.data,
                      sharedWith: updatedSharedWith,
                    },
                  }
                : tab
            )
          );

          setEmailInput(""); // Clear input
          setSearchResults([]); // Clear results
        } catch (error) {
          console.error("Error updating collection:", error);
          alert("Failed to update collection.");
        }
      } else {
        alert("User not found in search results.");
      }
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-72 bg-white p-4 border-r border-gray-200">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Collections"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md"
            />
            <button
              className="cursor-pointer w-full mt-4 px-6 py-2 bg-[#FF6C37] text-white rounded-md hover:bg-[#ff5719]"
              onClick={handleCreateNewCollectionTab}
            >
              Add New Collection
            </button>
          </div>
        </div>
        <div className="overflow-y-auto">
          {/* Collection List */}
          {filteredCollections.map((collection) => (
            <div
              key={collection._id}
              className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => handleCollectionClick(collection._id)}
            >
              <span>{collection.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Tab Bar */}
        <div
          className={`flex mb-4 h-max-[47px] ${
            tabs.length > 0 && "border-b border-gray-200"
          }`}
        >
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              id={tab.id}
              label={tab.label}
              active={activeTabId === tab.id}
              onClick={handleTabSwitch}
              onClose={handleTabClose}
            />
          ))}
        </div>

        <div className="px-6">
          {/* Display message if no tab is selected */}
          {activeTabId === null && (
            <p className="text-gray-500">
              Select a collection to edit or add a new collection add new
              collection
            </p>
          )}

          {/* Active Tab Content */}
          {activeTab && activeTab.type === "collection" && (
            <div>
              <div className="flex flex-col items-center p-4">
                {/* Dropdown and Export Button Container */}
                <div className="flex ml-auto space-x-2">
                  {/* Dropdown */}
                  <select
                    className="form-select block w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    aria-label="Select Export Option"
                  >
                    <option value="Collection" selected>
                      Export Collection
                    </option>
                    <option value="Requests">Export Requests</option>
                    <option value="Both">Export Both</option>
                  </select>

                  {/* Export Button */}
                  <button
                    onClick={() => handleExport(activeTab.data.collection._id)}
                    className="bg-[#FF6C37] text-white px-4 py-2 rounded-md hover:bg-[#ff5719] flex items-center space-x-2 cursor-pointer"
                  >
                    <BsCloudDownload className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Collection Name */}
              <div className="mb-4">
                {activeTab.isEditing ? (
                  <input
                    type="text"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md"
                  />
                ) : (
                  <h2 className="text-xl font-semibold mb-4">
                    {activeTab.data.collection.name}
                  </h2>
                )}
              </div>

              {/* Collection Description */}
              <div className="mb-4">
                {activeTab.isEditing ? (
                  <textarea
                    value={collectionDescription}
                    onChange={(e) => setCollectionDescription(e.target.value)}
                    className="w-full h-48 p-4 border border-gray-200 rounded-md"
                  />
                ) : (
                  <p className="mb-4">
                    {activeTab.data.collection.description}
                  </p>
                )}
              </div>

              {/* Display Requests */}
              <div className="flex">
                <h3 className="text-lg font-semibold mb-2">Requests</h3>
                {/* To add new request */}
                <p
                  onClick={handleAddNewRequest}
                  className="cursor-pointer text-[#FF6C37] underline ml-auto"
                >
                  Add New Request
                </p>

                {/* Import Requests Button */}
                <div className="flex">
                  <p
                    onClick={handleImportRequests}
                    className="ml-4 cursor-pointer text-[#FF6C37] underline"
                  >
                    Import Requests
                  </p>

                  {/* File Input for JSON file selection */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>
              {activeTab &&
              activeTab.data.requests &&
              activeTab.data.requests.length === 0 ? (
                <p>No requests found for this collection.</p>
              ) : (
                <ul>
                  {activeTab.data.requests.map((req, index) => (
                    <li
                      key={index}
                      className="mb-2 p-3 bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-400"
                      onClick={() => {
                        if (!activeTab.isEditing) {
                          handleRequestClick(
                            req,
                            activeTab.data.collection._id
                          );
                        }
                      }}
                    >
                      <div className="flex justify-between">
                        <span>{req.method}</span> - <span>{req.name}</span>
                        {activeTab.isEditing && (
                          <button
                            onClick={() => handleDeleteRequest(req._id)}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Display shared with users */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Collection shared with
                </h3>
                {activeTab.isEditing ? (
                  // Always show input in edit mode
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => handleEmailChange(e)}
                        placeholder="Enter user email to share with"
                        className="w-full px-4 py-2 border border-gray-200 rounded-md"
                      />
                      {/* <button
                        onClick={() => {
                          if (emailInput.trim() !== "") {
                            const currentSharedWith =
                              activeTab.data.sharedWith || [];
                            const updatedSharedWith = [
                              ...currentSharedWith,
                              emailInput,
                            ];
                            setTabs((prevTabs) =>
                              prevTabs.map((tab) =>
                                tab.id === activeTabId
                                  ? {
                                      ...tab,
                                      data: {
                                        ...tab.data,
                                        sharedWith: updatedSharedWith,
                                      },
                                    }
                                  : tab
                              )
                            );

                            setEmailInput(""); // Clear input
                            setSearchResults([]); // Clear results
                          }
                        }}
                        className="bg-[#FF6C37] text-white px-4 py-2 rounded-md hover:bg-[#ff5719]"
                      >
                        Add
                      </button> */}
                      <button
                        onClick={() => handleAddUser()}
                        className="bg-[#FF6C37] text-white px-4 py-2 rounded-md hover:bg-[#ff5719]"
                      >
                        Add
                      </button>
                    </div>

                    {/* Display search results */}
                    {searchResults && searchResults.length > 0 && (
                      <div className="mt-2 border border-gray-200 rounded-md">
                        {searchResults.map((user) => (
                          <div
                            key={user._id}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              setEmailInput(user.email);
                              // setSearchResults([]);
                            }}
                          >
                            {user.email}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Display current shared users with option to remove */}
                    {activeTab.data.sharedWith &&
                    activeTab.data.sharedWith.length > 0 ? (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">
                          Currently shared with:
                        </h4>
                        <ul className="space-y-2">
                          {activeTab.data.sharedWith.map((email, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                            >
                              <span>{email}</span>
                              <button
                                onClick={() => {
                                  const updatedSharedWith = [
                                    ...activeTab.data.sharedWith,
                                  ];
                                  updatedSharedWith.splice(index, 1);

                                  // Update the tab data locally
                                  setTabs((prevTabs) =>
                                    prevTabs.map((tab) =>
                                      tab.id === activeTabId
                                        ? {
                                            ...tab,
                                            data: {
                                              ...tab.data,
                                              sharedWith: updatedSharedWith,
                                            },
                                          }
                                        : tab
                                    )
                                  );
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="mt-2 text-gray-500">
                        This collection is not shared with anyone yet.
                      </p>
                    )}
                  </div>
                ) : (
                  // Non-editing view
                  <>
                    {!activeTab.data.sharedWith ||
                    activeTab.data.sharedWith.length === 0 ? (
                      <p>This collection is shared with no one.</p>
                    ) : (
                      <>
                        <p>This collection is shared with other users also.</p>
                        <ul className="mt-2">
                          {activeTab.data.sharedWith.map((email, index) => (
                            <li key={index} className="p-1">
                              {email}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Save Changes Button */}
              {activeTab.isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveChanges}
                    className="cursor-pointer mt-4 px-6 py-2 bg-[#FF6C37] text-white rounded-md hover:bg-[#ff5719]"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setCollectionName(activeTab.data.collection.name);
                      setCollectionDescription(
                        activeTab.data.collection.description
                      );
                      setTabs((prevTabs) =>
                        prevTabs.map((tab) =>
                          tab.id === activeTabId
                            ? { ...tab, isEditing: false }
                            : tab
                        )
                      );
                    }}
                    className="cursor-pointer mt-4 px-6 py-2 border b-[#FF6C37] text-[#FF6C37] rounded-md hover:b-[#ff5719]"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Edit Button */}
              {!activeTab.isEditing && (
                <button
                  onClick={() => {
                    setTabs((prevTabs) =>
                      prevTabs.map((tab) =>
                        tab.id === activeTabId
                          ? { ...tab, isEditing: true }
                          : tab
                      )
                    );
                    setCollectionName(activeTab.data.collection.name);
                    setCollectionDescription(
                      activeTab.data.collection.description
                    );
                  }}
                  className="cursor-pointer mt-4 px-6 py-2 bg-[#FF6C37] text-white rounded-md hover:bg-[#ff5719]"
                >
                  Edit
                </button>
              )}
            </div>
          )}

          {/* Request Tab Content */}
          {activeTab && activeTab.type === "request" && (
            <RequestUI
              selectedRequest={activeTab.data}
              showMethodDropdown={showMethodDropdown}
              setShowMethodDropdown={setShowMethodDropdown}
              showAuthDropdown={showAuthDropdown}
              setShowAuthDropdown={setShowAuthDropdown}
              handleUpdateRequestName={handleUpdateRequestName}
            />
          )}

          {/* Create Collection UI */}
          {activeTab && activeTab.type === "create-collection" && (
            <CreateCollectionUI
              onSave={handleSaveNewCollection}
              onCancel={handleCancelCollection}
            />
          )}
        </div>
      </div>
    </div>
  );
}
