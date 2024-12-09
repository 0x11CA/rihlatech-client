import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center py-3 bg-dark text-light">
      <p>&copy; {new Date().getFullYear()} CP Platform. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
