const express = require("express");
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require('cors');

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000',  // Allow only this origin to access
    methods: ['GET', 'POST'],  // Allowed methods
    credentials: true  // This allows the server to send cookies / set Authorization headers
}));

const httpsAgent = new https.Agent({
  cert: fs.readFileSync('./permissions/cert.pem'), // Path to your certificate
  key: fs.readFileSync('./permissions/pkey.pem'), // Path to your private key
});

// Endpoint to fetch accounts from Teller
app.get("/api/accounts", async (req, res) => {
  try {
      console.log("Received request for accounts");
      const accessToken = req.headers.authorization.split(' ')[1]; // Assuming the access token is sent as a Bearer token
      const auth = 'Basic ' + Buffer.from(accessToken + ':').toString('base64'); // Encode as Basic Auth
      const response = await axios.get('https://api.teller.io/accounts', {
          headers: {
              'Authorization': auth // Pass the encoded access token
          },
          httpsAgent: httpsAgent // Use the mTLS configured agent
      });
      res.json(response.data);
  } catch (error) {
      console.error('Failed to fetch accounts:', error);
      res.status(500).send('Failed to fetch accounts');
  }
});

// Endpoint to fetch transactions for a specific account
app.get("/api/accounts/:accountId/transactions", async (req, res) => {
  try {
      console.log("Received request for transactions");
      const accountId = req.params.accountId;  // Get the accountId from the URL parameters
      console.log("Account ID:", accountId);  // Log the accountId
      const accessToken = req.headers.authorization.split(' ')[1]; // Assuming the access token is sent as a Bearer token
      const auth = 'Basic ' + Buffer.from(accessToken + ':').toString('base64'); // Encode as Basic Auth
      const response = await axios.get(`https://api.teller.io/accounts/${accountId}/transactions`, {
          headers: {
              'Authorization': auth // Pass the encoded access token
          },
          httpsAgent: httpsAgent // Use the mTLS configured agent
      });
      res.json(response.data);
  } catch (error) {
      console.error('Failed to fetch transactions:', error);
      res.status(500).send('Failed to fetch transactions');
  }
});

// Existing hello message endpoint
app.get("/api", (req, res) => {
    console.log("HELLO!!!")
    res.json({ message: "Hello from server!!!" });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
