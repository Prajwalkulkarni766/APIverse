import { useState, useEffect } from 'react';
import axiosInstance from "../axios/axiosInstance";

export default function EnvironmentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [environments, setEnvironments] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle Environment Selection
  const handleSelectEnv = async (env) => {
    setLoading(true);
    setIsCreating(false);
    try {
      const response = await axiosInstance.get(`/environments/${env._id}`);
      setSelectedEnv(response.data);  // Update the selected environment
    } catch (err) {
      setError("An error occurred while fetching environment details.");
      console.error("Error fetching environment details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Name Change
  const handleNameChange = (e) => {
    setSelectedEnv({ ...selectedEnv, name: e.target.value });
  };

  // Handle Variable Change
  const handleVariableChange = (index, key, value) => {
    const updatedVars = [...selectedEnv.variables];
    updatedVars[index] = { variable: key, value: value };
    setSelectedEnv({ ...selectedEnv, variables: updatedVars });
  };


  // Add New Variable
  const addVariable = () => {
    setSelectedEnv({ ...selectedEnv, variables: [...selectedEnv.variables, { key: '', value: '' }] });
  };

  // Remove Variable
  const removeVariable = (index) => {
    const updatedVars = selectedEnv.variables.filter((_, i) => i !== index);
    setSelectedEnv({ ...selectedEnv, variables: updatedVars });
  };

  // Start Creating New Environment
  const startCreatingNewEnvironment = () => {
    setIsCreating(true);
    setSelectedEnv({ id: null, name: '', variables: [] });
  };

  // Save New Environment
  const saveNewEnvironment = async () => {
    if (selectedEnv.name.trim()) {
      const newEnv = {
        name: selectedEnv.name,
        variables: selectedEnv.variables.map((variable) => ({
          variable: variable.variable,
          value: variable.value,
        })),
      };

      try {
        const response = await axiosInstance.post("/environments", newEnv);

        setEnvironments([...environments, response.data]);
      } catch (err) {
        setError("An error occurred while creating the environment.");
        console.error("Error creating environment:", err);
      }
    }
  };

  // Save Existing Environment
  const saveExistingEnvironment = async () => {
    if (selectedEnv.name.trim()) {
      const updatedEnv = {
        name: selectedEnv.name,
        variables: selectedEnv.variables.map((variable) => ({
          variable: variable.variable,
          value: variable.value,
        })),
      };

      try {
        const response = await axiosInstance.put(`/environments/${selectedEnv._id}`, updatedEnv);

        setEnvironments(environments.map((env) =>
          env._id === selectedEnv._id ? response.data : env
        ));

        setIsCreating(false);
      } catch (err) {
        setError("An error occurred while updating the environment.");
        console.error("Error updating environment:", err);
      }
    }
  };

  // Fetch Environments from API
  const getEnvData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/environments/name");
      setEnvironments(response.data);
    } catch (err) {
      setError("An error occurred while fetching environments.");
      console.error("Error fetching environments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEnvData();
  }, []);

  return (
    <div className="flex bg-white">
      {/* Left Panel - Environment List */}
      <div className="w-80 border-r border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Env Management</h1>
          <button
            onClick={startCreatingNewEnvironment}
            className="h-8 p-2 pb-3 bg-[#FF6C37] text-white rounded flex items-center justify-center text-2xl"
          >
            +
          </button>
        </div>

        <input
          type="text"
          placeholder="Search environments"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
        />

        {/* Environments List */}
        <div className="space-y-2">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            environments
              .filter(env => env.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((env) => (
                <div
                  key={env._id}
                  className={`p-2 cursor-pointer rounded ${selectedEnv?._id === env._id ? 'bg-gray-200' : ''}`}
                  onClick={() => handleSelectEnv(env)}
                >
                  {env.name}
                </div>
              ))
          )}
        </div>
      </div>

      {/* Right Panel - Environment Details */}
      <div className="flex-1 p-6">
        {selectedEnv || isCreating ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">{isCreating ? 'Create Environment' : 'Edit Environment'}</h2>
            <input
              type="text"
              placeholder="Environment Name"
              value={selectedEnv.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">Variables</h3>
            {selectedEnv.variables?.map((variable, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={variable.variable}
                  onChange={(e) => handleVariableChange(index, e.target.value, variable.value)}
                  className="px-3 py-2 border border-gray-300 rounded w-1/2"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={variable.value}
                  onChange={(e) => handleVariableChange(index, variable.variable, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded w-1/2"
                />
                <button
                  onClick={() => removeVariable(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
            <button onClick={addVariable} className="bg-[#FF6C37] text-white px-4 py-2 rounded mt-4">
              Add Variable
            </button>
            {isCreating ? (
              <button onClick={saveNewEnvironment} className="bg-green-500 text-white px-4 py-2 rounded mt-4 ml-2">
                Save Environment
              </button>
            ) :
              (
                <button onClick={saveExistingEnvironment} className="bg-green-500 text-white px-4 py-2 rounded mt-4 ml-2">
                  Save Changes
                </button>
              )
            }
          </div>
        ) : (
          <p className="text-gray-500">Select an environment to edit or click <span className="text-[#FF6C37]">+</span> to add a new environment</p>
        )}
      </div>
    </div>
  );
}
