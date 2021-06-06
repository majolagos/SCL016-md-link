const mdLinks = require('./api/index.js');
/*
captura lo que ingresa el usuario en consola
https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program
*/
const path = process.argv[2];
let opts = process.argv[3]

//si opts está vacío o es distinto a validate le asigno false, de lo contrario se mantiene su valor
if (opts === undefined || opts != 'validate'){
    opts = false;
}

mdLinks(path, opts).then((response)=>{
    console.log(response);
});


