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
				console.error('Please enter valid word (Note: must use singular words only)'); //print error message if paring goes wrong.
				// process.exit();
			}
		});
	});
}

let definitions = (word, callback)=>{
	// reset the path
	options.path= path;
	// new path
	options.path+= word;
	// calling API for data for the word
	oxford((data)=>{
		callback(data); //sending json data to caller
	});

};

let synonyms = (word, callback)=>{
	// reset the path
	options.path= path;
	// new path
	options.path+= word+"/synonyms";
	// calling API for data for the word
	oxford((data)=>{
		callback(data); //sending json data to caller
	});

};


let antonyms = (word, callback)=>{
	// reset the path
	options.path= path;
	// new path
	options.path+= word+"/antonyms";
	// calling API for data for the word
	oxford((data)=>{
		callback(data); //sending json data to caller
	});

};

let isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};


let examples = (word)=>{
	// reset the path
	options.path= path;
	// new path
	options.path+= word;
	// calling API for data for the word
	oxford((data)=>{
		// processing examples data
		let examples = data.results[0].lexicalEntries[0].entries[0].senses[0].examples;
		try{
			if(!isEmpty(examples)){
      			console.log('\x1b[93m Example usages for the word "'+word+'": \x1b[0m');
				for(let index in examples){
		        console.log((parseInt(index)+1) +'\t'+ examples[index].text);
		      }
			}else{
				console.log(`No examples found for the word : ${word}`);
			}
		}catch(e){
			console.log(`No examples found for the word : ${word}`);
		}
	});
}

let dictionary = (word)=>{
	printDefinitions(word);
	printSynonyms(word);
	printAntonyms(word);
	examples(word);
}

let printDefinitions = (word) => {
  definitions(word, (data) => {
	console.log(data.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]);
  });
};

let printAntonyms = (word) =>{
	antonyms(word, (data)=>{
		console.log(data.results[0].lexicalEntries[0].entries[0].senses[0].antonyms[0].text);
	});
}

let printSynonyms = (word)=>{
	synonyms(word, (data) =>{
		console.log(data.results[0].lexicalEntries[0].entries[0].senses[0].synonyms[1].text);
	});
}

// play
let playgame = ()=>{
	console.log("game is under construction");
}


// printhelp
let printHelp = ()=>{
	console.log('The possible commands are:');
	console.log('\t1.dict def <word>');
	console.log('\t2.dict syn <word>');
	console.log('\t3.dict ant <word>');
	console.log('\t4.dict ex <word>');
	console.log('\t5.dict dict <word>');
	console.log('\t6.dict <word>');
	console.log('\t7.dict play');
	console.log('\t8.dict');
	console.log('\t9.dict help');
}


// command center
let startDictionary = () => {
  if(lengthOfArgs == 0){
  	console.log("At least one word needs to entered");
  }
  else if(lengthOfArgs == 1){
    let word = userArgs[0];
    switch(word){
      case 'play':
        playgame();
        break;
        case 'help':
        printHelp();
        break;
      default:
        console.log('\x1b[93m The dictionary for the word "'+word+'": \x1b[0m');
        dictionary(word);
    
    }

  }else if(lengthOfArgs == 2){
    let word = userArgs[1];
    
    switch(userArgs[0]) {
        case 'def':
          printDefinitions(word);
          break;
        case 'syn':
          printSynonyms(word);
          break;
        case 'ant':
          printAntonyms(word);
          break;
        case 'ex':
          examples(word);
          break;
        case 'dict':
          console.log('\x1b[93m The dictionary for the word "'+word+'": \x1b[0m');
          dictionary(word);
          break;
        default:
          printHelp();
    }
  }else{
    printHelp();
  }
};

startDictionary();
console.log('Type "help" for help.');