import React from 'react';
import Register from '../components/auth/register';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-[#272727] flex flex-col w-screen overflow-hidden">
      <div className="p-1 relative w-32 h-32">
        <img src={logo} alt="Gamers Needs Logo" className="w-full h-full rounded-full"/>
        <Link to="/" className="absolute inset-0 rounded-full"/>
      </div>
      <div className="flex-1 flex justify-center items-center -mt-20">
        <div className="w-full max-w-2xl px-8">
          <Register />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;