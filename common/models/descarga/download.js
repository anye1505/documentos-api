var fs = require('fs');
var path = require('path');
var loopback = require('loopback');
var crypto = require('crypto');
const uuidv1 = require('uuid/v1');
var { exec } = require('child_process');
module.exports = (Descarga) => {
	Descarga.download = function(token, tipo, extra, res,  cb) {
		var file;
		var nameDownload;
		var descarga;
/*
        const valores = options && options.accessToken;
        const userToken = valores && valores.id;
        const userId = valores && valores.userId;
*/
		 Promise.resolve()
	    .then(function() {
			return new Promise(function(resolve, reject) {
				Descarga.find({where:{des_token_validation:token,des_descargado:false}},(err,descargas)=>{
					if(err){
						console.log(err);
						res.status(500).send(  "Vuelva a intentarlo en unos momentos." );				
					}else{
						if(descargas.length!=1){
							res.status(400).send(  "Token es erroneo" );	
						}else{
							descarga = descargas[0];
							/*if(userId !== descarga.userId){
								res.status(400).send(  "No se puede realizar descarga" );
							}else{	*/					
								if(descarga.des_descargado){
									res.status(400).send(  "Archivo ya fue descargado" );
								}else{
									if(tipo==1 || tipo==2 || tipo ==5){//orden
										Descarga.app.models.orden.findById(descarga.id,{},
								  		(err,orden)=>{
								  			if(err){
												//res.type('application/json');
												res.status(500).send(  "Vuelva a intentarlo en unos momentos." );
								  			}else{	  	
								  				if(!orden){
													//res.type('application/json');
													res.status(400).send(  "Archivo a descargar no existe" );
								  				}else{	  	
								  					if(tipo==1){//descagar ordenamiento
								  						Descarga.app.models.configuracion.findById(orden.conf_id,
									  						{},
									  						(err,configuracion)=>{
									  							if(err){
																	res.status(500).send(  "Vuelva a intentarlo en unos momentos.." );				
																}else if(!configuracion){
																	res.status(400).send(  "Descarga es erronea" );
																}else{

																	file = 	path.join(configuracion.conf_local_carpeta_out, orden.pro_nombre_archivo_out);
																	nameDownload = orden.pro_nombre_archivo_out;
																	resolve();
																}
																
									  						}
									  					);	 
								  					}else if(tipo==2){//ordenamiento cargo
									  						file = 	path.join(orden.ord_ruta_salida,orden.ord_id+"_"+orden.pro_nro_orden_courier+"_pdf.zip");
									  						nameDownload = orden.pro_nro_orden_courier+"_pdf.zip";
									  						resolve();
							  						/*}else if(tipo==4){
									  						file = 	path.join(Descarga.app.get("path").cargo.descarga+orden.ord_id, orden.pro_nro_orden_courier+"_sim.zip");
									  						nameDownload = orden.pro_nro_orden_courier+"_sim.zip";
									  						resolve();*/
													}else if(tipo==5){
							  							//tipo=5 etiqueta
								  						file = 	path.join(orden.ord_ruta_salida,orden.pro_nro_orden_courier+"_ETIQUETA.pdf");
								  						nameDownload = orden.pro_nro_orden_courier+"_ETIQUETA.pdf";
								  						resolve();
								  					}						  					 				
								  				}
								  			}
								  		});
									}else if(tipo == 3){//or//recuperacion cargo
										Descarga.app.models.cargo.findById(descarga.id,{},
								  		(err,cargo)=>{
								  			if(err){
												//res.type('application/json');
												res.status(500).send(  "Vuelva a intentarlo en unos momentos.." );
								  			}else if(!cargo){
												//res.type('application/json');
												res.status(400).send(  "Archivo a descargar no existe" );
							  				}else if(cargo.car_path == null && cargo.car_archivo_nombre ==null){
												res.status(400).send(  "Descarga es erronea" );
					  						}else{
						  						file = 	path.join(cargo.car_path, cargo.car_archivo_nombre);
						  						nameDownload =  cargo.car_archivo_nombre;
						  						resolve();				  					 			
				  							}	
							  				
								  			
								  		});
									}else if(tipo == 4){//4 sim
										let fileNameTemp = uuidv1();
										try{
						    				let cmd = "python3 "+Descarga.app.get("python").sim.generar+" '"+extra+"' "+fileNameTemp;

						        			exec(cmd, (err, stdout, stderr) => {					        
						        				console.log("ejecuto commando");
										        if (err) {
										        	console.log(err);
													//next(null, {error:true,mensaje:"Ocurrio un error!"});
													res.status(500).send(  "Ocurrio un error!" );
										        }else{
													//next(null, {error:false,mensaje:"Etiqueta generada."});
													//file = 	path.join(cargo.car_path, cargo.car_archivo_nombre);

							  						file = 	path.join(Descarga.app.get("path").sim.descarga, fileNameTemp+"_sim.zip");
													
							  						//console.log(file);
							  						nameDownload = file+"_sim.zip" ;
							  						resolve();	
										        }
										    });
						    			}catch(err){
											console.log(err);
											//next(null, {error:true,mensaje:"Ocurrio un error!"});
											res.status(500).send(  "Ocurrio un error!" );
										}
									}else if(tipo == 6){//6 sim
										extra = extra.replace(/\\|[.]{2}/g, "_");
										file = 	path.join(Descarga.app.get("path").recepcion.descarga_sim, 'SIM_'+extra);
										nameDownload = 'SIM_'+extra;
										resolve();
									}else if(tipo == 7){//6 sim
										extra = extra.replace(/\\|[.]{2}/g, "_");
										file = 	path.join(Descarga.app.get("path").recepcion.descarga_observacion, 'obs_'+extra);
										nameDownload = 'obs_'+extra
										resolve();

									}else if(tipo == 8){//TAREA
										console.log(descarga);
										Descarga.app.models.tarea.findById(descarga.id,{},
								  		(err,tareaTemp)=>{
								  			if(err){
												//res.type('application/json');
												res.status(500).send(  "Vuelva a intentarlo en unos momentos.." );
								  			}else if(!tareaTemp){
												//res.type('application/json');
												res.status(400).send(  "Archivo a descargar no existe" );
							  				}else if(tareaTemp.tar_archivo_salida == null ){
												res.status(400).send(  "Descarga es erronea.." );
					  						}else{
						  						file = 	tareaTemp.tar_archivo_salida;
						  						nameDownload = file.split("/").pop();
						  						//nameDownload =  "datos.pdf";
						  						//console.log(nameDownload);
						  						resolve();				  					 			
				  							}									  			
								  		});										
									}else if(tipo == 9){//GUIA
										console.log('descarga GUIA');
										console.dir(descarga);
										file = 	path.join(Descarga.app.get("path").guias.descarga_exportar, extra);
										nameDownload = extra;
										resolve();									
									}else if(tipo == 12){//GUIA
										console.log('descarga GUIA DETALLADA');
										console.dir(descarga);
										file = 	path.join(Descarga.app.get("path").guias.descarga_exportar, extra);
										nameDownload = extra;
										resolve();									
									}else if(tipo == 14){//GUIA
										console.log('descarga GUIA DESPACHO');
										console.dir(descarga);
										file = 	path.join(Descarga.app.get("path").guias.descarga_exportar, extra);
										nameDownload = extra;
										resolve();									
									}else if(tipo == 15){//GUIA
										console.log('descarga GUIA DESPACHO DETALLE');
										console.dir(descarga);
										file = 	path.join(Descarga.app.get("path").guias.descarga_exportar, extra);
										nameDownload = extra;
										resolve();									
									}
									else if(tipo == 16){//GUIA
										console.log('descarga GUIA DESPACHO');
										console.dir(descarga);
										file = 	path.join(Descarga.app.get("path").guias.descarga_exportar, extra);
										nameDownload = extra;
										resolve();									
									}else if(tipo == 17){//GUIA
										console.log('descarga GUIA DESPACHO RECEP');
										console.dir(descarga);
										file = 	path.join(Descarga.app.get("path").guias.descarga_exportar, extra);
										nameDownload = extra;
										resolve();									
									}else if(tipo == 18){//GUIA
										console.log('descarga GUIA DESPACHO RECEP DETALLE');
										console.dir(descarga);
										file = 	path.join(Descarga.app.get("path").guias.descarga_exportar, extra);
										nameDownload = extra;
										resolve();									
									}else if(tipo == 19){//GUIA
										console.log('descarga ORDENES');
										console.dir(descarga);
										file = 	path.join(Descarga.app.get("path").guias.descarga_exportar, extra);
										nameDownload = extra;
										resolve();									
									}else if(tipo == 20){//GUIA
										console.log('descarga CLIENTE');
										console.dir(descarga);
										file = 	path.join(Descarga.app.get("path").guias.descarga_exportar, extra);
										nameDownload = extra;
										resolve();									
									}else if(tipo == 21){//GUIA
										console.log('descarga EXCEL GUIA');
										console.dir(descarga);
										file = 	path.join(Descarga.app.get("path").guias.descarga_exportar, extra);
										nameDownload = extra;
										resolve();									
									}else if(tipo == 22){//GUIA
										console.log('descarga EXCEL DESPACHO');
										console.dir(descarga);
										file = 	path.join(Descarga.app.get("path").guias.descarga_exportar, extra);
										nameDownload = extra;
										resolve();									
									}else if(tipo == 23){//GUIA
										console.log('descarga EXCEL MENSAJERO');
										console.dir(descarga);
										file = 	path.join(Descarga.app.get("path").guias.descarga_exportar, extra);
										nameDownload = extra;
										resolve();									
									}else if(tipo == 24){//GUIA
										console.log('descarga EXCEL MENSAJERO');
										console.dir(descarga);
										file = 	path.join(Descarga.app.get("path").guias.descarga_exportar, extra);
										nameDownload = extra;
										resolve();									
									}else{
										reject("Descarga erronea");
									}										
								}
							//}
						}
					}
				});
			});
	    })
	    .then(function() {
			return new Promise(function(resolve, reject) {				
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
						descarga.updateAttributes({
							des_descargado:true,
							des_fecha_descarga:new Date()
						},
						(err,descargaTemp)=>{
							if(err)res.status(500).send(  "Vuelva a intentarlo en unos momentos..." );
							res.set('Content-Type','application/force-download');
							res.set('Content-Type','application/octet-stream');
							res.set('Content-Type','application/download');
							res.set('Content-Disposition','attachment;filename='+nameDownload);
							reader.pipe(res);

						});
					});
				}
			});
	    })
		.catch(function(err){
			console.log(err);
			next('Ocurrio un error, vuelva a intentar en unos minutos.....');
		});


		//download.create()
	  
	  /*	fs.readFile(path.join(store, filename), function(err, content) {
	    	if (err) return cb(err);
	    	cb(null, content);
	  	});*/

		// callback is intentionally not invoked*/

