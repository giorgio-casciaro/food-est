import React from 'react';
import './AdminPage.css'; // Import CSS file for styling

function AdminPage() {
  return (
    <div>
      <div className="admin-bar">
        <div className="admin-logo">
          <img src="admin-logo.png" alt="Admin Logo" />
        </div>
        <ul className="admin-menu">
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Users</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </div>
      
      <div className="content">
        {/* Your main content goes here */}
        <h1>Welcome to the Admin Page</h1>
        <p>This is where you can manage your website.</p>
      </div>
    </div>
  );
}

export default AdminPage;