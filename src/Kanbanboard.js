import React, { useState, useEffect } from 'react';
import './KanbanBoard.css'; // Ensure your styles are imported

// Importing icons (add these files to your project)
import TodoIcon from './assets/icons_FEtask/todo.svg';
import InProgressIcon from './assets/icons_FEtask/in-progress.svg';
import DoneIcon from './assets/icons_FEtask/done.svg';
import BacklogIcon from './assets/icons_FEtask/backlog.svg';
import CanceledIcon from './assets/icons_FEtask/canceled.svg';

import LowPriorityIcon from './assets/icons_FEtask/low.svg';
import MediumPriorityIcon from './assets/icons_FEtask/medium.svg';
import HighPriorityIcon from './assets/icons_FEtask/high.svg';
import UrgentIcon from './assets/icons_FEtask/urgent.svg';
import NoPriorityIcon from './assets/icons_FEtask/canceled.svg';

import UserIcon from './assets/icons_FEtask/Display.svg';
import PlusIcon from './assets/icons_FEtask/add.svg';
import DotsIcon from './assets/icons_FEtask/3-dotmenu.svg';

const Kanbanboard = ({ tickets, users}) => {
  const [groupBy, setGroupBy] = useState('status');
  const [sortBy, setSortBy] = useState('priority');
  const [mainDropdownOpen, setMainDropdownOpen] = useState(false);
  const [groupByDropdownOpen, setGroupByDropdownOpen] = useState(false);
  const [sortByDropdownOpen, setSortByDropdownOpen] = useState(false);

  // Function to group tickets based on the selected option
  const groupTickets = (tickets, groupBy) => {
    if (!Array.isArray(tickets)) {
      console.error('Expected tickets to be an array but got:', tickets);
      return {};
    }
    

    switch (groupBy) {
      case 'status':
        return tickets.reduce((acc, ticket) => {
          const status = ticket.status.toLowerCase(); 
          acc[status] = acc[status] || [];
          acc[status].push(ticket);
          return acc;
        }, {});

      case 'user':
        return tickets.reduce((acc, ticket) => {
          const userId = ticket.userId;
          acc[userId] = acc[userId] || [];
          acc[userId].push(ticket);
          return acc;
        }, {});

      case 'priority':
        return tickets.reduce((acc, ticket) => {
          const priority = ticket.priority;
          acc[priority] = acc[priority] || [];
          acc[priority].push(ticket);
          return acc;
        }, {});

      default:
        return {};
    }
  };

  const priorityMapping = {
    0: 'No priority',
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Urgent',
  };

  const getPriorityName = (priorityId) => {
    return priorityMapping[priorityId] || 'Unknown Priority'; 
  };

  // Function to sort tickets based on selected option
  const sortTickets = (tickets, sortBy) => {
    return [...tickets].sort((a, b) => {
      if (sortBy === 'priority') {
        return b.priority - a.priority; 
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title); 
      }
      return 0;
    });
  };

  // Group tickets based on selected option
  const groupedTickets = groupTickets(tickets, groupBy);

  // Sort tickets inside each group based on selected option
  const sortedGroupedTickets = Object.keys(groupedTickets).reduce((acc, group) => {
    acc[group] = sortTickets(groupedTickets[group], sortBy); 
    return acc;
  }, {});

  // Add empty columns for missing statuses when grouping by status
  const allStatuses = ['todo', 'in progress', 'done', 'backlog', 'canceled'];
  if (groupBy === 'status') {
    allStatuses.forEach((status) => {
      if (!sortedGroupedTickets[status]) {
        sortedGroupedTickets[status] = [];
      }
    });
  }

  // Function to generate initials (first letter of first and last name)
const generateInitials = (name) => {
  const nameParts = name.split(" ");  
  const firstNameInitial = nameParts[0][0].toUpperCase(); 
  const lastNameInitial = nameParts.length > 1 ? nameParts[1][0].toUpperCase() : ''; // Get the first letter of last name
  return firstNameInitial + lastNameInitial; // Combine initials
};

