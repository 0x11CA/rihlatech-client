import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="text-center">
      <h1>404 - Page Not Found</h1>
      <Link to="/home">Go Back Home</Link>
    </div>
  );
};

export default ErrorPage;
