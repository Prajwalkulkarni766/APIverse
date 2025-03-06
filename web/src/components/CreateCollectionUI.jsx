import { useState, useRef } from "react";
import { BsCloudUpload } from "react-icons/bs";
import axiosInstance from "../axios/axiosInstance";

export default function CreateCollectionUI({ onSave, onCancel }) {
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [selectedOption, setSelectedOption] = useState("Collection"); // State to track export option
  const [selectedFile, setSelectedFile] = useState(null); // State to track selected file

  const fileInputRef = useRef(null); // Ref for file input

  const handleSave = () => {
    // Validate input if needed
    if (!newCollectionName.trim()) {
      alert("Collection name is required.");
      return;
    }

    if (!newCollectionDescription.trim()) {
      alert("Collection description is required.");
      return;
    }

    // Call the parent's save function with the collection data
    onSave({
      name: newCollectionName,
      description: newCollectionDescription,
    });

    // Reset form fields
    setNewCollectionName("");
    setNewCollectionDescription("");
  };

  // Handel file select
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
      handleImportFile();
    } else {
      alert("Please select a valid JSON file.");
    }
  };

  // Handle import file
  const handleImportFile = async () => {
    if (!selectedFile) {
      alert("Please select a JSON file to import.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    let url;

    if (selectedOption === "Collection") {
      url = "/import/collection";
    } else if (selectedOption === "Both") {
      url = "/import/both";
    } else {
      alert("Invalid option selection");
      return;
    }

    try {
      await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Import operation successfully executed");
    } catch (error) {
      alert("Error importing collection. Please try again.");
      console.error("Error importing collection:", error);
    }
  };

  return (
    <div>
      {/* Collection Name */}

      {/* Dropdown and Export Button Container */}
      <div className="flex space-x-2 mb-4">
        {/* Dropdown */}
        <select
          className="form-select block w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none ml-auto"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          aria-label="Select Export Option"
        >
          <option value="Collection" selected>
            Import Collection
          </option>
          <option value="Both" selected>
            Import Both
          </option>
        </select>

        {/* Export Button */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-[#FF6C37] text-white px-4 py-2 rounded-md hover:bg-[#ff5719] flex items-center space-x-2 cursor-pointer"
        >
          <BsCloudUpload className="text-xl" />
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="application/json"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="Collection Name"
          className="w-full px-4 py-2 border border-gray-200 rounded-md"
        />
      </div>

      {/* Collection Description */}
      <div className="mb-4">
        <textarea
          value={newCollectionDescription}
          onChange={(e) => setNewCollectionDescription(e.target.value)}
          placeholder="Collection Description"
          className="w-full h-48 p-4 border border-gray-200 rounded-md"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="mt-4 px-6 py-2 bg-[#FF6C37] text-white rounded-md hover:bg-[#ff5719]"
        >
          Save Collection
        </button>

        <button
          onClick={onCancel}
          className="mt-4 px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
