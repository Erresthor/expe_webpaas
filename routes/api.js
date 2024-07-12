const express = require('express')
const router = express.Router()
const instantiateControllers = require('../controllers/subjectTrialDataControllers.js');

const createApiRouter = function(){
    return new Promise(function(resolve, reject){
        instantiateControllers()
            .then((controllers)=>{
                var { 
                    getConnectionStatus,

                    getSubjectTrialDataS,
                    getSubjectTrialData,
                    createSubjectTrialData,
                    deleteSubjectTrialData,
                    updateSubjectTrialData,

                    getSubjectTrialDataS_O,
                    getSubjectTrialData_O,
                    createSubjectTrialData_O,
                    deleteSubjectTrialData_O,
                    updateSubjectTrialData_O
                } = controllers;
                    
                router.get('/db_connection_status',getConnectionStatus)

                // Routes for complete data recordings

                router.get('/', getSubjectTrialDataS)
                router.get('/:productID', getSubjectTrialData)
                router.post('/', createSubjectTrialData) 
                router.put('/:productID', updateSubjectTrialData) 
                router.delete('/:productID', deleteSubjectTrialData)

                // Routes for INcomplete data recordings

                router.get('/inc/', getSubjectTrialDataS_O)
                router.get('/inc/:productID', getSubjectTrialData_O)
                router.post('/inc/', createSubjectTrialData_O) 
                router.put('/inc/:productID', updateSubjectTrialData_O) 
                router.delete('/inc/:productID', deleteSubjectTrialData_O)

                console.log("API Routes for database communication created !");
                resolve(router);
            })
    });
}

module.exports = createApiRouter;