
var uuidv5 = require('uuid/v5');
var uuidv1 = require('uuid/v1');

module.exports = (Descarga) => {

	Descarga.token = function(id,tipo,options, cb, next) {
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const userId = valores && valores.userId;

        var tipoTemp;

		 Promise.resolve()
	    .then(function() {
			return new Promise(function(resolve, reject) {
				if(tipo<3 || tipo==5){//orden

					if(tipo==1)	tipoTemp='ORDENAMIENTO';
					else if(tipo==2)	tipoTemp='ORDENAMIENTO CARGO';
					//if(tipo==4)	tipoTemp='ORDENAMIENTO SIM';
					else if(tipo==5)	tipoTemp='ETIQUETA';
				  	Descarga.app.models.orden.findById(id,{},
				  		(err,orden)=>{
				  			if(err){
				  				cb(err,null);
				  			}else if(!orden){
								cb("Orden no existe",null);
			  				}else{	  		
			  					resolve();
			  				}
				  			
				  		}
				  	);
				}else if(tipo==3){
					tipoTemp='GENERAR CARGO';
				  	Descarga.app.models.cargo.findById(id,{},
				  		(err,cargo)=>{
				  			if(err){
				  				cb(err,null);
				  			}else{	  	
				  				if(!cargo){
									cb("cargo no existe",null);
				  				}else{	  		
				  					resolve();
				  				}
				  			}
				  		}
				  	);
				}else if(tipo == 4){//4
					tipoTemp = 'ORDENAMIENTO SIM';
					resolve();
				}else if(tipo == 6){//4
					tipoTemp = 'OBSERVACIÓN ';
					resolve();
				}else if(tipo == 7){//4
					tipoTemp = 'OBSERVACIÓN SIM';
					resolve();
				}else if(tipo == 8){//4
					tipoTemp = 'TAREA';
					resolve();
				}else if(tipo == 9){//4
					tipoTemp = 'GUIA_LISTA';
					resolve();
				}else if(tipo == 12){//4
					tipoTemp = 'GUIA_LISTA_DETALLADA';
					resolve();
				}else if(tipo == 14){//4
					tipoTemp = 'DESPACHO_EXCEL';
					resolve();
				}else if(tipo == 15){//4
					tipoTemp = 'DESPACHO_EXCEL_DETALLADO';
					resolve();
				}else if(tipo == 16){//4
					tipoTemp = 'DESPACHO_IMPRIMIR';
					resolve();
				}else if(tipo == 17){//4
					tipoTemp = 'GUIA_DESPACHO_RECEP_EXCEL';
					resolve();
				}else if(tipo == 18){//4
					tipoTemp = 'GUIA_DESPACHO_RECEP_EXCEL_DETALLE';
					resolve();
				}else if(tipo == 19){//4
					tipoTemp = 'ORDENES';
					resolve();
				}else if(tipo == 20){//4
					tipoTemp = 'CLIENTE_EXCEL';
					resolve();
				}else if(tipo == 21){//4
					tipoTemp = 'EXCEL_GUIA';
					resolve();
				}else if(tipo == 22){//4
					tipoTemp = 'EXCEL_DESPACHO';
					resolve();
				}else if(tipo == 23){//4
					tipoTemp = 'EXCEL_MENSAJERO';
					resolve();
				}else if(tipo == 24){//4
					tipoTemp = 'EXCEL_MENSAJERO';
					resolve();
				}else{
					reject("Tipo descarga erronea");
				}
				
			});
	    })
	    .then(function() {
			return new Promise(function(resolve, reject) {
								
				let my = uuidv1();	
				let des_token_validation=uuidv5(userId,my);

				Descarga.create({
					id:id,
					des_userid:userId,
					des_token:token,
					des_token_validation:des_token_validation,
					des_fecha_creado:new Date(),
					des_tipo:tipoTemp
				},
				(err,descarga)=>{
					if(err){
  						cb(err,null);
					}else{
						if(!descarga){
  							cb("Vuelva a intentarlo en unos minutos",null);
						}else{	 
							cb(null,{des_token_validation:descarga.des_token_validation});
						}
					}
				});	
			});
	    })
		.catch(function(err){
			console.log(err);
			next('Ocurrio un error, vuelva a intentar en unos minutos');
		});
	};


	Descarga.remoteMethod('token', {
		accepts: [
			{arg: 'id', type: 'number', required: true},	
			{arg: 'tipo', type: 'number', required: true},			
        	{arg: "options", type: "object", 'http': "optionsFromRequest"}
		],
		returns: {type: 'object', root: true},
		http: { verb: 'get', path: '/token/:id' },
	});	
}