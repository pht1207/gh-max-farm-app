const mysql = require('mysql');
const express = require('express');
const multer = require('multer');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const axios = require('axios');

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
    pool.query("SELECT gpu_table.gpu_name from gpu_table", (error, results) =>{
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
app.get('/showGPUNames', upload.none(), showGPUNames)


//Gets rows from result table where the gpu from get request matches
const showResultsTableByGPU = async function(req, res){
    const query = "SELECT * from results "+
    "INNER JOIN gpu_table ON results.gpu_id = gpu_table.gpu_id "+
    "WHERE gpu_name = ? "+
    "AND (c_level = ? OR ? = 'ANY') "+
    "AND k_size = ? "+
    "ORDER BY c_level ASC, max_farm_size ASC"
    const values = [req.query.gpu, req.query.clevel, req.query.clevel, req.query.ksize];
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

    if(await tablesReset()){
        if(await csvOutputMaker()){
            if(await gpuTableMaker(await gpuNameArrayMaker(csvOutputArray)));{//puts gpu's into gpu_table
                if(await resultsTableMaker(csvOutputArray)){ //Puts the csvOutputArray into the results table
                    console.log("Successfully started backend without errors")
                }
                
            } 
        }
    };
}


async function isFileEmpty(file){
    try {
        const filePath = path.resolve(__dirname, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return fileContent.length === 0;
      }
      catch (error) {
        console.error('Error reading file:', error);
        return false;
      }
    }

let csvOutputArray = [];
//Pushes data from the csv file to an array
async function csvOutputMaker(){
    let fileName = 'Max Farm Size GH 3.0 - GPU.csv';
    if(isFileEmpty(fileName)){ //Used to fallback on previous version if the download fails for whatever reason
        fileName = 'Max Farm Size GH 3.0 - GPU copy.csv';
    }
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.resolve(__dirname, './', fileName))
            .pipe(csv.parse({
                headers: ['GPU', 'CPU', 'Difficulty', '-r', 'k', 'C', 'OS', 'Giga Version', '(Plot filter = 256)', 'User', 'Information'],
                skipLines: 1
            }))            
            .on('error', error => reject(error))
            .on('headers', (headers)=>{console.log("csv headers:", headers)})
            .on('data', row => {
                if(row.GPU === '' || row.CPU === '' || row.Difficulty === ''|| row.k === '' || row.C === '' || row["(Plot filter = 256)"] === ''){
                }
                else{
                    let gpuObject = {
                        GPU: row.GPU.toUpperCase(),
                        CPU: row.CPU,
                        Difficulty: row.Difficulty,
                        ['-r']: row['-r'],
                        k:row.k,
                        C:row.C,
                        OS:row.OS,
                        ['Giga Version']:row["Giga Version"],
                        ["(Plot filter = 256)"]:row["(Plot filter = 256)"],
                        User:row.User,
                        Information:row.Information
                    }
                    csvOutputArray.push(gpuObject)
                }
            })
            .on('end', () => {
                resolve(true);
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
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO gpu_table (gpu_name)  VALUES (?)"
        for(let i = 0; i < array.length; i++){
            let values = array[i];
            pool.query(query, values, (error, results) =>{
                if(error){
                console.error(error);
                reject(false);
                }
                else{
                    //console.log(results)
                }
            })
            }
            resolve(true);  
    });
    
}

//This inserts all the results into the results_table
async function resultsTableMaker(array){
    return new Promise((resolve, reject) => {
        for(let i = 0; i < array.length; i++){
            let query = "INSERT INTO results (gpu_id, cpu_used, difficulty, thread_count, k_size, c_level, operating_system, giga_version, max_farm_size, user, information)  VALUES ((SELECT gpu_id FROM gpu_table WHERE gpu_name = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            let values = [
                array[i]['GPU'],
                array[i]['CPU'],
                array[i]['Difficulty'],
                array[i]['-r'],
                array[i]['k'],
                array[i]['C'],
                array[i]['OS'],
                array[i]['Giga Version'],
                array[i]['(Plot filter = 256)'],
                array[i]['User'],
                array[i]['Information']
            ];
            pool.query(query, values, (error, results) =>{
                if(error){
                    console.error(error);
                    reject(false);
                }
                else{
                }
            })
        }
        resolve(true);  
    });
}

//Wipes the db so it can start fresh from csv
async function tablesReset(){
    return new Promise((resolve, reject) => {

    pool.query("DELETE FROM results", (error, results) =>{
        if(error){
            console.error(error);
            reject(false)
        }
        else{
            pool.query("DELETE FROM gpu_table;")
            resolve(true);
        }
        })
    })
}

{/* END SECTION: APP INITIALIZATION */}






{/* SECTION: FETCH CSV 
    -This section of code is for fetching the .csv twice daily and restarts the program
*/}
const cron = require('node-cron');
const csvUrl = 'https://docs.google.com/spreadsheets/d/1mghuzD1MzNFNK7N9lnZ_D59jHSceezwFREsF5kg5BWw/export?format=csv&id=1mghuzD1MzNFNK7N9lnZ_D59jHSceezwFREsF5kg5BWw&gid=1012308633';
const outputPath = 'Max Farm Size GH 3.0 - GPU.csv';

cron.schedule('0 0 * * *', function() {
  console.log('Running fetchCsvAndWriteToFile once a day at 12am');
  fetchCsvAndWriteToFile(csvUrl, outputPath)
  start();
});
cron.schedule('0 12 * * *', function() {
    console.log('Running fetchCsvAndWriteToFile once a day at 12pm');
    fetchCsvAndWriteToFile(csvUrl, outputPath)
    start();
  });

async function fetchCsvAndWriteToFile(url, filePath) {
  try {
    const response = await axios.get(url);
    fs.writeFileSync(filePath, response.data);
    console.log(`CSV file has been saved to ${filePath}`);
  } catch (error) {
    console.error('Error fetching or writing CSV:', error);
  }
}

{/* END SECTION: FETCH CSV */}