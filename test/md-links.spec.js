const mdLinks = require('../api/index');
const functions = require('../api/functions');

describe('mdLinks', () => {

  it('should be an function', () => {
    expect(typeof mdLinks).toBe('function');
  });

   it('Debería retornar una promesa que resuelve un array de objetos', () => {
     return mdLinks('mio.md')
       .then((result) => {
         expect(typeof result).toBe('object');
       }).catch((error) => {
         console.log(error);
       });
   })

});

describe('thePathExists', () => {

  it('Debería retornar true si la ruta existe', () => {

    const resp = functions.thePathExists('C:/Users/Majo/Documents/laboratoria/proyectos/SCL016-md-link/mio.md');
    
    expect(resp).toBe(true);
  });

});

describe('readFiles', () => {
  //Así se testea algo con promesas
  it('Debería ser capaz de leer un archivo y retornar un string', () => {
    return functions.readFiles('mio.md')
      .then((result) => {
        expect(typeof result).toBe('string');
      }).catch((error) => {
        console.log(error);
      });
  })
})