// Function to generate a random color based on the name string
const generateRandomColor = (string) => {
  // Use a hash of the string to generate a color
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`; // Generates a color based on the hash value
  return color;
};


  // Function to render the appropriate icon based on the group
  const renderGroupIcon = (group) => {
    // If grouped by status, show the corresponding status icon
    if (groupBy === 'status') {
      switch (group) {
        case 'todo':
          return <img src={TodoIcon} alt="Todo" className="group-icon" />;
        case 'in progress':
          return <img src={InProgressIcon} alt="In Progress" className="group-icon" />;
        case 'done':
          return <img src={DoneIcon} alt="Done" className="group-icon" />;
        case 'backlog':
          return <img src={BacklogIcon} alt="Backlog" className="group-icon" />;
        case 'canceled':
          return <img src={CanceledIcon} alt="Canceled" className="group-icon" />;
        default:
          return null;
      }
    }
  
    // If grouped by user, find and render the user's icon
    if (groupBy === 'user') {
      // Find user by ID from the passed user data
      const user = users.find(user => user.id === group);
      
      if (user) {
        const initials = generateInitials(user.name); // Get initials
        const color = generateRandomColor(user.name); // Get color based on user name
        
        // Create a circle with initials and dynamic color
        return (
          <div
            style={{
              backgroundColor: color,
              color: 'white',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '12px',
              textTransform: 'uppercase',
            }} 
            className='group-icon'
            title={user.name}  // Add tooltip with full name on hover
          >
            {initials}
          </div>
        );
      }
    }
  
    // If grouped by priority, show the corresponding priority icon
    if (groupBy === 'priority') {
      switch (group) {
        case '0':
          return <img src={NoPriorityIcon} alt="No Priority" className="group-icon" />;
        case '1':
          return <img src={LowPriorityIcon} alt="Low Priority" className="group-icon" />;
        case '2':
          return <img src={MediumPriorityIcon} alt="Medium Priority" className="group-icon" />;
        case '3':
          return <img src={HighPriorityIcon} alt="High Priority" className="group-icon" />;
        case '4':
          return <img src={UrgentIcon} alt="Urgent" className="group-icon" />;
        default:
          return null;
      }
    }
  
    return null;
  };
  

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);  // Find user by ID
    return user ? user.name : 'Unknown User';  // Return name or fallback to 'Unknown User'
  };

  return (
    <div className="kanban-board">
      <div className="controls">
        <div className="main-dropdown">
          <button
            className="main-dropdown-btn"
            onClick={() => setMainDropdownOpen(!mainDropdownOpen)}
          >
            Display
          </button>
          {mainDropdownOpen && (
            <div className="main-dropdown-content">
              <div className="dropdown-option">
                <button
                  className="dropdown-toggle"
                  onClick={() => setGroupByDropdownOpen(!groupByDropdownOpen)}
                >
                  Group By
                </button>
                {groupByDropdownOpen && (
                  <div className="dropdown-menu">
                    <ul>
                      <li onClick={() => setGroupBy('status')}>Status</li>
                      <li onClick={() => setGroupBy('user')}>User</li>
                      <li onClick={() => setGroupBy('priority')}>Priority</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="dropdown-option">
                <button
                  className="dropdown-toggle"
                  onClick={() => setSortByDropdownOpen(!sortByDropdownOpen)}
                >
                  Sort By
                </button>
                {sortByDropdownOpen && (
                  <div className="dropdown-menu">
                    <ul>
                      <li onClick={() => setSortBy('priority')}>Priority</li>
                      <li onClick={() => setSortBy('title')}>Title</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="board-columns">
        {/* Conditional rendering based on groupBy */}
        {groupBy === 'status' &&
          allStatuses.map((status) => (
            <div className="column" key={status}>
              <div className="column-header">
                {renderGroupIcon(status)}
                <h3>
                  {status.charAt(0).toUpperCase() + status.slice(1)}{' '}
                  <span className="ticket-count">{sortedGroupedTickets[status]?.length || 0}</span>
                </h3>
                {/* Add "+" and "..." icons */}
                <div className="column-actions">
                  <img src={PlusIcon} alt="Add" className="icon" />
                  <img src={DotsIcon} alt="More" className="icon" />
                </div>
              </div>
              {sortedGroupedTickets[status] && sortedGroupedTickets[status].length > 0 ? (
                sortedGroupedTickets[status].map((ticket) => (
                  <div key={ticket.id} className="ticket-card">
                    <p>{ticket.id}</p>
                    <h4>{ticket.title}</h4>
                    <p><strong>Tags:</strong> {ticket.tag.join(', ')}</p>
                  </div>
                ))
              ) : (
                <div className="empty-column">No tickets</div>
              )}
            </div>
          ))}

        {/* Conditional rendering for user grouping */}
        {groupBy === 'user' &&
          Object.keys(sortedGroupedTickets).map((userId) => (
            <div className="column" key={userId}>
              <div className="column-header">
              {renderGroupIcon(userId)}
              <h3>
                {users.find(user => user.id === userId)?.name}
                <span className="ticket-count">{sortedGroupedTickets[userId]?.length || 0}</span>
              </h3>
                {/* Add "+" and "..." icons */}
                <div className="column-actions">
                  <img src={PlusIcon} alt="Add" className="icon" />
                  <img src={DotsIcon} alt="More" className="icon" />
                </div>
              </div>
              {sortedGroupedTickets[userId].length > 0 ? (
                sortedGroupedTickets[userId].map((ticket) => (
                  <div key={ticket.id} className="ticket-card">
                    <p>{ticket.id}</p>
                    <h4>{ticket.title}</h4>
                    <p><strong>Tags:</strong> {ticket.tag.join(', ')}</p>
                  </div>
                ))
              ) : (
                <div className="empty-column">No tickets</div>
              )}
            </div>
          ))}

        {/* Conditional rendering for priority grouping */}
        {groupBy === 'priority' &&
          Object.keys(sortedGroupedTickets).map((priority) => (
            <div className="column" key={priority}>
              <div className="column-header">
                {renderGroupIcon(priority)}
                <h3>
                  {priorityMapping[priority].charAt(0).toUpperCase() + priorityMapping[priority].slice(1)}{' '}
                  <span className="ticket-count">{sortedGroupedTickets[priority]?.length || 0}</span>
                </h3>
                {/* <h3>{getPriorityName(priority)}</h3> */}
                {/* Add "+" and "..." icons */}
                <div className="column-actions">
                  <img src={PlusIcon} alt="Add" className="icon" />
                  <img src={DotsIcon} alt="More" className="icon" />
                </div>
              </div>
              {sortedGroupedTickets[priority].length > 0 ? (
                sortedGroupedTickets[priority].map((ticket) => (
                  <div key={ticket.id} className="ticket-card">
                    <p>{ticket.id}</p>
                    <h4>{ticket.title}</h4>
                    <p><strong>Tags:</strong> {ticket.tag.join(', ')}</p>
                  </div>
                ))
              ) : (
                <div className="empty-column">No tickets</div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Kanbanboard;
