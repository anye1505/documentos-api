
var fs = require('fs-extra');
var uuid = require('uuid');
var path = require('path');

var Hooks = require('../../../helpers/hooks');
var Files = require('../../../helpers/files');
module.exports = (Orden) => {
	Orden.beforeRemote('recepcionArchivo', Hooks.beforeRemoteFormData);
	
	Orden.recepcionArchivo = function( fecharecep, operador, file, options, next) {

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
								desFileName="nombre x";
								//next(null, {archivo:desFileName});	
								resolve(data);
							}
						}
					}
				)
			})
		})
		.then((data)=>{

			return new Promise(function(resolve, reject) {
				//console.log("1emp_id -> "+emp_id);
		      	let filename = file.name;// uuid.v1() + file.name.substring(file.name.lastIndexOf('.'));
		      	desFileName = uuid.v1()+"_"+filename;
				//console.log("ruta complete -> "+emp_id);
		      	let destPath = path.join(Orden.app.get("path").recepcion.generar, desFileName);
				//		console.log(desFileName);

				fs.copyFile(file.path, destPath, (err) => {
					if (err) {
						reject(err);
					}else{
						resolve(data);
					}
				});

			})		
		})
		.then((data)=>{
			return new Promise(function(resolve, reject) {
				let sql = "";
				let params;
				//desFileName = "a3e07e80-ec69-11e8-bd75-8f3452890a3f_BASE_RECEPCION_191118.txt";
				//console.log("datos: ",desFileName, operador, data.emp_id, data.suc_id, userId, fecharecep);
				//sql = "select * from  proceso.sp_doc_recepcionar_archivo($1,$2,$3, $4, $5);";
				//sql = "select * from  proceso.sp_doc_recepcionar_archivo_dataimagenes($1,$2,$3, $4, $5);"; linea comentada 15/10/2018 - Anyelys
				/*if(operador == 23){
					sql = "select * from  proceso.sp_doc_recepcionar_archivo_dataimagenes_fecha($1,$2,$3,$4,$5,$6);";//linea agregada 15/10/2018 - Anyelys
					params = [desFileName, operador, data.emp_id, data.suc_id, userId, fecharecep];
				}else{*/
					sql = "select * from  proceso.sp_doc_recepcionar_archivo_fecha($1,$2,$3, $4, $5, $6);";//linea agregada 15/10/2018 - Anyelys
					params = [desFileName, operador, data.emp_id, data.suc_id, userId, fecharecep];
				//}			
				
				//console.log(params);
				ds.connector.execute(sql, params, function(err, data) {
			          if (err){
			            reject(err);      
			          }else{
						if(data[0].error){							
			          		next(data[0].mensaje);	
						}else{
			          		next(null, {archivo:desFileName});	
						}
			          }			          
		      	});
			})			
		})
		.catch(function(err){
			console.log(err);
			next('Ocurrio un error, vuelva a intentar en unos minutos');
		});
    };

    Orden.remoteMethod(
        'recepcionArchivo',
        {
         http: {
         	path: '/recepcionArchivo',
         	 verb: 'post'
         },
         accepts: [
			{
            	arg: 'fecharecep', 
            	type: 'string', 
            	required: true
            },
			{
            	arg: 'operador', 
            	type: 'string', 
            	required: false
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

}