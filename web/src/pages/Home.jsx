import { useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance";
import RequestUI from "../components/RequestUI";
import CreateCollectionUI from "../components/CreateCollectionUI";
import TabItem from "../components/TabItem";
// import { BsArrowClockwise } from "react-icons/bs";
import { BsCloudDownload } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";

export default function Home() {
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [tabs, setTabs] = useState([]); // State to manage tabs
  const [activeTabId, setActiveTabId] = useState(null); // State to track active tab
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

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
    setIsCreatingCollection(true); // Show the create collection form
  };

  // Handle creating a new collection
  const handleSaveNewCollection = async (collectionData) => {
    try {
      await axiosInstance.post("/collections", collectionData);
      setIsCreatingCollection(false);
      fetchCollections();
      setTabs((prevTabs) =>
        prevTabs.filter((tab) => tab.id !== "create-collection")
      ); // Remove the "Create Collection" tab
    } catch (error) {
      console.error("Error creating new collection", error);
    }
  };

  // Handle canceling collection creation
  const handleCancelCollection = () => {
    setIsCreatingCollection(false);
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

  return (
    <div className="flex h-screen bg-gray-50">
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
        <div className="flex border-b border-gray-200 mb-4 h-max-[47px]">
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
          {/* Active Tab Content */}
          {activeTab && activeTab.type === "collection" && (
            <div>
              <div className="flex items-center gap-4 p-2 text-2xl">
                {/* TODO: Export collection */}
                <p className="ml-auto">
                  <BsCloudDownload title="Export collection" />
                </p>
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

          {/*  */}
          {/* Create Collection UI */}
          {isCreatingCollection && (
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
