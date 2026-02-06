import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  MoonIcon,
  SunIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

export default function AddWarehouse() {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Controlled inputs
  const [warehouseName, setWarehouseName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [warehouseLocation, setWarehouseLocation] = useState("");

  // Locations from API
  const [locations, setLocations] = useState([]);

  // Fetch locations from backend
  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch("/api/locations"); // رابط الباك اند للمواقع
        const data = await res.json();
        setLocations(data.locations || []);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    }
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      warehouseName,
      ownerName,
      ownerPhone,
      ownerEmail,
      password,
      warehouseLocation,
    };

    try {
      const res = await fetch("/api/warehouses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);

        // Reset form
        setWarehouseName("");
        setOwnerName("");
        setOwnerPhone("");
        setOwnerEmail("");
        setPassword("");
        setWarehouseLocation("");
      } else {
        alert("Failed to add warehouse!");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server!");
    }
  };

  return (
    <div
      className={`min-h-screen relative flex items-center justify-center px-4 transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950"
          : "bg-gradient-to-br from-white via-slate-400 to blue-100"
      }`}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition ${
          darkMode ? "bg-gray-800 text-yellow-400" : "bg-white text-blue-700"
        }`}
      >
        {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
      </button>

      {/* SINGLE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-4xl rounded-3xl p-10 shadow-[0_30px_50px_rgba(0,0,0,0.25)]
          transition-colors duration-500
          ${darkMode ? "bg-gray-900 text-gray-100" 
                     : "text-gray-900"}`}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-blue-300" : "text-blue-800"}`}>
            Add Warehouse
          </h1>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-blue-600"}`}>
            Enter the details please
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Warehouse Name */}
          <Input
            darkMode={darkMode}
            icon={HomeIcon}
            placeholder="Warehouse Name"
            value={warehouseName}
            onChange={(e) => setWarehouseName(e.target.value)}
          />

          {/* Owner Name */}
          <Input
            darkMode={darkMode}
            icon={UserIcon}
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />

          {/* Owner Phone */}
          <Input
            darkMode={darkMode}
            icon={PhoneIcon}
            placeholder="Owner Phone"
            value={ownerPhone}
            onChange={(e) => setOwnerPhone(e.target.value)}
          />

          {/* Owner Email */}
          <Input
            darkMode={darkMode}
            icon={EnvelopeIcon}
            placeholder="Owner Email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
          />

          {/* Password */}
          <PasswordInput
            darkMode={darkMode}
            icon={LockClosedIcon}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            toggleShow={() => setShowPassword(!showPassword)}
          />

          {/* Warehouse Location */}
          <div className="relative">
            <GlobeAltIcon
              className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <select
              value={warehouseLocation}
              onChange={(e) => setWarehouseLocation(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition
                ${darkMode ? "bg-gray-800 text-gray-100 border-gray-700 focus:ring-blue-500" : "bg-white text-gray-900 border-blue-300 focus:ring-blue-500"}
              `}
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-blue-100
              bg-gradient-to-r from-blue-500 to-blue-700
              hover:from-blue-700 hover:to-blue-800
              shadow-lg"
          >
            Add Warehouse
          </motion.button>
        </form>
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-10 right-10 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-semibold"
          >
            Warehouse added successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({ icon: Icon, placeholder, darkMode, type = "text", value, onChange }) {
  return (
    <div className="relative">
      <Icon
        className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
          darkMode ? "text-blue-400" : "text-blue-600"
        }`}
      />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition
          ${darkMode ? "bg-gray-800 text-gray-100 border-gray-700 focus:ring-blue-500" : "bg-white text-gray-900 border-blue-300 focus:ring-blue-500"}
        `}
      />
    </div>
  );
}

/* PASSWORD INPUT */
function PasswordInput({ icon: Icon, placeholder, darkMode, value, onChange, showPassword, toggleShow }) {
  return (
    <div className="relative">
      <Icon
        className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
          darkMode ? "text-blue-400" : "text-blue-600"
        }`}
      />
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-10 py-3 rounded-xl border focus:outline-none focus:ring-2 transition
          ${darkMode ? "bg-gray-800 text-gray-100 border-gray-700 focus:ring-blue-500" : "bg-white text-gray-900 border-blue-300 focus:ring-blue-500"}
        `}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
      </button>
    </div>
  );
}
