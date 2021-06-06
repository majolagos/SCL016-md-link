#!/usr/bin/env nodo
/* 
https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
*/
const {
  program
} = require('commander');
const {
  mdLinks
} = require('./index.js');

const program = new commander.Command();

program
  .option('--validate', 'validar url')
  .option('--stat', 'estadisticas');

program.parse(process.argv);

const options = program.opts();
if (options.validate) console.log(options);
console.log('pizza details:');
if (options.small) console.log('- small pizza size');
if (options.pizzaType) console.log(`- ${options.pizzaType}`);


