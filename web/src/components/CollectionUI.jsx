import React, { useState } from 'react';
import axiosInstance from '../axios/axiosInstance';

const CollectionUI = ({ collection, onSave, onEdit, isEditing }) => {
  const [collectionName, setCollectionName] = useState(collection.name);
  const [collectionDescription, setCollectionDescription] = useState(collection.description);

  const handleSaveChanges = async () => {
    try {
      const updatedCollection = {
        name: collectionName,
        description: collectionDescription,
      };
      await axiosInstance.put(`/collections/${collection._id}`, updatedCollection);
      // onSave(updatedCollection);
    } catch (error) {
      console.error('Error saving collection changes', error);
    }
  };

  return (
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
      {collection.requests && collection.requests.length === 0 ? (
        <p>No requests found for this collection.</p>
      ) : (
        <ul>
          {collection.requests.map((req, index) => (
            <li
              key={index}
              className="mb-2 p-3 bg-gray-300 rounded-lg"
              onClick={() => onRequestClick(req)}
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
          {collection?.sharedWith.length > 0 ? (
            collection?.sharedWith.map((user, idx) => (
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
            onClick={onEdit}
            className="mt-4 px-6 py-2 bg-[#FF6C37] text-white rounded-md hover:bg-[#ff5719]"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Edit Button */}
      {!isEditing && (
        <button
          onClick={onEdit}
          className="mt-4 px-6 py-2 bg-[#FF6C37] text-white rounded-md hover:bg-[#ff5719]"
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default CollectionUI;