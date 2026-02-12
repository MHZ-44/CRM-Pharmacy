import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOCATIONS } from "@/lib/locations";
import { useCreatePharmacy } from "@/hooks/superAdmin/useCreatePharmacy";

import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  HomeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

export default function SuperAdminAddPharmacy() {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { mutate: createPharmacy, isPending } = useCreatePharmacy();

  // Controlled inputs
  const [pharmacyName, setPharmacyName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pharmacyLocation, setPharmacyLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      pharmacy_name: pharmacyName,
      doctor_name: doctorName,
      doctor_phone: doctorPhone,
      doctor_email: doctorEmail,
      password,
      region_id: pharmacyLocation,
    };

    createPharmacy(formData, {
      onSuccess: () => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);

        setAdminName("");
        setPharmacyName("");
        setDoctorName("");
        setDoctorPhone("");
        setDoctorEmail("");
        setPassword("");
        setPharmacyLocation("");
      },
      onError: () => {
        alert("Failed to add pharmacy!");
      },
    });
  };

  return (
    <div
      className={`min-h-screen relative flex items-center justify-center px-4 transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950"
          : "bg-gradient-to-br from-white via-slate-400 to blue-100"
      }`}
    >
      {/* Toggle Button 

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition ${
          darkMode ? "bg-gray-800 text-yellow-400" : "bg-white text-blue-700"
        }`}
      >
        {darkMode ? (
          <SunIcon className="w-6 h-6" />
        ) : (
          <MoonIcon className="w-6 h-6" />
        )}
      </button> */}

      {/* SINGLE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-3xl rounded-3xl shadow-[0_30px_50px_rgba(0,0,0,0.25)]
          transition-colors duration-500
          ${darkMode ? "bg-gray-900 text-gray-100" : "text-gray-900"}
          max-h-[90vh] overflow-y-auto p-8
        `}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className={`text-3xl font-bold ${darkMode ? "text-blue-300" : "text-blue-800"}`}
          >
            Add Pharmacy
          </h1>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-blue-600"}`}>
            Enter the details please
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Pharmacy Name */}
          <Input
            darkMode={darkMode}
            icon={HomeIcon}
            placeholder="Pharmacy Name"
            value={pharmacyName}
            onChange={(e) => setPharmacyName(e.target.value)}
          />

          {/* Doctor Name */}
          <Input
            darkMode={darkMode}
            icon={UserIcon}
            placeholder="Doctor Name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          />

          {/* Doctor Phone */}
          <Input
            darkMode={darkMode}
            icon={PhoneIcon}
            placeholder="Doctor Phone"
            value={doctorPhone}
            onChange={(e) => setDoctorPhone(e.target.value)}
          />

          {/* Doctor Email */}
          <Input
            darkMode={darkMode}
            icon={EnvelopeIcon}
            placeholder="Doctor Email"
            value={doctorEmail}
            onChange={(e) => setDoctorEmail(e.target.value)}
          />

          {/* Password with show/hide */}
          <PasswordInput
            darkMode={darkMode}
            icon={LockClosedIcon}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            toggleShow={() => setShowPassword(!showPassword)}
          />

          {/* Pharmacy Location Select */}
          <div className="relative">
            <GlobeAltIcon
              className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <select
              value={pharmacyLocation}
              onChange={(e) => setPharmacyLocation(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition
                ${darkMode ? "bg-gray-800 text-gray-100 border-gray-700 focus:ring-blue-500" : "bg-white text-gray-900 border-blue-300 focus:ring-blue-500"}
              `}
            >
              <option value="">Select Location</option>
              {LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl font-semibold text-blue-100
              bg-gradient-to-r from-blue-500 to-blue-700
              hover:from-blue-700 hover:to-blue-800
              shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Adding..." : "Add Pharmacy"}
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
            Pharmacy added successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({
  icon: Icon,
  placeholder,
  darkMode,
  type = "text",
  value,
  onChange,
}) {
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

/* PASSWORD INPUT WITH SHOW/HIDE */
function PasswordInput({
  icon: Icon,
  placeholder,
  darkMode,
  value,
  onChange,
  showPassword,
  toggleShow,
}) {
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
          ${
            darkMode
              ? "bg-gray-800 text-gray-100 border-gray-700 focus:ring-blue-500"
              : "bg-white text-gray-900 border-blue-300 focus:ring-blue-500"
          }
        `}
      />
      {/* Eye icon */}
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? (
          <EyeSlashIcon className="w-5 h-5" />
        ) : (
          <EyeIcon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
