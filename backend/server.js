const mysql = require('mysql');
const express = require('express');
const multer = require('multer');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const upload = multer();


const corsOptions ={
    origin:'*', 
    //credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));


app.use(express.json());
require('dotenv').config();

// Start the server
const BACKENDPORT = process.env.BACKENDPORT || 5012;
app.listen(BACKENDPORT, () => {
  console.log(`Server running on port ${BACKENDPORT}`);
});


//Imports the username and password from .env file
const DBUsername = process.env.DBUsername;
const DBPassword = process.env.DBPassword;
const DBName = process.env.DBName;

// Create a pool of connections so the DB is up and available for use
const pool = mysql.createPool({
    connectionLimit : 10, // the maximum number of connections in the pool
    host            : 'localhost',
    user            : DBUsername,
    password        : DBPassword,
    database        : DBName
});

start(); //starts the process of putting the csv into the DB



  






{/* START OF SECTION: HTTP REQUESTS
    This section contains the http requests that the frontend has access to
    Methods in this section
        -showGPUNames
        -showGPUResultsByGPU
*/}

const showGPUNames = async function(req, res){
    const query = "SELECT gpu_table.gpu_name from gpu_table"
    pool.query("SELECT gpu_table.gpu_name from gpu_table", (error, results) =>{
        if(error){
            console.error(error);
            res.status(500).json({
                error:"error occured"
              });
        }
        else{
            console.log(results);
            res.status(200).json({
                results
              });
            }
        })
}
app.get('/showGPUNames', upload.none(), showGPUNames)



const showResultsTableByGPU = async function(req, res){
    console.log(req.query.gpu)
    const query = "SELECT * from results "+
    "INNER JOIN gpu_table ON results.gpu_id = gpu_table.gpu_id "+
    "WHERE gpu_name = ?"
    const values = req.query.gpu;
    pool.query(query, values, (error, results) =>{
        if(error){
            console.error(error);
            res.status(500).json({
                error:"error occured"
              });
        }
        else{
            res.status(200).json({
                results
              });
            }
        })
}
app.get('/showResultsTableByGPU', upload.none(), showResultsTableByGPU)

const showResultsTableByCLevelAndGPU = async function(req, res){
    console.log(req.query.gpu)
    const query = "SELECT * from results "+
    "INNER JOIN gpu_table ON results.gpu_id = gpu_table.gpu_id "+
    "WHERE gpu_name = ? AND c_level = ?"
    const values = [req.query.gpu, req.query.clevel];
    console.log(req.query)
    pool.query(query, values, (error, results) =>{
        if(error){
            console.error(error);
            res.status(500).json({
                error:"error occured"
              });
        }
        else{
            res.status(200).json({
                results
              });
            }
        })
}
app.get('/showResultsTableByCLevelAndGPU', upload.none(), showResultsTableByCLevelAndGPU)

{/* END OF SECTION: HTTP REQUESTS*/}








{/* START OF SECTION: APP INITIALIZATION
    This section contains the methods that take the .csv, parse it and put it in the database as structured data
    Methods in this section
        -start()
        -csvOutputMaker()
        -gpuNameArrayMaker()
        -resultsTableMaker()
        -tablesReset()
*/}
async function start() {
    await tablesReset();
    await csvOutputMaker();
    console.log(await gpuNameArrayMaker(csvOutputArray))
    await gpuTableMaker(await gpuNameArrayMaker(csvOutputArray)); //puts gpu's into gpu_table
    await resultsTableMaker(csvOutputArray); //Puts the csvOutputArray into the results table
}



let csvOutputArray = [];

//Pushes data from the csv file to an array
async function csvOutputMaker(){
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.resolve(__dirname, './', 'maxfarm.csv'))
            .pipe(csv.parse({ headers: true }))
            .on('error', error => reject(error))
            .on('data', row => csvOutputArray.push(row))
            .on('end', () => {
                resolve();
            });
    });
}


//Creates an array of each unique GPU found in the GPU field of the csvOutputArray
async function gpuNameArrayMaker(array){
    return new Promise((resolve, reject) => {
        let gpuNameArray = [];
        let currentGPU;
        for(let i = 0; i < array.length; i++){
            currentGPU = array[i].GPU;
            if(!gpuNameArray.includes(currentGPU)){
                gpuNameArray.push(currentGPU)
            }
        }
        resolve(gpuNameArray)
    });
}

async function gpuTableMaker(array){
    const query = "INSERT INTO gpu_table (gpu_name)  VALUES (?)"
    for(let i = 0; i < array.length; i++){
        let values = array[i];
        //console.log(values);
        pool.query(query, values, (error, results) =>{
            if(error){
              //console.error(error);
            }
            else{
                console.log(results)
            }
          })
      
    }
}

//This inserts all the results into the results_table
async function resultsTableMaker(array){
    //const query = "INSERT INTO results (gpu_id, cpu_used, difficulty, thread_count, k_size, c_level, operating_system, giga_version, plot_filter, user, information)  VALUES ((SELECT 'gpu_id' FROM), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    for(let i = 0; i < array.length; i++){
        let query = "INSERT INTO results (gpu_id, cpu_used, difficulty, thread_count, k_size, c_level, operating_system, giga_version, plot_filter, user, information)  VALUES ((SELECT gpu_id FROM gpu_table WHERE gpu_name = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        let values = [
            array[i]['GPU'],
            array[i]['CPU'],
            array[i]['Difficulty'],
            array[i]['-r'],
            array[i]['k'],
            array[i]['C'],
            array[i]['OS'],
            array[i]['Giga Version'],
            array[i]['Max Farm Size'],
            array[i]['User'],
            array[i]['Information']
        ];
        pool.query(query, values, (error, results) =>{
            if(error){
                console.error(error);
            }
            else{
            }
          })
    }
}



//Wipes the db so it can start fresh from csv
async function tablesReset(){
    pool.query("DELETE FROM results", (error, results) =>{
        if(error){
            console.error(error);
        }
        else{
            pool.query("DELETE FROM gpu_table;")
            console.log("db wiped")
        }
        })
}