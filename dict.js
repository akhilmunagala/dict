console.log("Command line tool that uses Oxford dictionary API");

// requirements
const https = require('https');

// command line arguments
const args = process.argv;
const userArgs = args.slice(2);
const lengthOfArgs = userArgs.length;

// path for API request
const path = "/api/v1/entries/en/";
var tempPath = path;

// API credentials
var options = {
      "method": "GET",
      "hostname": "od-api.oxforddictionaries.com",
      "port": "443",
      "path": tempPath,
      "headers": {
        "app_id": "d12fd988",
        "app_key": "a2110d8618e60cca25633bf1e1d5ec58",
        "cache-control": "no-cache"
      }
};

// getting data from API
let oxford = (callback) =>{

	https.get(options, (res) =>{
		
		let rawData = '';
		res.on('data', (chunk)=> rawData+= chunk); // adding chunks
		res.on('end',()=>{
			// console.log(rawData);
			try{
				let parsedData = JSON.parse(rawData); //convert string to json object
				callback(parsedData); //send parsed data to caller
			}catch(e){
				console.log(e.message); //print error message if paring goes wrong.
			}
		});
	});
}