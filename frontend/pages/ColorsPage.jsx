import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ColorsPage = () => {
  const navigate = useNavigate();

  
  const colors = [
    { name: "Red", bg: "bg-red-500", hover: "hover:bg-red-600", contrast: "white" },
    { name: "Blue", bg: "bg-blue-500", hover: "hover:bg-blue-600", contrast: "white" },
    { name: "Green", bg: "bg-green-500", hover: "hover:bg-green-600", contrast: "white" },
    { name: "Yellow", bg: "bg-yellow-400", hover: "hover:bg-yellow-500", contrast: "black" },
    { name: "Purple", bg: "bg-purple-500", hover: "hover:bg-purple-600", contrast: "white" },
    { name: "Pink", bg: "bg-pink-500", hover: "hover:bg-pink-600", contrast: "white" },
    { name: "Indigo", bg: "bg-indigo-500", hover: "hover:bg-indigo-600", contrast: "white" },
    { name: "Orange", bg: "bg-orange-500", hover: "hover:bg-orange-600", contrast: "white" },
    { name: "Teal", bg: "bg-teal-500", hover: "hover:bg-teal-600", contrast: "white" },
    { name: "Gray", bg: "bg-gray-500", hover: "hover:bg-gray-600", contrast: "white" },
    
    { name: "Black", bg: "bg-black", hover: "hover:bg-gray-800", contrast: "white" },
  ];


  const [selectedBg, setSelectedBg] = useState("bg-gray-50");
  const [selectedContrast, setSelectedContrast] = useState("black");

  const handleSelect = (color) => {
    setSelectedBg(color.bg);
    setSelectedContrast(color.contrast === "white" ? "text-white" : "text-black");
  };

  return (
    <div className={`h-screen w-screen ${selectedBg} flex flex-col items-center p-6 transition-colors duration-300`}>
    
      <div className="w-full flex items-start">
        <button
          onClick={() => navigate("/")}
          className={`${selectedContrast === "text-white" ? "bg-black/30 text-white" : "bg-white text-black"} px-4 py-2 rounded-lg shadow hover:opacity-90 active:scale-95 transition`}
          aria-label="Go back"
        >
          ← Back
        </button>
      </div>


      <h1 className={`${selectedContrast} text-2xl font-bold my-6`}>Color Buttons</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-3xl">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => handleSelect(color)}
            aria-label={`Select ${color.name}`}
            className={`${color.bg} ${color.hover} ${color.contrast === "white" ? "text-white" : "text-black"} px-6 py-3 font-semibold rounded-xl shadow-md transition-transform duration-200 active:scale-95`}
          >
            {color.name}
          </button>
        ))}
      </div>

      
      <div className="mt-6">
        <p className={`${selectedContrast}`}>Selected background class: <span className="font-mono ml-2">{selectedBg}</span></p>
      </div>
    </div>
  );
};

export default ColorsPage;
