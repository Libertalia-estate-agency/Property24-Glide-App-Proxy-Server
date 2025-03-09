const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Allow requests from any frontend
app.use(bodyParser.json());     // parse application/json
app.use(morgan('dev'));

const PROPERTY24_API_BASE = "https://api.property24.com/listing/v52/";
const API_USERNAME = "38530@libertaliaproperties.co.za";
const API_PASSWORD = "Autumn2025";
const AGENCY_ID = "38530";

// Function to generate Basic Auth header
const getAuthHeader = () => {
  
  const auth = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64");
  return `Basic ${auth}`;
};

const proxyOptions = {
  target: PROPERTY24_API_BASE,
  changeOrigin: true,
  pathRewrite: {
      ['']:''
  },
}

const proxy = createProxyMiddleware(proxyOptions);

app.use('/', proxy);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");  // Allow all origins (you can restrict this to specific domains for security)
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


app.get("/", async (req, res, next) => {
  try {
      
      res.send("WELCOME TO PROPERTY24 PROXY SERVER");

  } catch(error) {

      console.log("ERROR :::: " + error)
      res.status(500).json({ message: error });
  }
});


// API Key (if required)
//const API_KEY = process.env.PROPERTY24_API_KEY; // Store this in a .env file

// Middleware for Authentication (If API Key is required)
const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`,
  "User-Agent": "Node.js/Express"
});


app.get("/echo", async (req, res, next) => {
  try {
      
      //const url = baseURL + '';
      const url = 'https://api.property24.com/listing/v52';
      console.log("ECHO GET ::: QUERY :: " + JSON.stringify(req.query)); 
      
      const options = {
          headers: {
              'Content-Type': 'application/json',
              'Accept-Encoding': 'gzip, deflate, br',
              'Access-Control-Allow-Origin': '*'
          },
          params: { stringToEcho: req.query.stringToEcho},
      }; 
      
      ///console.log("REQ HEADERS :: " + JSON.stringify(req.headers)); 
      
      //console.log("REQ PROTOCOL :: " + (req.protocol)); 
      //console.log("REQ HOSTNAME :: " + (req.hostname)); 
      //console.log("REQ PATH :: " + (req.path)); 
      //console.log("REQ ORIGINAL URL :: " + (req.originalUrl)); 
      //console.log("REQ SUBDOMAINS :: " + (req.subdomains)); 
      
      const response = await axios.get(url, options)
              .then(function (response) {
                  console.log("Property24 RESPONSE ::: " + response.data);
                  //console.log("RESPONSE HEADERS :::: " + response.headers);
                  //console.log("RESPONSE STATUS :::: " + response.status);
                  //console.log("RESPONSE CONFIG :::: " + JSON.stringify(response.config));
                  //console.log("RESPONSE REQUEST :::: " + response.request);
                  //console.log("RESPONSE STATUS TEXT :::: " + response.statusText);
                  
                  //res.status(200).json(response.data);
              })
              .catch(function (error) {
                  console.error(error);
              });
        
              res.json(response.data);
              next();
  } catch(error) {

      console.log("ERROR :::: " + error)
      res.status(500).json({ message: error });
  }
});


app.get("/echo-authenticated", async (req, res, next) => {
  try {
      
    const url = `${PROPERTY24_API_BASE}/echo-authenticated`;
      console.log("ECHO GET ::: QUERY :: " + JSON.stringify(req.query)); 
      
      
      const options = {
          params: { stringToEcho: req.query.stringToEcho},
          headers: {
            Authorization: getAuthHeader(), // Fix authentication
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip, deflate, br",
            "Access-Control-Allow-Origin": "*",
          },
      };
      
      //console.log("REQ PARAMS :: " + JSON.stringify(req.params)); 
      
      //console.log("REQ PROTOCOL :: " + (req.protocol)); 
      //console.log("REQ HOSTNAME :: " + (req.hostname)); 
      //console.log("REQ PATH :: " + (req.path)); 
      //console.log("REQ ORIGINAL URL :: " + (req.originalUrl)); 
      //console.log("REQ SUBDOMAINS :: " + (req.subdomains)); 
      
      const response = await axios.get(url, options)
              .then(function (response) {
                  console.log("Property24 RESPONSE ::: " + response.data);
                  //console.log("RESPONSE HEADERS :::: " + response.headers);
                  //console.log("RESPONSE STATUS :::: " + response.status);
                  //console.log("RESPONSE CONFIG :::: " + JSON.stringify(response.config));
                  //console.log("RESPONSE REQUEST :::: " + response.request);
                  //console.log("RESPONSE STATUS TEXT :::: " + response.statusText);
                  
                  //res.status(200).json(response.data);
              })
              .catch(function (error) {
                  console.error(error);
              });

      res.json(response.data);

      next();
  } catch(error) {

      console.log("ERROR :::: " + error)
      res.status(500).json({ message: error });
  }
});


app.get("/agencies/:agencyId/agents", async (req, res, next) => {
  try {
      
    const url = `${PROPERTY24_API_BASE}/agencies/${AGENCY_ID}/agents`;
      
    const options = {
      headers: {
        Authorization: getAuthHeader(), // Fix authentication
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Access-Control-Allow-Origin": "*",
        "User-Agent": "Node.js/Express"
      },
  };
       
      //console.log("REQ PROTOCOL :: " + (req.protocol)); 
      //console.log("RES HOSTNAME :: " + (req.hostname)); 
      //console.log("REQ PATH :: " + (req.path)); 
      //console.log("REQ ORIGINAL URL :: " + (req.originalUrl)); 
      //console.log("REQ SUBDOMAINS :: " + (req.subdomains)); 
      
      const response = await axios.get(url, options)
              .then(function (response) {
                  console.log("Property24 RESPONSE ::: " + JSON.stringify(response.data));
                   //console.log("RESPONSE HEADERS :::: " + response.headers);
                  //console.log("RESPONSE STATUS :::: " + response.status);
                  //console.log("RESPONSE CONFIG :::: " + JSON.stringify(response.config));
                  //console.log("RESPONSE REQUEST :::: " + (response.request).json);
                  //console.log("RESPONSE STATUS TEXT :::: " + response.statusText);
                  
                  //res.status(200).json(response.data);
              })
              .catch(function (error) {
                  console.error(error);
              });

              res.json(response.data);

          next();

  } catch(error) {

      console.log("ERROR :::: " + error)
      res.status(500).json({ message: error });
  }
});

app.put("/agents/:agentId/profile-picture", async (req, res, next) => {
  try {
      
    const url = `${PROPERTY24_API_BASE}/agents/${req.query}/profile-picture`;
      
    const options = {
      headers: {
        Authorization: getAuthHeader(), // Fix authentication
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Access-Control-Allow-Origin": "*",
        "User-Agent": "Node.js/Express"
      },
  };
       
      //console.log("REQ PROTOCOL :: " + (req.protocol)); 
      //console.log("RES HOSTNAME :: " + (req.hostname)); 
      //console.log("REQ PATH :: " + (req.path)); 
      //console.log("REQ ORIGINAL URL :: " + (req.originalUrl)); 
      //console.log("REQ SUBDOMAINS :: " + (req.subdomains)); 
      
      const response = await axios.put(url, options)
              .then(function (response) {
                  console.log("Property24 RESPONSE ::: " + JSON.stringify(response.data));
                   //console.log("RESPONSE HEADERS :::: " + response.headers);
                  //console.log("RESPONSE STATUS :::: " + response.status);
                  //console.log("RESPONSE CONFIG :::: " + JSON.stringify(response.config));
                  //console.log("RESPONSE REQUEST :::: " + (response.request).json);
                  //console.log("RESPONSE STATUS TEXT :::: " + response.statusText);
                  
                  //res.status(200).json(response.data);
              })
              .catch(function (error) {
                  console.error(error);
              });

              res.json(response.data);

          next();

  } catch(error) {

      console.log("ERROR :::: " + error)
      res.status(500).json({ message: error });
  }
});

// Route to Create an Agent
app.post("/agents", async (req, res) => {
  try {
    const response = await axios.post(`${PROPERTY24_API_BASE}/agents`, req.body, {
      headers: getHeaders(),
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error creating agent:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: "Failed to create agent" });
  }
});

//Route to Update Agent Profile Picture



// Route to Create a Listing
app.post("/listings", async (req, res) => {
  try {
    const response = await axios.post(`${PROPERTY24_API_BASE}/listings`, req.body, {
      headers: getHeaders(),
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error creating listing:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: "Failed to create listing" });
  }
});

// Route to Fetch Listings
app.get("/listings", async (req, res) => {
  try {
    const response = await axios.get(`${PROPERTY24_API_BASE}/listings`, {
      headers: getHeaders(),
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching listings:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: "Failed to fetch listings" });
  }
});


// Start the server locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running locally at http://localhost:${PORT}`);
  });
}


/**
 * Start Server
 */
// Export the Express app for Vercel
module.exports = app;
