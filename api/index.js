const {
  thePathExists,
  pathIsAbsolute,
  isMdArchive,
  readFiles,
  markedFile,
  addPropertyStatus,
  isADir,
  readDir
} = require('./functions');

module.exports = mdLinks = (pathRecived, opts) => {
  return new Promise((resolve, reject) => {
    const pathAbsolute = pathIsAbsolute(pathRecived); //identifico la path, si es absoluta o relativa y devuelvo la absoluta
    const pathExist = thePathExists(pathAbsolute); //verifico si existe la ruta
    if (pathExist) {
      const isMdExt = isMdArchive(pathAbsolute); //verifico si es un archivo md
      isMdExt.then((isMd) => {

          if (isMd) {
            const readFile = readFiles(pathAbsolute); //promesa leo archivo
            return readFile; //retorno la data del archivo leido
          } else { //si no es md
            const isDir = isADir((pathAbsolute)) //promesa Verifico si es un directorio
            return isDir ? readDir(pathAbsolute) : 'No es un archivo de extension md';
            //    return readDir;//retorno array de archivos
          }
        })
        .then((response) => { //data del archivo leido //o array de archivos //switch case (=1 file; >1 dir; 0 not md)
          const arrayLinks = markedFile(response, pathAbsolute) //links info
          return arrayLinks;
        })
        .then((arrayLinks) => {
          if (opts === 'validate') {
            const arrayPromise = [];
            arrayLinks.forEach(object => {
              arrayPromise.push(addPropertyStatus(object)); // push con la promesa devuelta
            });
            Promise.all(arrayPromise).then((response) => { //luego se resuelven todas y obtengo el resultado
              resolve(response);
            })
          } else {
            resolve(arrayLinks);
          }
        })
        .catch((err => {
          reject('error');
        }))
    } else {
      console.log('ruta ingresada no valida');
    }
  })
}
