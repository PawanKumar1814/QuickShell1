import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Kanbanboard from './Kanbanboard';
import './App.css'; // Assuming you have a CSS file for styling
//import Dropdownbutton from './Dropdownbutton';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch tickets and users data from the API using Axios
    axios
      .get('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then((response) => {
        console.log("response: ",response)
        if (response && response.data) {
          setTickets(response.data.tickets);
          setUsers(response.data.users);
        } else {
          setError('Unexpected response format');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch tickets');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      
      {tickets.length > 0 ? (
        <div>
        {/* <Dropdownbutton/> */}
        <Kanbanboard tickets={tickets} users={users} />
        </div>
      ) : (
        <p>No tickets available</p>
      )}
    </div>
  );
};

export default App;
