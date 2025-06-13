import React from 'react';
import URLForm from '../components/URLForm';
import URLList from '../components/URLList';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-orange-400">URL Shortener Dashboard</h1>
      <URLForm />
      <URLList />
    </div>
  );
};

export default Home;
