import React from 'react';
import error from "../assets/Images/error.webp";

const Error = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen text-white mt-2'>
      <h1 className='text-4xl font-bold text-yellow-100'>Error 404</h1>
      <p className='text-xl text-gray-300'>Page not found</p>
      <div className='mt-4'>
        <img
          src={error}
          alt='Error Illustration'
          className='h-[380px] w-auto object-cover rounded-md'
        />
      </div>
      <p className='mt-5 text-gray-600'>
        The page you are looking for does not exist.
      </p>
      <a
        href='/'
        className='mt-4 text-blue-300 hover:underline focus:outline-none focus:ring focus:ring-blue-300 underline'
      >
        Go back to the homepage.
      </a>
    </div>
  );
};

export default Error;
