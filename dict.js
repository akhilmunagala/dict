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
		let statusCode = res.statusCode;
		res.on('data', (chunk)=> rawData+= chunk); // adding chunks
		res.on('end',()=>{
			// console.log(rawData);
			if(statusCode == 200){
				try{
				let parsedData = JSON.parse(rawData); //convert string to json object
				callback(parsedData); //send parsed data to caller
				}catch(e){
					// print message if there is error in parsing the data	
					console.log(e.message);			}
			}else{
				// send status code if there is error in finding the word in oxford api
				callback(statusCode);
			}
			
		});
	}).on('error', (err) => {
    	console.error(err);
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


let printError = (type,word)=>{
	console.log(`\n\x1b[31mNo ${type} found for the word ${word} \x1b[0m`);
};

let dictionary = (word)=>{
	printDefinitions(word);
	printSynonyms(word);
	printAntonyms(word);
	examples(word);
}


let examples = (word)=>{
	// reset the path
	options.path= path;
	// new path
	options.path+= word;
	// calling API for data for the word
	oxford((data)=>{
		// processing examples data
		if(typeof data == 'object'){
		let words = data.results[0].lexicalEntries[0].entries[0].senses[0].examples;
		
			try{
				if(typeof data !== 'undefined' && words.length > 0){
	      			console.log('\x1b[93m Example usages for the word "'+word+'": \x1b[0m');
					for(let index in words){
				        console.log((parseInt(index)+1) +'\t'+ words[index].text);
				      }
				}else{printError("examples",word);}
			}catch(e){printError("examples",word);}
	}else{printError("examples",word);}
	});
}

let printDefinitions = (word) => {
  definitions(word, (data) => {
  		if(typeof data == 'object'){
	  		let words = data.results[0].lexicalEntries[0].entries[0].senses[0].definitions;
			
			if(typeof words !== 'undefined' && words.length >0){
				console.log('\x1b[93m Definitions for the word "'+word+'": \x1b[0m');
				for(let index in words){
					console.log((parseInt(index)+1) + '\t' +words[index]);
				}
			}else{printError("definitions",word);}
		}else{printError("definitions",word);}
  });
};

let printAntonyms = (word) =>{
	antonyms(word, (data)=>{
		if(typeof data == 'object'){
			let words = data.results[0].lexicalEntries[0].entries[0].senses[0].antonyms;
			if(typeof words !== 'undefined' && words.length >0){
				console.log('\n\x1b[93mAntonyms for the word "'+word+'": \x1b[0m');

				for(let index in words){
					console.log((parseInt(index)+1) + '\t' +words[index].text);
				}
			}else{printError("antonyms",word);}
		}else{printError("antonyms",word);}
	});
}

let printSynonyms = (word)=>{
	synonyms(word, (data) =>{
		if(typeof data == 'object'){
			let words = data.results[0].lexicalEntries[0].entries[0].senses[0].synonyms;
			if(typeof words !== 'undefined' && words.length >0){
				console.log('\x1b[93m The Synonyms for the word "'+word+'": \x1b[0m');
				for(let index in words){
					console.log((parseInt(index)+1) + '\t' +words[index].text);
				}
			}else{ printError("synonyms",word);}
		}else{printError("synonyms",word);}
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