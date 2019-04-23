var fs = require('fs');
var path = require('path');
var loopback = require('loopback');
var crypto = require('crypto');
const uuidv1 = require('uuid/v1');
var { exec } = require('child_process');
module.exports = (Mensajero) => {
	Mensajero.foto = function(nombre,res,  cb) {

		 Promise.resolve()
	    .then(function() {
			return new Promise(function(resolve, reject) {		
				let file = Mensajero.app.get("path").mensajero.foto + nombre;		
				console.log(file);
				if(!fs.existsSync(file)){
					//res.type('application/json');
					res.status(400).send(  "Archivo no existe" );
				}else{  								
  					let reader = fs.createReadStream(file);
					reader.on('error', function (err) {
						//descarga.destroy();
						//res.type('application/json');
						res.status(500).send("No se puede descargar archivo" );
						//cb("Error al descagar archivo",null);
					});
					reader.on('open',()=>{			
						res.set('Content-Type','application/force-download');
						res.set('Content-Type','application/octet-stream');
						res.set('Content-Type','application/download');
						res.set('Content-Disposition','attachment;filename='+nombre);
						reader.pipe(res);

					});
				}
			});
	    })
		.catch(function(err){
			console.log(err);
			next('Ocurrio un error, vuelva a intentar en unos minutos.....');
		});

	};

	Mensajero.remoteMethod('foto', {
		//isStatic: true,
		accepts: [
			{arg: 'nombre', type: 'string', required: true},
    		{arg: 'res', type: 'object', 'http': {source: 'res'}}
		],
		http: { verb: 'get', path: '/foto' },
	});
}

