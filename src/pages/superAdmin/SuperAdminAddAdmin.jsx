import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOCATIONS } from "@/lib/locations";
import { useCreateAdmin } from "@/hooks/superAdmin/useCreateAdmin";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function SuperAdminAddAdmin() {
  const [showNotification, setShowNotification] = useState(false);
  const { mutate: createAdmin, isPending } = useCreateAdmin();

  // Controlled inputs
  const [adminName, setAdminName] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminLocation, setAdminLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name: adminName,
      phone: adminPhone,
      email: adminEmail,
      password,
      region_id: adminLocation,
    };

    createAdmin(formData, {
      onSuccess: () => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        setAdminName("");
        setAdminPhone("");
        setAdminEmail("");
        setPassword("");
        setAdminLocation("");
      },
      onError: () => {
        alert("Failed to add admin!");
      },
    });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 transition-colors duration-500 bg-gradient-to-br from-white via-slate-400 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950">

      {/* SINGLE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl rounded-3xl p-10 shadow-[0_30px_50px_rgba(0,0,0,0.25)] transition-colors duration-500 bg-white/90 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl font-bold text-blue-800 dark:text-blue-300"
          >
            Add Admin
          </h1>
          <p className="mt-2 text-blue-600 dark:text-gray-400">
            Enter the details please
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Admin Name */}
          <Input
            icon={UserIcon}
            placeholder="Admin Name"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
          />

          {/* Admin Phone */}
          <Input
            icon={PhoneIcon}
            placeholder="Admin Phone"
            value={adminPhone}
            onChange={(e) => setAdminPhone(e.target.value)}
          />

          {/* Admin Email */}
          <Input
            icon={EnvelopeIcon}
            placeholder="Admin Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />

          {/* Password */}
          <PasswordInput
            icon={LockClosedIcon}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            toggleShow={() => setShowPassword(!showPassword)}
          />

          {/* Admin Location */}
          <div className="relative">
            <GlobeAltIcon
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400"
            />
            <select
              value={adminLocation}
              onChange={(e) => setAdminLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition bg-white text-gray-900 border-blue-300 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:focus:ring-blue-500"
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
            {isPending ? "Adding..." : "Add Admin"}
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
            Admin added successfully!
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
  type = "text",
  value,
  onChange,
}) {
  return (
    <div className="relative">
      <Icon
        className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400"
      />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition bg-white text-gray-900 border-blue-300 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:focus:ring-blue-500"
      />
    </div>
  );
}

/* PASSWORD INPUT */
function PasswordInput({
  icon: Icon,
  placeholder,
  value,
  onChange,
  showPassword,
  toggleShow,
}) {
  return (
    <div className="relative">
      <Icon
        className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400"
      />
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-3 rounded-xl border focus:outline-none focus:ring-2 transition bg-white text-gray-900 border-blue-300 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
