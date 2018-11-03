console.log("\x1b[44mCommand line tool that uses Oxford dictionary API\x1b[0m\n");

// requirements
const https = require('https');
const readline = require('readline');

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
          console.log(e.message);
        }
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

// printing error messages with color codes
let printError = (type,word)=>{
  console.log(`\n\x1b[91mNo ${type} found for the word ${word} \x1b[0m`);
};

let dictionary = (word)=>{
  printDefinitions(word);
  printSynonyms(word);
  printAntonyms(word);
  examples(word);
}

// prints examples for the word
let examples = (word)=>{
  // reset the path
  options.path= path;
  // new path
  options.path+= word;
  // calling API for data for the word
  oxford((data)=>{
    // check if the callback is object or error code
    if(typeof data == 'object'){ 
    // assigning examples path in object to words for code redability 
    let words = data.results[0].lexicalEntries[0].entries[0].senses[0].examples;
      try{ //test if the examples path present in data object
        if(typeof data !== 'undefined' && words.length > 0){
              console.log('\n\x1b[93mExample usages for the word "'+word+'": \x1b[0m');
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
        console.log('\n\x1b[93mDefinitions for the word "'+word+'": \x1b[0m');
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
        console.log('\n\x1b[93mThe Synonyms for the word "'+word+'": \x1b[0m');
        for(let index in words){
          console.log((parseInt(index)+1) + '\t' +words[index].text);
        }
      }else{ printError("synonyms",word);}
    }else{printError("synonyms",word);}
  });
}

// random word dummy end point
let randomWord = (callback)=>{
  let words = ["accept","dead","modern","admit","answer","natural","good","attack","ending","straight","big","bold","hot","kind","dark","clear","import","fail","friend"];
  let word = words[Math.floor(Math.random()*words.length)];
  let data ={
    "word" : word
  };
  
  callback(data);
}

// shuffles the word used for hint
function shuffle (word){
    var shuffledWord = '';
    word = word.split('');
    while (word.length > 0) {
      shuffledWord +=  word.splice(word.length * Math.random() << 0, 1);
    }
    return shuffledWord;
}


let printGameRetryText = () => {
  console.log('\n\x1b[91mYou have entered incorrect word.\x1b[0m\n');
  console.log('Choose the options from below menu:');
  console.log('\t1. Try Again');
  console.log('\t2. Hint');
  console.log('\t3. Quit');
};

let playgame = () => {
  let game_word;
  let game_word_definitions = new Array();

  randomWord((data) => {
    game_word = data.word.replace(" ", "%20");
    definitions(game_word, (data) => {
      if(typeof data == 'object'){
        let words = data.results[0].lexicalEntries[0].entries[0].senses[0].definitions;
      
      if(typeof words !== 'undefined' && words.length >0){
        for(let index in words){
                game_word_definitions[index] =  words[index];
        }
      }else{console.log('\x1b[91m Error occured in the process.\nProcess will exit now. \x1b[0m');
        process.exit();}
    }else{console.log('\x1b[91m Error occured in the process.\nProcess will exit now. \x1b[0m');
        process.exit();}
  
      synonyms(game_word, (data) => {
        let game_word_synonyms;
        let hasSynonyms = false;
        let syn = data.results[0].lexicalEntries[0].entries[0].senses[0].synonyms;
        if(syn.length >= 1){
          hasSynonyms = true;
          game_word_synonyms = syn;
        }

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        console.log('\nPress "Ctrl + C" to exit the program.\n');
        console.log('Find the word with the following definition');
        console.log('\n\x1b[93mDefinition :\x1b[0m\n\t'+game_word_definitions[0]+'\n');
        console.log('Type the word and press the ENTER key:');

        rl.on('line', (input) => {
          let correctAnswer = false;
          if(hasSynonyms){
            for(let index in game_word_synonyms){
              if(`${input}` == game_word_synonyms[index].text){
                console.log('\n\x1b[92mCongratulations! You have entered correct synonym for the word "'+game_word+'"\x1b[0m');
                rl.close();
                correctAnswer = true;
              }
            }
          }

          if(`${input}` === game_word){
            console.log('\n\x1b[92mCongratulations! You have entered correct word.\x1b[0m');
            rl.close();
          }else{
            if(`${input}` == '3'){
              rl.close();
            }
            if(!(`${input}` == '1' || `${input}` == '2' || `${input}` == '3') && !correctAnswer){
              printGameRetryText();
            }
            switch(parseInt(`${input}`)){
              case 1:
                console.log('Please try to guess the word again:');
              break;
              case 2:
                let randomNumber = Math.floor((Math.random() * parseInt(game_word_definitions.length)) + 1);
                if(randomNumber == game_word_definitions.length){
                  randomNumber = game_word_definitions.length - 1;
                }
                console.log('\x1b[91mHint:\x1b[0m');
                console.log('\t\x1b[93mDefinition :\x1b[0m ' + game_word_definitions[randomNumber]);
                console.log('\nRandomly jumbled :\t'+shuffle(game_word));
                console.log('\nTry to guess the word again using the hint provided.');
                console.log('Enter the word:');
              break;
              case 3:
                console.log('The correct word is : \x1b[94m' + game_word+'\x1b[0m');
                console.log('Thank you for trying out this game. \nGame Ended.');
                rl.close();
              break;
              default:
            }
          }
        });
      });
    });
  });

};


// printhelp
let printHelp = ()=>{
  console.log('\x1b[93mThe possible commands are:\n\x1b[0m');
  console.log('\t1.dict def <word>');
  console.log('\t2.dict syn <word>');
  console.log('\t3.dict ant <word>');
  console.log('\t4.dict ex <word>');
  console.log('\t5.dict dict <word>');
  console.log('\t6.dict <word>');
  console.log('\t7.dict play');
  console.log('\t8.dict help');
  console.log('\t9.dict readme\n');
}

// readme
let readme = ()=>{
  console.log("\n*** Important Notes ***\nI was unable to provide word of the day, as the oxford dictionary does not provide them in the API https://developer.oxforddictionaries.com/documentation.\nRest of the functionality should be working good, where as there is still more scope to pull more information for definations, synonyms, antonyms and examples.\n");
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
        case 'readme':
          readme();
          break;
      default:
        console.log('\x1b[93mThe dictionary for the word "'+word+'": \x1b[0m');
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
          console.log('\x1b[93mThe dictionary for the word "'+word+'": \x1b[0m');
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