import React, { useState } from 'react';
import './NavBar.css';
import { IoSettingsOutline } from 'react-icons/io5';  
import { MdInbox, MdCall } from 'react-icons/md';    

// Functional component for the navigation bar that allows switching between tabs.
const NavBar = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('inbox');

  // Handles tab clicks, updates the active tab, and notifies parent component.
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab === 'allCalls');
  };

  return (
    <div className="navbar">
      <div className="navbar-header">
        <span className="navbar-title">Activity</span>
        <IoSettingsOutline className="settings-icon" />  
      </div>
      <div className="navbar-tabs">
        <button className={`tab ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => handleTabClick('inbox')}><MdInbox /> Inbox</button>
        <button className={`tab ${activeTab === 'allCalls' ? 'active' : ''}`} onClick={() => handleTabClick('allCalls')}><MdCall /> All calls</button>
      </div>
    </div>
  );
};

export default NavBar;
