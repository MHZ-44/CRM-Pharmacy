import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Lock } from "lucide-react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline"; // استيراد الأيقونات

export default function LoginPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950"
          : "bg-gradient-to-br from-white via-slate-400 to blue-100"
      }`}
    >
      {/* زر تغيير الوضع الداكن */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition ${
          darkMode ? "bg-gray-800 text-yellow-400" : "bg-white text-blue-700"
        }`}
      >
        {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
      </button>

      {/* الكارد الذي يحتوي على اللوغو والنموذج */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-6xl rounded-2xl 
          shadow-[0_30px_50px_rgba(0,0,0,0.25)] p-8 transition-colors duration-500 ${
          darkMode ? "bg-gray-900 text-gray-100" 
                   : " text-gray-900"
        }`}
      >
        <div className="flex flex-col md:flex-row">
          {/* الجزء الأيسر: لوغو */}
          <div className="w-full md:w-1/2 bg-left-gradient min-h-[300px] md:min-h-full relative">
            <LogoPanel />
          </div>

          {/* الجزء الأيمن: النموذج */}
          <div className="w-full md:w-1/2 bg-right-gradient p-6 md:p-12 flex items-center justify-center">
            <FormPanel
              darkMode={darkMode}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              handleLogin={handleLogin}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// مكون اللوغو
function LogoPanel() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 relative">
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="w-64 h-64 rounded-full bg-white animate-pulse-gradient" />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20"
        >
          <Shield className="w-14 h-14 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-3xl font-bold text-white mb-2"
        >
          PharmaFlow
        </motion.h1>
        
      </div>
    </div>
  );
}

// مكون النموذج (form)
function FormPanel({
  darkMode,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  handleLogin,
}) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h2
          className={`text-2xl font-bold ${darkMode ? "text-blue-200" : "text-blue-800"} mb-2`}
        >
          Welcome Back
        </h2>
        <p
          className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-600"}`}
        >
          Sign in to access your dashboard
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <InputField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          icon="Mail"
          darkMode={darkMode}
        />
        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="***********"
          icon="Lock"
          darkMode={darkMode}
          showToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
        <ForgotPasswordLink />
        <Button onClick={handleLogin} text="Sign In" />
      </form>
    </div>
  );
}

// مكون InputField
function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  darkMode,
  showToggle,
  showPassword,
  onTogglePassword,
}) {
  const IconComponent = icon === "Mail" ? Mail : Lock;

  return (
    <div className="space-y-2">
      <Label
        htmlFor={label.toLowerCase()}
        className={`text-sm font-medium ${darkMode ? "text-blue-300" : "text-blue-800"}`}
      >
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <IconComponent className="w-5 h-5" />
        </div>
        <input
          id={label.toLowerCase()}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}

// مكون Label
function Label({ htmlFor, className, children }) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
}

// مكون رابط "نسيت كلمة المرور"
function ForgotPasswordLink() {
  return (
    <div className="flex justify-end">
      <a
        href="#"
        className="text-sm text-blue-400 hover:text-blue-700 hover:underline transition-colors"
      >
        Forgot Password?
      </a>
    </div>
  );
}

// مكون زر تسجيل الدخول
function Button({ onClick, text }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-xl font-semibold text-blue-100
        bg-gradient-to-r from-blue-500 to-blue-700
        hover:from-blue-700 hover:to-blue-800
        shadow-lg"
    >
      {text}
    </button>
  );
}
