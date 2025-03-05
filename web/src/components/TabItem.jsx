import { BsX } from "react-icons/bs";

const TabItem = ({ id, label, active, onClick, onClose }) => (
    <button
      className={`cursor-pointer px-4 py-2 -mb-px border-b-2 ${active
        ? 'border-[#FF6C37] text-[#FF6C37]'
        : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      onClick={() => onClick(id)}
    >
      <div className="flex items-center gap-2">
        {label}
        <span
          className="ml-2 text-2xl text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            onClose(id); // Handle tab close
          }}
        >
          <BsX />
        </span>
      </div>
    </button>
  );

  export default TabItem;