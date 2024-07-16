"use client"
import { LogIn, Activity } from 'lucide-react';
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900">
       <Activity size={64} className="text-gray-700" />
      <div className="text-center">
        <h1 className="mt-4 text-4xl font-extrabold sm:text-6xl">
          Text to Diagram
        </h1>
        <p className="mt-2 text-lg sm:text-2xl">
          Transform your text into beautiful diagrams effortlessly
        </p>
      </div>

      <div className="mt-12">
        <LoginLink postLoginRedirectURL="/dashboard">
          <button className="inline-flex items-center px-8 py-4 text-lg font-medium text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-200">
            <LogIn size={32} className="mr-3" />
            Login
          </button>
        </LoginLink>
      </div>
    </div>
  );
}