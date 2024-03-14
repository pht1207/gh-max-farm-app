const mysql = require('mysql');
const express = require('express');
const multer = require('multer');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const e = require('express');



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
console.log(DBUsername)

// Create a pool of connections so the DB is up and available for use
const pool = mysql.createPool({
    connectionLimit : 10, // the maximum number of connections in the pool
    host            : 'localhost',
    user            : DBUsername,
    password        : DBPassword,
    database        : DBName
});




start();
//csvPrimaryKeyMaker.start();
  








async function start() {
    await csvOutputMaker();
    console.log(await gpuNameArrayMaker(csvOutputArray));
    await gpuTableMaker(await gpuNameArrayMaker(csvOutputArray));
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
        for(let i = 0; i < array.length; i++){
            if(!gpuNameArray.includes(array[i].GPU)){
                gpuNameArray.push(array[i].GPU)
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
              console.error(error);
            }
            else{
                console.log(results)
            }
          })
      
    }
  }