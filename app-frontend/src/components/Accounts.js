import React, { useEffect, useState } from 'react';

const Accounts = ({ accessToken }) => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch('http://localhost:3001/api/accounts', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await response.json();
        console.log('Accounts fetched:', data)
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts from backend:', error);
      }
    };

    fetchAccounts();
  }, [accessToken]);

  return (
    <div>
      <h1>Accounts Information</h1>
      {accounts.length ? accounts.map(account => (
      <div key={account.id}>
        <p>{account.name} - Ledger Balance: {account.balances?.ledger ?? "N/A"}, Available Balance: {account.balances?.available ?? "N/A"}</p>
      </div>
)) : <p>No accounts found or loading...</p>}
    </div>
  );
}

export default Accounts;
