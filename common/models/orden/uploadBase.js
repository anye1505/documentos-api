
var fs = require('fs-extra');
var uuid = require('uuid');
var path = require('path');
var Excel   = require("exceljs");
var { exec } = require('child_process');

var Hooks = require('../../../helpers/hooks');
var Files = require('../../../helpers/files');
module.exports = (Orden) => {
	Orden.beforeRemote('uploadBase', Hooks.beforeRemoteFormData);

	Orden.uploadBase = function( httpReq, formato, fecha, file, options, next) {console.log("formato:",formato)
		httpReq.setTimeout(0);
	    var ds = Orden.dataSource;
	    var data = {};
		let valores = options && options.accessToken;
		let token = valores && valores.id;
 		let userId = valores && valores.userId;

 		let desFileName = '';
		 Promise.resolve()
	    .then(function() {
			return new Promise(function(resolve, reject) {
		 		Orden.app.models.user.findById(
					userId,{},
					(err,data)=>{
						if(err){
							console.log(err);
							reject();
						}
						else{
							if(!data){
								console.log("No se encontraron datos de usuario.");
								reject();
							}else{	
								resolve(data);
							}
						}
					}
				)
			})
		})
		.then((datos)=>{
			return new Promise(function(resolve, reject) {
				
				//console.log("1emp_id -> "+emp_id);
		      	let filename = file.name;// uuid.v1() + file.name.substring(file.name.lastIndexOf('.'));
		      	desFileName = uuid.v1()+"_"+filename;
				//console.log("ruta complete -> "+emp_id);
		      	let destPath = path.join(Orden.app.get("path").cargar_base[formato], desFileName);
				fs.copyFile(file.path, destPath, (err) => {
					if (err) {
						console.log(err);
						reject();
					}else{
						datos['desFileName'] = desFileName;
						// let cmd = "python3 /home/documento/apps/recuperar_cargos.py "+id+" "+cargo;
						if(formato==3){	
							console.log(destPath.substr(destPath.lastIndexOf(".")+1,destPath.length));
							if(destPath.substr(destPath.lastIndexOf(".")+1,destPath.length) == "txt"){
								resolve(datos);
							}else{
								let cmd = 'python3 /home/documento/apps/convertir_xlsx_a_texto.py "'+destPath+'" "'+destPath.substr(0,destPath.lastIndexOf("."))+'.txt"';
								console.log(cmd);
								exec(cmd, (err, stdout, stderr) => {					        
									console.log("ejecuto commando");
									if (err) {
										console.log(err);
										//next(null, {error:true,mensaje:"Ocurrio un error!"});
										// res.status(500).send(  "Ocurrio un error!" );
										reject(err);
									}else{
										console.log(desFileName);
										datos['desFileName'] = desFileName.substr(0,desFileName.lastIndexOf("."))+'.txt';
										console.log("aaaa = " + datos['desFileName']);
										console.log("ejecuto bien el comando");
										resolve(datos);
									}
								});
							}
						}else{
							resolve(datos);
						}
					}
				});

			})		
		})
		.then((datos)=>{
			console.log("datos = ",datos);
			return new Promise(function(resolve, reject) {
				let sql = ""; //desFileName='a6d9a4c0-e84c-11e8-b1ce-71e2e03c3f0b_121118.txt';
				//desFileName='d9259ec0-e84c-11e8-b1ce-71e2e03c3f0b_121118.txt';
				//desFileName='base_documentos_con_cb.txt';
				let params = [datos.desFileName, userId, datos.emp_id, datos.suc_id];
				console.log(params);
				if(formato==1){
					//sql = "select * from  proceso.spu_orden_carga_formato1($1,$2,$3, $4);";
					sql = "select * from  proceso.spu_orden_carga_formato1_fecha($1,$2,$3, $4, $5);";
					params.push(fecha);
				}
				if(formato==3){
					//console.log(params);	
					console.log("formato 3");	
					sql = "select * from  proceso.spu_orden_carga_formato3($1,$2,$3, $4);";
				}
				if(formato==2){
					sql = "select * from  proceso.spu_orden_carga_formato2($1,$2,$3, $4);";
				}
				
				//console.log(params);
				ds.connector.execute(sql, params, function(err, data) {
			          if (err){
			          	console.log(err);
			            reject();      
			          }else{console.log("response:",data);
						/*if(data[0].error){							
			          		next(data[0].mensaje);	
						}else{*/
			          		next(null, data);	
						//}
			          }			          
		      	});
			})			
		})
		.catch(function(err){
			console.log(err);
			next('Ocurrio un error, vuelva a intentar en unos minutos');
		});
	};
	

	// Orden.uploadBase = function( httpReq, formato, fecha, file, options, next) {
	// 	httpReq.setTimeout(0);
	//     var ds = Orden.dataSource;
	//     var data = {};
	// 	let valores = options && options.accessToken;
	// 	let token = valores && valores.id;
 	// 	let userId = valores && valores.userId;

 	// 	let desFileName = '';
	// 	 Promise.resolve()
	//     .then(function() {
	// 		return new Promise(function(resolve, reject) {
	// 	 		Orden.app.models.user.findById(
	// 				userId,{},
	// 				(err,data)=>{
	// 					if(err){
	// 						console.log(err);
	// 						reject();
	// 					}
	// 					else{
	// 						if(!data){
	// 							console.log("No se encontraron datos de usuario.");
	// 							reject();
	// 						}else{	
	// 							resolve(data);
	// 						}
	// 					}
	// 				}
	// 			)
	// 		})
	// 	})
	// 	.then((datos)=>{
	// 		return new Promise(function(resolve, reject) {
				
	// 			//console.log("1emp_id -> "+emp_id);
	// 	      	let filename = file.name;// uuid.v1() + file.name.substring(file.name.lastIndexOf('.'));
	// 	      	desFileName = uuid.v1()+"_"+filename;
	// 			//console.log("ruta complete -> "+emp_id);
	// 	      	let destPath = path.join(Orden.app.get("path").cargar_base[formato], desFileName);
	// 			//		console.log(desFileName);

	// 			fs.copyFile(file.path, destPath, (err) => {
	// 				if (err) {
	// 					console.log(err);
	// 					reject();
	// 				}else{
	// 					console.log(desFileName);
	// 					//datos['desFileName'] = desFileName;
	// 					resolve(datos);
	// 				}
	// 			});

	// 		})		
	// 	})
	// 	.then((datos)=>{
	// 		return new Promise(function(resolve, reject) {
	// 			let sql = ""; //desFileName='a6d9a4c0-e84c-11e8-b1ce-71e2e03c3f0b_121118.txt';
	// 			//desFileName='d9259ec0-e84c-11e8-b1ce-71e2e03c3f0b_121118.txt';
	// 			//desFileName='base_documentos_con_cb.txt';
	// 			let params = [desFileName, userId, datos.emp_id, datos.suc_id];
	// 			if(formato==1){
	// 				//sql = "select * from  proceso.spu_orden_carga_formato1($1,$2,$3, $4);";
	// 				sql = "select * from  proceso.spu_orden_carga_formato1_fecha($1,$2,$3, $4, $5);";
	// 				params = [desFileName, userId, datos.emp_id, datos.suc_id, fecha];
	// 			}
	// 			if(formato==3){			
	// 				sql = "select * from  proceso.spu_orden_carga_formato3($1,$2,$3, $4);";
	// 			}
	// 			if(formato==2){
	// 				sql = "select * from  proceso.spu_orden_carga_formato2($1,$2,$3, $4);";
	// 			}
				
	// 			//console.log(params);
	// 			ds.connector.execute(sql, params, function(err, data) {
	// 		          if (err){
	// 		          	console.log(err);
	// 		            reject();      
	// 		          }else{
	// 					if(data[0].error){							
	// 		          		next(data[0].mensaje);	
	// 					}else{
	// 		          		next(null, data);	
	// 					}
	// 		          }			          
	// 	      	});
	// 		})			
	// 	})
	// 	.catch(function(err){
	// 		console.log(err);
	// 		next('Ocurrio un error, vuelva a intentar en unos minutos');
	// 	});
    // };








	// Orden.cargarbaseformato = function(res){
	// 	res.setHeader('Content-disposition', 'attachment; filename=aceleradorcums.xlsx');
	// 	res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	// 	var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res, useStyles: true });
	// 	var sheet = workbook.addWorksheet("aceleradorcums");
	// 	var worksheet = workbook.getWorksheet(1);
	// 	worksheet.columns = [{ header: 'cum', key: 'cum', width: 30, style: { font: { name: "Calibri" } } }	];
	// 	worksheet.getCell("A1").border = { top: {style:"thin"}, left: {style:"thin"}, bottom: {style:"thin"}, right: {style:"thin"} };
	// 	worksheet.commit();
	// 	workbook.commit();

		
	// }

	Orden.cargarbaseformato = function(type, res, callback) {
		// res.setHeader('Content-disposition', 'attachment; filename=ejemplo_formato_documentos.xls');
		// res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		// res.set('Content-Transfer-Encoding','binary');
		// res.send('CODIGO_UNICO;DESTINATARIO;DIRECCION;REFERENCIA;DOCUMENTO_RUC;DEPARTAMENTO;PROVINCIA;DISTRITO;TELEFONO1;TELEFONO2;EMAIL;FECHA_CORTE;CODIGO_BARRA');
		var datetime = new Date();
		res.set('Expires', 'Tue, 03 Jul 2021 06:00:00 GMT');
		res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
		res.set('Last-Modified', datetime +'GMT');
		res.set('Content-Type','application/force-download');
		res.set('Content-Type','application/octet-stream');
		res.set('Content-Type','application/download');
		res.set('Content-Disposition','attachment;filename=ejemplo_formato_documentos.csv');
		res.set('Content-Transfer-Encoding','binary');
		res.send('CODIGO_UNICO	DESTINATARIO;DIRECCION;REFERENCIA;DOCUMENTO_RUC;DEPARTAMENTO;PROVINCIA;DISTRITO;TELEFONO1;TELEFONO2;EMAIL;FECHA_CORTE;CODIGO_BARRA');
	}

    Orden.remoteMethod(
        'uploadBase',
        {
         http: {
         	path: '/uploadBase',
         	 verb: 'post'
         },
         accepts: [
         	{ arg: "req", type: "object", http: { source: "req" } },
            {
            	arg: 'formato', 
            	type: 'string', 
            	required: true
			},
			{
            	arg: 'fecha', 
            	type: 'string', 
            	required: true
            },{
		      	arg: 'file',
		      	type: 'object', 
            	required: true
		    },
   			{arg: "options", type: "object", 'http': "optionsFromRequest"}
         ],
         returns: {         	
		      args: 'response',
		      type: 'object',
		      root: true
         }
        }
	);
	
	Orden.remoteMethod('cargarbaseformato', {
		//isStatic: true,
		accepts: [	
    		{arg: 'type', type: 'string', required: true },
    		{arg: 'res', type: 'object', 'http': {source: 'res'}}
		],
		returns: { },
		http: { verb: 'get', path: '/cargarbaseformato/:type' },
	});

}