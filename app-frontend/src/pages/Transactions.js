import React, { useEffect, useState } from "react";

const Transactions = ({ accessToken }) => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch("http://localhost:3001/api/accounts", {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setAccounts(data);
        console.log("Fetched accounts:", data); // Log the accounts data
      } catch (error) {
        console.error("Error fetching accounts from backend:", error);
      }
    };

    fetchAccounts();
  }, [accessToken]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!accessToken || accounts.length === 0) {
        console.log('No accounts yet or no accessToken');
        return;
      }

      console.log('Fetching transactions for account:', accounts[0].id); // Log before making the request

      try {
        const response = await fetch(`http://localhost:3001/api/accounts/${accounts[0].id}/transactions`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const transactions = await response.json();
        setTransactions(transactions);
        console.log("Fetched transactions:", transactions); // Log the transactions data
      } catch (error) {
        console.error("Error fetching transactions from backend:", error);
      }
    };

    fetchTransactions();
  }, [accessToken, accounts]);

  return (
    <div>
      <h1>Transactions</h1>
      <p>Transactions: {JSON.stringify(transactions)} </p>
      <p>AccessTokenski: {accessToken}</p>
      <p>Accounts: {JSON.stringify(accounts)}</p>
    </div>
  );
};

export default Transactions;
