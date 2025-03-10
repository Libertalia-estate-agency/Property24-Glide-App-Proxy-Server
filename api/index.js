const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors()); // Allow requests from any frontend
app.use(bodyParser.json());     // parse application/json
app.use(morgan('dev'));

const PROPERTY24_API_BASE = "https://api.property24.com/listing/v52";
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

//app.use('/', proxy);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");  // Allow all origins (you can restrict this to specific domains for security)
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


app.get("/", async (req, res) => {
  res.send("WELCOME TO PROPERTY24 PROXY SERVER");
});



// API Key (if required)
//const API_KEY = process.env.PROPERTY24_API_KEY; // Store this in a .env file

// Middleware for Authentication (If API Key is required)
/**
const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`,
  "User-Agent": "Node.js/Express"
});
 */

app.get("/echo", async (req, res, next) => {
  try {
      
      const url = `${PROPERTY24_API_BASE}/echo`;
      console.log("URL :: " + JSON.stringify(url)); 

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
                  
                  res.status(200).json(response.data);
              })
              .catch(function (error) {
                  console.error(error);
              });
        
              //res.json(response);
              next();
  } catch(error) {

      console.log("ERROR :::: " + error)
      //res.status(500).json({ message: error });
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
                  
                  res.status(200).json(response.data);
              })
              .catch(function (error) {
                  console.error(error);
              });

      //res.json(response);

      next();
  } catch(error) {

      console.log("ERROR :::: " + error)
      res.status(500).json({ message: error });
  }
});

app.get("/agents/:agentId", async (req, res, next) => {
  try {
      console.log("REQ PARAMS :: " + JSON.stringify(req.params)); 
      console.log("REQ QUERY :: " + JSON.stringify(req.query)); 

      //const url = 'https://api.exdev.property24-test.com/listing/v49/agents/75003';
      //const url = `${PROPERTY24_API_BASE}/agents/${req.query}`;
      const url = `${PROPERTY24_API_BASE}/agents/${req.params.agentId}`;

      const options = {
        params: { agentId: req.params.agentId},
        headers: {
          Authorization: getAuthHeader(), // Fix authentication
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip, deflate, br",
          "Access-Control-Allow-Origin": "*",
        },
    };
    
      //console.log("REQ PROTOCOL :: " + (req.protocol)); 

      //console.log("REQ PROTOCOL :: " + (req.protocol)); 
      //console.log("REQ HOSTNAME :: " + (req.hostname)); 
      //console.log("REQ PATH :: " + (req.path)); 
      //console.log("REQ ORIGINAL URL :: " + (req.originalUrl)); 
      //console.log("REQ SUBDOMAINS :: " + (req.subdomains)); 
      
      const response = await axios.get(url, options)
              .then(function (response) {
                  //console.log("Property24 RESPONSE ::: " + JSON.stringify(response.data));
                  //console.log("RESPONSE HEADERS :::: " + response.headers);
                  //console.log("RESPONSE STATUS :::: " + response.status);
                  //console.log("RESPONSE CONFIG :::: " + JSON.stringify(response.config));
                  //console.log("RESPONSE REQUEST :::: " + (response.request).json);
                  //console.log("RESPONSE STATUS TEXT :::: " + response.statusText);
                  
                  res.status(200).json(response.data);
              })
              .catch(function (error) {
                  console.error(error);
              });
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
      },
  };
       
      //console.log("REQ PROTOCOL :: " + (req.protocol)); 
      //console.log("RES HOSTNAME :: " + (req.hostname)); 
      //console.log("REQ PATH :: " + (req.path)); 
      //console.log("REQ ORIGINAL URL :: " + (req.originalUrl)); 
      //console.log("REQ SUBDOMAINS :: " + (req.subdomains)); 
      
      const response = await axios.get(url, options)
              .then(function (response) {
                  //console.log("Property24 RESPONSE ::: " + JSON.stringify(response.data));
                   //console.log("RESPONSE HEADERS :::: " + response.headers);
                  //console.log("RESPONSE STATUS :::: " + response.status);
                  //console.log("RESPONSE CONFIG :::: " + JSON.stringify(response.config));
                  //console.log("RESPONSE REQUEST :::: " + (response.request).json);
                  //console.log("RESPONSE STATUS TEXT :::: " + response.statusText);
                  
                  res.status(200).json(response.data);
              })
              .catch(function (error) {
                  console.error(error);
              });

              //res.json(response.data);

          next();

  } catch(error) {

      console.log("ERROR :::: " + error)
      res.status(500).json({ message: error });
  }
});


