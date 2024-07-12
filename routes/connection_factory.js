const mongoose = require('mongoose');
const {SubjectDataSchema}= require('../models/SubjectTrialData.js');

let connectToURI = function(uri,database_name="standard"){
    return new Promise((resolve, reject) => {
        let connection = mongoose.createConnection(uri);
        connection.on('connected', () => {
            console.log(' |  Connected to '+database_name);
            resolve(connection);
        });
    });
}

let addModels = function(mainConnect,optConnect){
    let SubjectDataModel = mainConnect.model('SubjectDataModel', SubjectDataSchema);
    let SubjectDataModelIncomplete = optConnect.model('SubjectDataModelIncomplete', SubjectDataSchema);
    console.log(` |  conn_main state: ${mainConnect.readyState}`);
    console.log(` |  conn_inc state: ${optConnect.readyState}`);
    return {SubjectDataModel,SubjectDataModelIncomplete}
}

module.exports = function buildConnections() {
    return new Promise((resolve, reject) => {
        let conn_main = undefined;
        let conn_inc = undefined;

        connectToURI(process.env.ATLAS_URI,"[[main db]]")
            .then((res1)=>{
                conn_main = res1;
                return connectToURI(process.env.INCOMPLETE_URI,"[[incomplete db]]");
            })
            .then((res2)=>{
                conn_inc = res2;
                console.log("Established connection to databases");

                let conn_models = addModels(conn_main,conn_inc)
                return resolve({conn_models,conn_main,conn_inc});
            })
            .catch((err)=>{
                console.log("Failed to establish connection to databases");
                console.log(err);
                return reject(err);
            });
    });
};
