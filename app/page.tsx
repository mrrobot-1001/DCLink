"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import ConnectingPeopleSVG from "@/components/ConnectingPeopleSVG";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row"
      >
        <div className="w-full md:w-1/2 p-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold mb-2 text-indigo-600"
          >
            DCLink
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl font-semibold mb-6 text-gray-800"
          >
            {isLogin ? "Welcome Back!" : "Join Our Community"}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-4 text-sm text-gray-600"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:underline focus:outline-none transition-colors duration-300"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </motion.p>
        </div>
        <div className="w-full md:w-1/2 bg-indigo-100 flex items-center justify-center p-8">
          <ConnectingPeopleSVG />
        </div>
      </motion.div>
      <Toaster position="top-right" />
    </div>
  );
}
