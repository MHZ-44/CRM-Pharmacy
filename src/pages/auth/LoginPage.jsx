import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setStoredRole } from "@/lib/roles";



export default function LoginPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ خلي القيمة الافتراضية موجودة بالـ select
  const [role, setRole] = useState("pharmacist");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // تخزين الرول
    setStoredRole(role);

    // التوجيه حسب الرول
    if (role === "admin") navigate("/admin/home");
    if (role === "pharmacist") navigate("/pharmacist/home");
    if (role === "warehouse") navigate("/warehouse/home");
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950"
          : "bg-gradient-to-br from-white via-slate-400 to-blue-100"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-6xl rounded-2xl 
          shadow-[0_30px_50px_rgba(0,0,0,0.25)] p-8 transition-colors duration-500 ${
          darkMode ? "bg-gray-900 text-gray-100" : "text-gray-900"
        }`}
      >
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 min-h-[300px] md:min-h-full relative bg-blue-800">
            <LogoPanel />
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center">
            <FormPanel
              darkMode={darkMode}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              handleLogin={handleLogin}
              role={role}
              setRole={setRole}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- LOGO PANEL ---------------- */

function LogoPanel() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-white">
      <Shield className="w-14 h-14 text-white mb-6" />
      <h1 className="text-3xl font-bold">PharmaFlow</h1>
    </div>
  );
}

/* ---------------- FORM PANEL ---------------- */

function FormPanel({
  darkMode,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  handleLogin,
  role,
  setRole,
}) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h2
          className={`text-2xl font-bold ${
            darkMode ? "text-blue-200" : "text-blue-800"
          } mb-2`}
        >
          Welcome Back
        </h2>
        <p
          className={`text-sm ${
            darkMode ? "text-blue-300" : "text-blue-600"
          }`}
        >
          Sign in to access your dashboard
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        {/* Email */}
        <InputField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          icon="Mail"
        />

        {/* Password */}
        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="***********"
          icon="Lock"
          showToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        {/* ROLE SELECTOR */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-800">
            Login As
          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full py-3 px-4 rounded-lg border border-gray-300 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="admin">Admin</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="warehouse">Warehouse Owner</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold text-blue-100
            bg-gradient-to-r from-blue-500 to-blue-700
            hover:from-blue-700 hover:to-blue-800
            shadow-lg"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

/* ---------------- INPUT FIELD ---------------- */

function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  showToggle,
  showPassword,
  onTogglePassword,
}) {
  const IconComponent = icon === "Mail" ? Mail : Lock;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-blue-800">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <IconComponent className="w-5 h-5" />
        </div>

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />

        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}