import React, { useEffect, useState } from 'react';

const Accounts = ({ accessToken }) => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!accessToken) return;  // Check if access token is not null

      try {
        const response = await fetch('http://localhost:3001/api/accounts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`  // Pass the access token
          }
        });
        const data = await response.json();
        setAccounts(data);  // Assuming the response data is the accounts array
        console.log(data);  // Log the accounts data
      } catch (error) {
        console.error('Error fetching accounts from backend:', error);
      }
    };

    fetchAccounts();
  }, [accessToken]);  // Dependency on accessToken to refetch when it changes

  return (
    <div>
      <h1>Accounts Information</h1>
      {accounts.length ? accounts.map(account => (
        <p key={account.id}>{account.name} - Balance: {account.balance}</p>
      )) : <p>No accounts found or loading...</p>}
    </div>
  );
}

export default Accounts;
