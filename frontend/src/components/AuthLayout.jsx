import React from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaCalendarCheck, FaRobot, FaStar } from 'react-icons/fa';

const features = [
  { icon: FaMicrophone, title: "Voice Booking", desc: "Book appointments using your voice easily." },
  { icon: FaCalendarCheck, title: "Smart Scheduling", desc: "Find the perfect time slots automatically." },
  { icon: FaRobot, title: "AI-Powered Assistance", desc: "Get answers to your queries instantly." },
  { icon: FaStar, title: "Personalized Experience", desc: "Tailored recommendations just for you." },
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white flex">
      {/* Left Column (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        
        <div className="relative z-10 max-w-xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-6"
          >
            Salon AI Receptionist
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-300 mb-12"
          >
            Your intelligent assistant for salon bookings and customer support.
          </motion.p>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <feature.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-200">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden pointer-events-none"></div>
        <div className="relative z-10 w-full flex justify-center">
            {children}
        </div>
      </div>
    </div>
  );
}
