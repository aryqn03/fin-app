const express = require("express");
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

const httpsAgent = new https.Agent({
  cert: fs.readFileSync('./permissions/cert.pem'),
  key: fs.readFileSync('./permissions/pkey.pem'),
});

app.get("/api/accounts", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const auth = 'Basic ' + Buffer.from(accessToken + ':').toString('base64');

    const accountsResponse = await axios.get('https://api.teller.io/accounts', {
      headers: { 'Authorization': auth },
      httpsAgent: httpsAgent
    }); 

    balancePromises = accountsResponse.data.map(account =>
        axios.get(account.links.balances, { // Using the specific balance link for each account
          headers: { 'Authorization': auth },
          httpsAgent: httpsAgent
        }).then(balanceResponse => {
          console.log("Balance data for account", account.id, ":", balanceResponse.data); // Log balance data
          return {
            ...account,
            balances: balanceResponse.data
          };
        }).catch(err => {
          console.error(`Failed to fetch balance for account ${account.account_id}:`, err);
          return { ...account, balances: null }; // Handle error by setting balances to null
        })
      );

      const accountsWithBalances = await Promise.all(balancePromises);
      console.log("Final data sent to frontend:", accountsWithBalances); // Log the final data
      res.json(accountsWithBalances);      
  } catch (error) {
    console.error('Failed to fetch accounts or balances:', error);
    res.status(500).send('Failed to fetch accounts or balances');
  }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
