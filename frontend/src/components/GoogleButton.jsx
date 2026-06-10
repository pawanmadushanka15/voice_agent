import React from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleButton({ onClick, text, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl py-3.5 px-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
    >
      <FcGoogle className="h-6 w-6" />
      <span>{text}</span>
    </button>
  );
}
