import { useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance";

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedMethod, setSelectedMethod] = useState("ALL");
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch history data based on current page and filters
  const getHistory = async (page = 1, reset = false) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/history", {
        params: {
          page,
          limit: itemsPerPage,
          status: selectedStatus !== "ALL" ? selectedStatus : undefined,
          method: selectedMethod !== "ALL" ? selectedMethod : undefined,
          search: searchQuery || undefined,
        },
      });

      // Update history data
      setHistoryData(
        reset
          ? response.data.history
          : [...historyData, ...response.data.history]
      );
      setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getHistory(1, true); // Reset history when searching
  };

  const handleClearHistory = async () => {
    try {
      await axiosInstance.delete("/history");
      setHistoryData([]);
      setTotalPages(1);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    getHistory(1, true); // Reset history when filters change
  }, [selectedStatus, selectedMethod]);

  return (
    <div className="p-4 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">History</h1>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by URL"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />

        <div className="relative">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md appearance-none pr-8 bg-white"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">ALL</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="ERROR">ERROR</option>
          </select>
          <span className="absolute right-2 top-3">▼</span>
        </div>

        <div className="relative">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md appearance-none pr-8 bg-white"
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
          >
            <option value="ALL">ALL</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <span className="absolute right-2 top-3">▼</span>
        </div>

        <button
          className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-md border border-red-500"
          onClick={handleClearHistory}
        >
          Clear History
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-[#FF6C37] text-gray-100 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 border-b">Time</th>
              <th className="px-6 py-3 border-b">Method</th>
              <th className="px-6 py-3 border-b">URL</th>
              <th className="px-6 py-3 border-b">Status</th>
              <th className="px-6 py-3 border-b">Status Code</th>
              <th className="px-6 py-3 border-b">Time Taken</th>
              <th className="px-6 py-3 border-b">Size</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && historyData.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No content in table
                </td>
              </tr>
            )}
            {!loading &&
              historyData.map((item, index) => (
                <tr
                  key={index}
                  className={` transition-all duration-200 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="px-6 py-3">{formatDate(item.createdAt)}</td>
                  <td className="px-6 py-3 font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.method === "GET"
                          ? "bg-green-100 text-green-600"
                          : item.method === "POST"
                          ? "bg-blue-100 text-blue-600"
                          : item.method === "DELETE"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {item.method}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-blue-500 truncate max-w-xs">
                    {item.url}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === "SUCCESS"
                          ? "bg-green-100 text-green-600"
                          : item.status === "ERROR"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">{item.statusCode}</td>
                  <td className="px-6 py-3">{item.responseTime}ms</td>
                  <td className="px-6 py-3">{formatSize(item.responseSize)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {historyData.length} of {totalPages * itemsPerPage} entries
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border rounded-md disabled:opacity-50"
            onClick={() => getHistory(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded-md disabled:opacity-50"
            onClick={() => getHistory(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
