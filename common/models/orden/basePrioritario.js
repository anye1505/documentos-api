
var fs = require('fs-extra');
var uuid = require('uuid');
var path = require('path');

var Hooks = require('../../../helpers/hooks');
var Files = require('../../../helpers/files');
module.exports = (Orden) => {
	Orden.beforeRemote('basePrioritario', Hooks.beforeRemoteFormData);

	Orden.basePrioritario = function( operador, file, options, next) {

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
		      	let destPath = path.join(Orden.app.get("path").prioritario.generar, desFileName);
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

				//sql = "select * from  proceso.sp_doc_recepcionar_archivo($1,$2,$3, $4, $5);";
				sql = "select * from  proceso.sp_carga_base_prioritario($1, $2, $3, $4);";

				let params = [desFileName, operador, data.emp_id, userId];
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
        'basePrioritario',
        {
         http: {
         	path: '/basePrioritario',
         	 verb: 'post'
         },
         accepts: [
            {
            	arg: 'operador', 
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

}