/*
	  	var bodyStream = fs.createReadStream(path.join(store, filename));// create response stream from file
	  	var contentType = "application/CSV";// set from file extension
	  	var Content_Disposition = "attachment; filename=prueba.csv";
	  	cb(null, bodyStream, contentType,Content_Disposition);*/
	};

	Descarga.remoteMethod('download', {
		//isStatic: true,
		accepts: [
			{arg: 'token', type: 'string', required: true},			
			{arg: 'tipo', type: 'number', required: true},
			{arg: 'extra', type: 'string', required: false},		
    		{arg: 'res', type: 'object', 'http': {source: 'res'}}/*,
        	{arg: "options", type: "object", 'http': "optionsFromRequest"}*/
		],
		/*returns: { 
			arg: 'content', 
			type: 'buffer',
			root: true, 
			encoding: 'raw' 
		},*/
		/*returns:[
		    { arg: 'bodyStream', type: 'stream', root: true },
		    { arg: 'content-type', type: 'string', http: { target: 'header' } }
    	],*/
		http: { verb: 'get', path: '/download/:token' },
	});
}




/*var fs = require('fs-extra');
var uuid = require('uuid');
var path = require('path');

var Hooks = require('../../../helpers/hooks');
var Files = require('../../../helpers/files');
module.exports = (Orden) => {
	Orden.download = function( ord_id, options, res, next) {
		

        let token = options && options.accessToken;
        let userId = token && token.userId;
        let user = userId ? 'user#' + userId : '<anonymous>';
        
		Orden.findById(ord_id, {},
			(err,orden)=>{
				console.log(orden);
				if(err)next(err,null);
				if(!orden){
					next("Error: vuelva a intentarlo",null);
				}else{				
					console.log(orden);	
			        var bodyStream = fs.createReadStream('D:\\mnt\\nfs\\descarga\\web\\193_CRTAS EPS AL 14.02.2018_SCTR_SALUD_SIN_ANEXO.jrn');// create response stream from file
					 // var contentType = // set from file extension
					 //next(null, bodyStream);
					 bodyStream.on('error', function (err) {
					    res.type('application/json');
					    res.send(500, { error: err });
					  });
					  bodyStream.pipe(res);
							
				}
			}
		);

    };

    Orden.remoteMethod(
        'download',
        {
         http: {path: '/download/:ord_id',verb: 'get'},
         accepts: [
            {arg: 'ord_id',type: 'number',required: true},
        	{arg: "options", type: "object", "http": "optionsFromRequest"},
    		{arg: 'res', type: 'object', 'http': {source: 'res'}}
         ],
         returns: [
		    { arg: 'bodyStream', type: 'stream', root: true }/*,
		    { arg: 'content-type', type: 'string', http: { target: 'header' } }*/
		 /* ]
        }
    );

}*/