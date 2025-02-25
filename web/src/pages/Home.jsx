import { useState, useEffect } from 'react';
import axiosInstance from '../axios/axiosInstance';
import RequestUI from '../components/RequestUI';
import CreateCollectionUI from '../components/CreateCollectionUI';
import SelectedCollectionUI from '../components/SelectedCollectionUI';

// Create a new type for our tabs
const TabItem = ({ id, label, active, onClick }) => (
  <button
    className={`px-4 py-2 -mb-px border-b-2 ${active
      ? 'border-[#FF6C37] text-[#FF6C37]'
      : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    onClick={() => onClick(id)}
  >
    <div className="flex items-center gap-2">
      {label}
      {/* Add close button if needed */}
      <span
        className="ml-2 text-xs text-gray-400 hover:text-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          // Handle close
        }}
      >
        ×
      </span>
    </div>
  </button>
);

export default function Home() {
  // const [method, setMethod] = useState('GET');
  // const [url, setUrl] = useState('');
  // const [activeTab, setActiveTab] = useState('Authorization');
  // const [bodyType, setBodyType] = useState('none');
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showApiRequestUI, setShowApiRequestUI] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  // const [selectedCollectionRequests, setSelectedCollectionRequests] = useState([]);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  // const [newCollectionName, setNewCollectionName] = useState('');
  // const [newCollectionDescription, setNewCollectionDescription] = useState('');


  // const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  // const saveOptions = ['Save', 'Save As', 'Save to Collection'];

  // Function to add a new tab
  const addTab = (type, data) => {
    const newTab = {
      id: `${type}-${Date.now()}`,
      type,
      data,
      label: type === 'collection' ? data.name : `${data.method} ${data.name}`
    };

    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(newTab.id);
  };

  // Fetch collections
  const fetchCollections = async () => {
    try {
      const response = await axiosInstance.get('/collections/collection-name');
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections', error);
    }
  };

  // To handle request click
  const handleRequestClick = (request) => {
    setSelectedRequest(request); // Set the selected request
    setShowApiRequestUI(true);   // Show the request UI
  };


  // Fetch selected collection details
  const fetchCollectionDetails = async (id) => {
    try {
      const response = await axiosInstance.get(`/collections/${id}`);
      setSelectedCollection(response.data);
      setCollectionName(response.data.name); // Set name in state
      setCollectionDescription(response.data.description); // Set description in state
    } catch (error) {
      console.error('Error fetching collection details', error);
    }
  };

  // Save changes to the collection
  const handleSaveChanges = async () => {
    try {
      const updatedCollection = {
        name: collectionName,
        description: collectionDescription,
      };
      await axiosInstance.put(`/collections/${selectedCollection._id}`, updatedCollection);
      setIsEditing(false);
      fetchCollectionDetails(selectedCollection._id);
      fetchCollections();
    } catch (error) {
      console.error('Error saving collection changes', error);
    }
  };

  // Fetch collection requests with methods
  // const fetchCollectionRequests = async (id) => {
  //   try {
  //     const response = await axiosInstance.get(`/collections/collection-request-name/${id}`);
  //     setSelectedCollectionRequests(response.data);
  //   } catch (error) {
  //     console.error('Error fetching collection requests', error);
  //   }
  // };

  // Handle collection click (fetch details for the selected collection)
  // const handleCollectionClick = (id) => {
  //   fetchCollectionDetails(id);
  //   setShowApiRequestUI(false);
  //   setOpenDropdownId(null); // Close the dropdown when a collection is clicked
  // };

  // Modified click handlers
  const handleCollectionClick = (id) => {
    fetchCollectionDetails(id).then(() => {
      if (selectedCollection) {
        addTab('collection', selectedCollection);
      }
    });
    setShowApiRequestUI(false);
  };

  // Handle dropdown toggle
  // const handleDropdownToggle = (id) => {
  //   if (openDropdownId === id) {
  //     setOpenDropdownId(null); // Close the dropdown if it's already open
  //   } else {
  //     setOpenDropdownId(id); // Open dropdown for the clicked collection
  //     fetchCollectionRequests(id); // Fetch requests when dropdown is opened
  //   }
  // };

  // Filter collections based on search term
  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveNewCollection = async (collectionData) => {
    try {
      // Send a POST request to create a new collection
      await axiosInstance.post('/collections', collectionData);

      // Hide the form
      setIsCreatingCollection(false);

      // Refetch collections
      fetchCollections();
    } catch (error) {
      console.error('Error creating new collection', error);
    }
  };

  const handleCancelCollection = () => {
    setIsCreatingCollection(false);
  };


  useEffect(() => {
    fetchCollections();
  }, []); // Fetch collections on mount

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
              className="w-full mt-4 px-6 py-2 bg-[#FF6C37] text-white rounded-md hover:bg-[#ff5719]"
              onClick={() => setIsCreatingCollection(true)}
            >
              Add New Collection
            </button>
          </div>
        </div>
        {/* h-[calc(100vh-100px)] */}
        <div className=" overflow-y-auto">
          {/* Collection List with Dropdown Icons */}
          {filteredCollections.map((collection) => (
            <div
              key={collection._id}
              className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => handleCollectionClick(collection._id)}
            >
              {/*
              <span
                onClick={() => handleDropdownToggle(collection._id)}
                className={`transition-transform ${openDropdownId === collection._id ? 'rotate-180' : ''}`}
              >
                ▼
              </span> */}
              <span>{collection.name}</span>

              {/* {openDropdownId === collection._id && selectedCollectionRequests.length > 0 && (
                <ul className="mt-2 ml-4">
                  {selectedCollectionRequests.map((req, index) => (
                    <li key={index} className="mb-2">
                      <span>{req.name}</span> - <span>{req.method}</span>
                    </li>
                  ))}
                </ul>
              )} */}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Right-Hand Side UI */}
        {/* {selectedCollection && !openDropdownId && (
          <div>
            <h2 className="text-xl font-semibold mb-4">{selectedCollection.name}</h2>
            <p className="mb-4">{selectedCollection.description}</p>

            <h3 className="text-lg font-semibold mb-2">Requests</h3>
            {selectedCollection.requests && selectedCollection.requests.length === 0 ? (
              <p>No requests found for this collection.</p>
            ) : (
              <ul>
                {selectedCollection.requests.map((req, index) => (
                  <li key={index} className="mb-2 p-3 bg-gray-300 rounded-lg">
                    <span>{req.method}</span> - <span>{req.name}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4">
              <strong>Shared With:</strong>
              <ul>
                {selectedCollection?.sharedWith.length > 0 ? (
                  selectedCollection?.sharedWith.map((user, idx) => (
                    <li key={idx}>{user}</li>
                  ))
                ) : (
                  <p>No users have access to this collection.</p>
                )}
              </ul>
            </div>
          </div>
        )} */}

        {isCreatingCollection && (
          <CreateCollectionUI
            onSave={handleSaveNewCollection}
            onCancel={handleCancelCollection}
          />
        )}

        {/* {selectedCollection && !openDropdownId && (
          <SelectedCollectionUI
            collection={selectedCollection}
            onSave={handleSaveChanges}
            onEdit={() => setIsEditing(!isEditing)}
            isEditing={isEditing}
            onRequestClick={handleRequestClick}
          />
        )} */}


        {selectedCollection && !openDropdownId && (
          <div>
            {/* Collection Name */}
            <div className="mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md"
                />
              ) : (
                <h2 className="text-xl font-semibold mb-4">{collectionName}</h2>
              )}
            </div>

            {/* Collection Description */}
            <div className="mb-4">
              {isEditing ? (
                <textarea
                  value={collectionDescription}
                  onChange={(e) => setCollectionDescription(e.target.value)}
                  className="w-full h-48 p-4 border border-gray-200 rounded-md"
                />
              ) : (
                <p className="mb-4">{collectionDescription}</p>
              )}
            </div>

            {/* Display Requests */}
            <h3 className="text-lg font-semibold mb-2">Requests</h3>
            {selectedCollection.requests && selectedCollection.requests.length === 0 ? (
              <p>No requests found for this collection.</p>
            ) : (
              <ul>
                {selectedCollection.requests.map((req, index) => (
                  <li
                    key={index}
                    className="mb-2 p-3 bg-gray-300 rounded-lg"
                    onClick={() => handleRequestClick(req)}
                  >
                    <span>{req.method}</span> - <span>{req.name}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Additional details (e.g., shared users, etc.) */}
            <div className="mt-4">
              <strong>Shared With:</strong>
              <ul>
                {selectedCollection?.sharedWith.length > 0 ? (
                  selectedCollection?.sharedWith.map((user, idx) => (
                    <li key={idx}>{user}</li>
                  ))
                ) : (
                  <p>No users have access to this collection.</p>
                )}
              </ul>
            </div>

            {/* Save Changes Button */}
            {isEditing && (
              <div className='flex gap-2'>
                <button
                  onClick={handleSaveChanges}
                  className="mt-4 px-6 py-2 bg-[#FF6C37] text-white rounded-md hover:bg-[#ff5719]"
                >
                  Save Changes
                </button>
                <button
                  className="mt-4 px-6 py-2 bg-[#FF6C37] text-white rounded-md hover:bg-[#ff5719]"
                  onClick={() => {
                    // Reset to original values
                    setCollectionName(selectedCollection.name);
                    setCollectionDescription(selectedCollection.description);
                    // Exit editing mode
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-6 py-2 bg-[#FF6C37] text-white rounded-md hover:bg-[#ff5719]"
              >
                Edit
              </button>
            )}
          </div>
        )}


        {showApiRequestUI && selectedRequest && (
          <RequestUI
            selectedRequest={selectedRequest}
            showMethodDropdown={showMethodDropdown}
            setShowMethodDropdown={setShowMethodDropdown}
            showSaveDropdown={showSaveDropdown}
            setShowSaveDropdown={setShowSaveDropdown}
          />
        )}

      </div>
    </div>
  );
}