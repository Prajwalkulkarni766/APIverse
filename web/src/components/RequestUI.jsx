import { useState } from 'react';

export default function RequestUI({
  selectedRequest,
  showMethodDropdown,
  setShowMethodDropdown,
  showSaveDropdown,
  setShowSaveDropdown
}) {
  // Local state needed for this component
  const [url, setUrl] = useState(selectedRequest?.url || '');
  const [activeTab, setActiveTab] = useState('Authorization');
  const [bodyType, setBodyType] = useState('none');
  const [responseTab, setResponseTab] = useState('Body');

  // Handle URL changes
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    // You might want to add a callback to parent component if needed
    // onUrlChange(e.target.value);
  };

  return (
    <div>
      {/* Request Section */}
      <div className="flex items-center gap-2 mb-6">
        {/* Method Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMethodDropdown(!showMethodDropdown)}
            className="w-24 px-4 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between"
          >
            {selectedRequest?.method || 'GET'} {/* Use selectedRequest method with fallback */}
            <span className="text-xs">▼</span>
          </button>
        </div>

        {/* URL Input */}
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-md"
        />

        {/* Send Button */}
        <button className="px-6 py-2 bg-[#FF6C37] text-white rounded-md hover:bg-[#ff5719]">
          Send
        </button>

        {/* Save Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSaveDropdown(!showSaveDropdown)}
            className="px-4 py-2 border border-gray-200 rounded-md flex items-center gap-2"
          >
            Save
            <span className="text-xs">▼</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-4">
            {['Authorization', 'Headers', 'Body'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px ${activeTab === tab
                  ? 'border-b-2 border-[#FF6C37] text-[#FF6C37]'
                  : 'text-gray-500'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'Body' && (
            <div>
              <div className="flex gap-4 mb-4">
                {['none', 'raw', 'binary'].map((type) => (
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
              {bodyType === 'raw' && (
                <textarea
                  className="w-full h-48 p-4 border border-gray-200 rounded-md"
                  placeholder="Enter request body"
                />
              )}
            </div>
          )}

          {activeTab === 'Headers' && (
            <div>
              {/* Headers UI goes here */}
              <textarea
                className="w-full h-48 p-4 border border-gray-200 rounded-md"
                placeholder="Enter headers"
              />
            </div>
          )}

          {activeTab === 'Authorization' && (
            <div>
              {/* Authorization UI goes here */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Type</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-md">
                    <option>No Auth</option>
                    <option>Bearer Token</option>
                    <option>Basic Auth</option>
                    <option>OAuth 2.0</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Response Section */}
      <div className="border border-gray-200 rounded-md">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          Response
        </div>
        <div className="p-4">
          <div className="flex gap-4 mb-4">
            {['Body', 'Headers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setResponseTab(tab)}
                className={`px-4 py-1 rounded-md ${responseTab === tab ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <textarea
            readOnly
            className="w-full h-48 p-4 border border-gray-200 rounded-md bg-gray-50"
            placeholder="Response will appear here"
          />
        </div>
      </div>
    </div>
  );
}