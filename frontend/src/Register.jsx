import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import AuthLayout from "./components/AuthLayout";
import AuthCard from "./components/AuthCard";
import AuthInput from "./components/AuthInput";
import GoogleButton from "./components/GoogleButton";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Simple password strength calculation
  const getPasswordStrength = () => {
    let score = 0;
    if (!password) return 0;
    if (password.length > 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(4, score);
  };

  const strength = getPasswordStrength();
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with full name
      await updateProfile(userCredential.user, { displayName: fullName });
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to create an account.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError("Failed to sign up with Google.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-slate-400">Join Salon AI Receptionist</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <AuthInput
            icon={FaUser}
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
          
          <AuthInput
            icon={FaEnvelope}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          
          <div className="mb-4">
            <AuthInput
              icon={FaLock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {password && (
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                  {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level} 
                      className={`h-full flex-1 border-r border-slate-900 last:border-0 ${level <= strength ? strengthColors[strength - 1] || 'bg-green-500' : 'bg-transparent'} transition-colors duration-300`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 w-12 text-right">
                  {strength <= 1 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Good" : "Strong"}
                </span>
              </div>
            )}
          </div>

          <AuthInput
            icon={FaLock}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />

          <div className="flex items-center text-sm mt-2">
            <label className="flex items-center text-slate-400 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mr-2 rounded border-slate-700 bg-slate-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-900" 
                disabled={loading}
              />
              <span className="select-none">
                I agree to the <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Terms and Conditions</a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6 flex justify-center items-center h-[52px]"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <div className="w-full h-px bg-slate-700"></div>
          <span className="px-4 text-sm text-slate-500 whitespace-nowrap">or continue with</span>
          <div className="w-full h-px bg-slate-700"></div>
        </div>

        <div className="mt-8">
          <GoogleButton onClick={handleGoogleSignup} text="Sign up with Google" disabled={loading} />
        </div>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default Register;