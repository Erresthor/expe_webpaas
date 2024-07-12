const { resolveInclude } = require('ejs');

// We no longer call the models directly, the connections have to be created before !
var instantiateControllers= function(){
    return new Promise(function(resolve, reject){
        const buildConnections = require('../routes/connection_factory.js');

        buildConnections()
            .then((factoryOutputs)=>{
                let {conn_models,conn_main,conn_inc} = factoryOutputs;
                let {SubjectDataModel,SubjectDataModelIncomplete} = conn_models;
                // console.log(SubjectDataModel)
                const getConnectionStatus =((req, res)=>{
                    let connection_status = {
                        connection_main : conn_main.readyState,
                        connection_inc : conn_inc.readyState
                    }
                    console.log("Server database connection status interrogated : ");
                    console.log(JSON.stringify(connection_status));
                    res.status(200).json({ connection_status })
                })

                const getSubjectTrialDataS=((req,res) => {
                    console.log("Hit getSubjectTrialDataS")
                    SubjectDataModel.find({})
                        .then(result=>res.status(200).json({ result }))
                        .catch(error => res.status(500).json({msg: error}))
                });
            
                const getSubjectTrialData=((req,res) => {
                    console.log("Hit getSubjectTrialData")
                    SubjectDataModel.findOne({ _id: req.params.productID })
                    .then(result => res.status(200).json({ result }))
                    .catch(() => res.status(404).json({msg: 'Product not found'}))
                })
                
                const createSubjectTrialData = ((req, res) => {
                    console.log("Hit createSubjectTrialData")
                    SubjectDataModel.create(req.body)
                        .then(result => res.status(200).json({ result }))
                        .catch((error) => res.status(500).json({msg:  error }))
                    console.log("Received new data : adding to the database !")
                    console.log("Subject ID received : " + req.body.subjectId)
                })
                
                const updateSubjectTrialData = ((req, res) => {
                    console.log("Hit updateSubjectTrialData")
                    SubjectDataModel.findOneAndUpdate({ _id: req.params.productID }, req.body, { new: true, runValidators: true })
                        .then(result => res.status(200).json({ result }))
                        .catch((error) => res.status(404).json({msg: 'Product not found' }))
                })
                
                const deleteSubjectTrialData = ((req, res) => {
                    console.log("Hit deleteSubjectTrialData")
                    SubjectDataModel.findOneAndDelete({ _id: req.params.productID })
                        .then(result => res.status(200).json({ result }))
                        .catch((error) => res.status(404).json({msg: 'Product not found' }))
                })
                
                const getSubjectTrialDataS_O=((req,res) => {
                    console.log("Hit getSubjectTrialDataS_O")
                    SubjectDataModelIncomplete.find({})
                        .then(result=>res.status(200).json({ result }))
                        .catch(error => res.status(500).json({msg: error}))
                })
                
                const getSubjectTrialData_O=((req,res) => {
                    console.log("Hit getSubjectTrialData_O")
                    SubjectDataModelIncomplete.findOne({ _id: req.params.productID })
                    .then(result => res.status(200).json({ result }))
                    .catch(() => res.status(404).json({msg: 'Product not found'}))
                })
                
                const createSubjectTrialData_O = ((req, res) => {
                    console.log("Hit createSubjectTrialData_O")
                    SubjectDataModelIncomplete.create(req.body)
                        .then(result => res.status(200).json({ result }))
                        .catch((error) => res.status(500).json({msg:  error }))
                    console.log("Received new INCOMPLETE data : adding to the INC database !")
                    console.log("Subject ID received : " + req.body.subjectId)
                })
                
                const updateSubjectTrialData_O = ((req, res) => {
                    console.log("Hit updateSubjectTrialData_O")
                    SubjectDataModelIncomplete.findOneAndUpdate({ _id: req.params.productID }, req.body, { new: true, runValidators: true })
                        .then(result => res.status(200).json({ result }))
                        .catch((error) => res.status(404).json({msg: 'Product not found' }))
                })
                
                const deleteSubjectTrialData_O = ((req, res) => {
                    console.log("Hit deleteSubjectTrialData_O")
                    SubjectDataModelIncomplete.findOneAndDelete({ _id: req.params.productID })
                        .then(result => res.status(200).json({ result }))
                        .catch((error) => res.status(404).json({msg: 'Product not found' }))
                })
                
                resolve({
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
                });
        })
    });
};


module.exports = instantiateControllers;