import React, { useState } from 'react';

export default function Home() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('{{baseUrl}}/v1/cms/village/b');
  const [activeTab, setActiveTab] = useState('Authorization');
  const [bodyType, setBodyType] = useState('none');
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const saveOptions = ['Save', 'Save As', 'Save to Collection'];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-72 bg-white p-4 border-r border-gray-200">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Collections"
              className="w-full px-4 py-2 border border-gray-200 rounded-md"
            />
          </div>
        </div>
        <div className="h-[calc(100vh-100px)] overflow-y-auto">
          {/* Collection tree would go here */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Request Section */}
        <div className="flex items-center gap-2 mb-6">
          {/* Method Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMethodDropdown(!showMethodDropdown)}
              className="w-24 px-4 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between"
            >
              {method}
              <span className="text-xs">▼</span>
            </button>
            {showMethodDropdown && (
              <div className="absolute top-full mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {methods.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMethod(m);
                      setShowMethodDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* URL Input */}
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
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
              {/* <span className="text-gray-600">💾</span> */}
              Save
              <span className="text-xs">▼</span>
            </button>
            {showSaveDropdown && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {saveOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setShowSaveDropdown(false)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
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
                  className="px-4 py-1 rounded-md hover:bg-gray-100"
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
    </div>
  );
}