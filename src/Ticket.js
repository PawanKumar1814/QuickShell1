import React from 'react';

const Ticket = ({ ticket, users }) => {
  // Find the user associated with the ticket
  const user = users ? users.find(user => user.id === ticket.userId) : null;

  return (
    <div className="ticket-card">
      <p>{ticket.id}</p>
      <h4>{ticket.title}</h4>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Priority:</strong> {ticket.priority}</p>
      <p><strong>Tags:</strong> {ticket.tag.join(', ')}</p>
      {user && <p><strong>Assigned to:</strong> {user.name}</p>}
    </div>
  );
};

export default Ticket;