// Route to Create an Agent
app.put("/agents/:agentId/profile-picture", async (req, res, next) => {
  try {
      
    
    const { agentId } = req.params;
    console.log("AGENT ID :: " + agentId);
    const { bytes,mimeContentType, caption } = req.body;
    //console.log("REQ BODY :: " + JSON.stringify(req.body));

    console.log("Received image size:", Buffer.byteLength(bytes, "base64"), "bytes");

    const url = `${PROPERTY24_API_BASE}/agents/${agentId}/profile-picture`;

    const options = {
      headers: {
        Authorization: getAuthHeader(), // Fix authentication
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
  };
       
      //console.log("REQ PROTOCOL :: " + (req.protocol)); 
      //console.log("RES HOSTNAME :: " + (req.hostname)); 
      //console.log("REQ PATH :: " + (req.path)); 
      //console.log("REQ ORIGINAL URL :: " + (req.originalUrl)); 
      //console.log("REQ SUBDOMAINS :: " + (req.subdomains)); 
      
      const payload = {
        bytes: bytes, // The image data in base64 or raw bytes
        mimeContentTyp: mimeContentType,
        caption: caption,

      };

      const response = await axios.put(url,payload, options)
              .then(function (response) {
                  //console.log("Property24 RESPONSE ::: " + JSON.stringify(response.data));
                   //console.log("RESPONSE HEADERS :::: " + response.headers);
                  //console.log("RESPONSE STATUS :::: " + response.status);
                  //console.log("RESPONSE CONFIG :::: " + JSON.stringify(response.config));
                  //console.log("RESPONSE REQUEST :::: " + (response.request).json);
                  //console.log("RESPONSE STATUS TEXT :::: " + response.statusText);
                  
                  res.status(response.status).json(response.data);
              })
              .catch(function (error) {
                  console.error(error);
              });
              //res.status(response.status).json(response.data);

              //res.json(response.data);

          next();

  } catch(error) {

      console.log("ERROR :::: " + error)
      res.status(500).json({ message: error });
  }
});

// Update Agent Info Endpoint
app.put("/agents", async (req, res) => {
  try {
     
    const agentData = req.body; // JSON body from Glide
    //console.log("REQ BODY :: " + JSON.stringify(req.body));

    if (!agentData || Object.keys(agentData).length === 0) {
      return res.status(400).json({ error: "Missing agent data" });
    }

    //console.log("Received agent update data:", agentData);

    const url = `${PROPERTY24_API_BASE}/agents`;

    const options = {
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
    };

    const response = await axios.put(url, agentData, options);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error updating agent info:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to update agent information" });
  }
});


app.post("/agents", async (req, res, next) => {
  try {
      
      const url = `${PROPERTY24_API_BASE}/agents`;

      //console.log("ECHO GET ::: QUERY :: " + JSON.stringify(url)); 
      
      const options = {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      };
      
      //console.log("REQ PARAMS :: " + JSON.stringify(req.params)); 

      const agentData = req.body;      
      //console.log("REQ BODY :::: " + JSON.stringify(req.body));
      
      //console.log("REQ PROTOCOL :: " + (req.protocol)); 
      //console.log("REQ HOSTNAME :: " + (req.hostname)); 
      //console.log("REQ PATH :: " + (req.path)); 
      //console.log("REQ ORIGINAL URL :: " + (req.originalUrl)); 
      //console.log("REQ SUBDOMAINS :: " + (req.subdomains)); 
      
      const response = await axios.post(url, agentData, options)
              .then(function (response) {
                  //console.log("Property24 RESPONSE ::: " + response.data);
                  //console.log("RESPONSE HEADERS :::: " + response.headers);
                  //console.log("RESPONSE STATUS :::: " + response.status);
                  //console.log("RESPONSE CONFIG :::: " + JSON.stringify(response.config));
                  //console.log("RESPONSE REQUEST :::: " + response.request);
                  //console.log("RESPONSE STATUS TEXT :::: " + response.statusText);
                  
                  res.status(response.status).json(response.data);
              })
              .catch(function (error) {
                  console.error(error);
              });
      next();

  } catch(error) {

      console.log("ERROR :::: " + error)
      res.status(500).json({ message: error });
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
