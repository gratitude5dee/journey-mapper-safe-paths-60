
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
