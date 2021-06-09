const path = require('path');
const fs = require('fs');
const marked = require('marked');
const fetch = require('fetch');

const arrayFiles = [];
const arrayDir = [];
// const readline = require('readline');

//Verifico si la ruta existe o no. Valor booleano.
const thePathExists = (pathRecived) => fs.existsSync(pathRecived);

//identifico si la ruta recibida es absoluta con path.isAbsolute.
//Si es relativa la convierto a absoluta con path.resolve
const pathIsAbsolute = (pathRecived) => {

  if (path.isAbsolute(pathRecived)) {
    return pathRecived;
  } else {
    //pathAbsolute convierte una ruta relativa a una absoluta
    return path.resolve(pathRecived);
  }
}
//Identifico si es un archivo o directorio
const isMdArchive = (pathRecived) => {

  return new Promise((resolve, reject) => {
    const isFile = fs.statSync(pathRecived).isFile();
    if (isFile) {
      resolve(path.extname(pathRecived) === '.md' ? true : false);
    } else {
      resolve(false);
    }
  });
}

//Identifico si es un directorio
const isADir = (pathRecived) => {
  return new Promise((resolve, reject) => {
    resolve(fs.statSync(pathRecived).isDirectory());

  });

}
//Leo un archivo
const readFiles = (pathRecived) => {
  return new Promise((resolve, reject) => {
    fs.readFile(pathRecived, {
      encoding: 'utf8'
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

//Obtengo mi array de objetos que contienen los links
const markedFile = (data, file) => {
  return new Promise((resolve, reject) => {
    const links = [];
    const renderer = new marked.Renderer();
    // Taken from https://github.com/markedjs/marked/issues/1279
    //https://github.com/markedjs/marked/blob/1548175640db4f458e4d4cd0d7b6a4f4de72f735/lib/marked.js#L519 

    renderer.link = (href, title, text) => {
      if (href.includes('http') || href.includes('www.')) {
        links.push({
          href: href,
          text: text,
          file: file,
        });
      }
      resolve(links);
    };
    marked(data, {
      renderer: renderer
    });
  });
}

//valida url con fecth
const validateUrl = (url) => {
  return new Promise((resolve, reject) => {
    fetch.fetchUrl(url, (error, meta, body) => {
      if (error) {
        resolve(error.code)
      } else {
        resolve(meta.status);
      }
    })

  })

}

//Actualizo mi objeto links con el estado y el código según la validación
const addPropertyStatus = (object) => {
  return new Promise((resolve, reject) => {
    let code = ''
   validateUrl(object.href).then((status) => {
      if (status === 200) {
        code = 'ok';
      } else {
        code = 'fail';
      }
      //object.status creo la propiedad en el objeto
      object.status = status;
      object.ok = code;
      resolve(object);
    });

  })
}

//Leo un directorio y retorno un array con los archivos que tiene dentro (aplicar la Recursividad)
const readDir = (pathRecived) => {

  return new Promise((resolve, reject) => {
    fs.readdir(pathRecived, {
      encoding: 'utf8'
    }, (error, data) => {
      if (error) {

        reject(error);
      } else {

        const arrays = getArrays(pathRecived, data); //obtengo arrays de archivos md y directorios

        arrays.then((response)=>{
                if(response[0].length > 0){
                    for(let i = 0; i<response[0].length; i++){
                        // 
                    }
                    console.log('recorro directorios');
                }
                
                if(response[1].length>0 ){
                    console.log('leo archivos y guardo resultados en un objeto con la info y su file correspondiente');
                }
        })
        //recorro data en busca de mas directorios y agrego archivos a un array 
      }
    });

/****************************************************************** */

    const getArrays = (pathRecived, data) => {
      return new Promise((resolve, reject) => {
        const arrayMd = [];
        const arrayDir = [];

        for (let i = 0; i < data.length; i++) {

          const ruta = path.normalize(pathRecived + '/' + data[i]);
          const isMd = isMdArchive(ruta); //los archivos md se agregan al array archivos md
          const isDir = isADir(ruta); //las carpetas al array carpetas //los otros archivos los ignoro

          isMd.then((isMd) => {
            if (isMd) {
              arrayMd.push(ruta);
              // console.log(1, ruta);
            } else {
              isDir.then((isDir) => {
                if (isDir) {
                  arrayDir.push(ruta);
                  // console.log(2, ruta);
                }
              })
            }
          });
        }
        Promise.all([arrayDir, arrayMd]).then((response) => {
          resolve(response)
        })
      })
    }



    // const arrayDir = readFiles(pathRecived);
    // arrayDir.then(response => {
    //   console.log(response);
    //   //en vez de ejecutar de nuevo la funcion, deberia leer directorio con readdir de nuevo
    //   //revisar el diagrama
    // })
  });

}

module.exports = {

  thePathExists,
  pathIsAbsolute,
  isMdArchive,
  readFiles,
  markedFile,
  validateUrl,
  addPropertyStatus,
  isADir,
  readDir
}
