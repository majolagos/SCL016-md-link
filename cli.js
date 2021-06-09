#!/usr/bin/env node

const commander = require('commander');
const {
  program
} = require('commander');
const mdLinks = require('./api/index.js');

program
  .option('--validate', 'validate links')
  .option('--stat', 'stats');

program.parse(process.argv);
const [...argv] = process.argv;

const options = program.opts();

if (options.validate) {
  mdLinks(...argv[2].split(), 'validate')
    .then(response => console.log(response));
} else if (options.stat) {
  mdLinks(...argv[2].split())
    .then((array) => {

      //https://www.neoguias.com/como-encontrar-duplicados-array-javascript/
     const find = array.reduce((acc, array) => {

       acc[array.href] = ++acc[array.href] || 0;
       return acc;
     });

     const duplicados = array.filter((array) => {
       return find[array.href];
     });

       console.log('Total:', array.length, '\nUnique:', (duplicados.length));
    });
} else {
  mdLinks(...argv[2].split())
    .then(response => console.log(response));
}
