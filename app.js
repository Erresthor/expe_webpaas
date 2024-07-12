console.log('Instantiating server on node environment ' + process.env.NODE_ENV);
// Load environment variables
require("./loadEnvironment");


const mongodb = require("mongodb")
const config = require("platformsh-config").config();
if (!config.isValidPlatform()) {
    process.exit('Not in a Platform.sh Environment.');
}



// Setting up database connections
console.log('Atlas URI,MAIN DATABASE : ');
console.log(process.env.ATLAS_URI);

process.env.INCOMPLETE_URI = process.env.ATLAS_URI.split("?")[0] + "_inc" + "?" + process.env.ATLAS_URI.split("?")[1]
console.log('Atlas URI,INCOMPLETE DATABASE : ');
console.log(process.env.INCOMPLETE_URI);
console.log("________________________________________________________________")

// Import my modules : 
var express = require('express');
const bodyparser = require("body-parser");
var path = require('path');
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
// parser for the request body (can be useful to read what the client sends)
//  + increase file size possible to receive data
// var jsonParser = bodyparser.json()

// Instantiate express app
var app = express();
const port = config.port ;

app.use( bodyparser.json({limit: '50mb'}) );
app.use(bodyparser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit:50000
}));

// Useful path variables + template parameters
var serverRoot = path.join(__dirname, 'public');
var viewsPath = path.join(__dirname, 'public' , 'views');
app.use(express.static(serverRoot));
app.set('views', viewsPath ); // Used to set the views directory for the render function
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// ROUTES 
// API Calls limiter 
// app.use(apiLimiter,apiQueue); No need ?
// Basic pages
const pages=require('./routes/renders');
app.use(pages);
// Pinger
const pinger=require('./send_ping');
app.use(pinger);

// CONNECT TO THE DATABASE
// When connecting to mongodb via mongoose, if your mongodb uri doesn't contain any database 
// name then it will connect to test database. So you have to define your database name at the 
// end of the mongodb connection uri and it will connect to that defined database. Normally, the 
// database connection uri has the structure like:
// mongodb+srv://<username>:<password>@<cluster>/<your_desired_database>
// so you should add your database name after a / at the end of the uri --> see .env file
// [[ for now , let's just use the test database ]]

// let mainDBConnect = function(){
//     return new Promise(function(resolve, reject){
//         // var databaseConnectPromise = mongoose.connect(process.env.ATLAS_URI);
//         var databaseConnectPromise = mongoose.createConnection(process.env.ATLAS_URI)
//                 .then(()=>console.log('Connection to MAIN database established !'));
//         databaseConnectPromise.then(()=>resolve())
//         databaseConnectPromise.catch((err) => { console.log("Failed to connect to Atlas database -- error code :"); console.log(err);  console.log('Aborting ...\n\n\n'); return Promise.reject(err);});
//     });
// }

// let additionnalDBConnect = function(){
//     return new Promise(function(resolve, reject){
//         // var databaseOptConnectPromise = mongoose.connect(process.env.INCOMPLETE_URI);
//         var databaseOptConnectPromise = mongoose.createConnection(process.env.INCOMPLETE_URI)
//             .then(()=>console.log('Connection to ADDITIONNAL database established !'))
//             .then(()=>resolve())
//             .catch((err) => { console.log("Failed to connect to ADDITIONNAL database -- error code :"); console.log(err);  console.log('Aborting ...\n\n\n'); return Promise.reject(err);});
//     });
// }    

// API : interact with the database
const createApiRouter = require('./routes/api');
const raiseServer = function(){
    let server = app.listen(port, err =>{
        if(err){
            return console.error(err);
        }else{
            return console.log(`Server is up on port ${server.address().port}`);
        }
    }); 
}

// Raise the server after both db connections are established and the api controller instantiated
createApiRouter()
    .then((router)=>{
        app.use('/api/data',router);
        raiseServer();
    })
    .catch((err)=>{
        console.log("ERROR DURING SERVER DEPLOYMENT : ")
        console.log(err);
    });



