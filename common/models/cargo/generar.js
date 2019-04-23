
var fs = require('fs-extra');
var uuid = require('uuid');
var path = require('path');

var Hooks = require('../../../helpers/hooks');
var Files = require('../../../helpers/files');
var { exec } = require('child_process');
var uuid = require('uuid');
module.exports = (Cargo) => {
	Cargo.beforeRemote('generar', Hooks.beforeRemoteFormData);

	var destPath;
	var cargo;
	var nameFile;
	Cargo.generar = function( nombre,cargo, file, options, next) {

        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const userId = valores && valores.userId;		


		 Promise.resolve()
		 .then(function() {
			return new Promise(function(resolve, reject) {
		      	let filename = file.name;// uuid.v1() + file.name.substring(file.name.lastIndexOf('.'));
		      	nameFile =  uuid.v1()+"_"+filename;//"pruebarecuperacioncargo.txt";

				destPath = path.join(Cargo.app.get('path').cargo.recuperacion, nameFile);
				
				
				
				fs.copyFile(file.path, destPath, (err) => {
					if (err) {
						console.log(err);
						reject(err);
					}else{
						resolve();
					}
				});
	      	});
	    })
	    .then(function() {
			return new Promise(function(resolve, reject) {
				var ds = Cargo.dataSource;

			    var dataquery = {};
				//console.log("datos entrada=",nameFile," ",nombre," ",userId," ",cargo);
			    var sql = "select * from cargo.spu_recuperacion_carga_archivo($1,$2,$3,$4);";
		      	ds.connector.execute(sql, [nameFile,nombre,userId,cargo], function(err, data) {
			          if (err){
			            reject(err);
			          }else{	
						dataquery=data[0];console.log("data=",data[0]);
			          	if(dataquery.error){
			          		next(dataquery.mensaje);
			          	}else{
			          		setTimeout(function(id){
		            			try{console.log("data id=",dataquery.id);
									//let cmd = "python3 /home/documento/apps/recuperar_cargos.py "+id+" "+cargo;
									let cmd = "python3 /home/documento/apps/recuperar_cargos.py "+dataquery.id;
			        				console.log(cmd);

				        			exec(cmd, (err, stdout, stderr) => {	
								        if (err) {			        
								        	console.log(err);
								          	Cargo.upsertWithWhere(
								          		{car_id:id},
								          		{car_estado:"ERROR"},
								          		(err, datos)=>{
								          			console.log("ejecuto1 upsert111111");
								          			console.log(err);
								          		}
								          	);
								        }
								    });
								}catch(err){
									console.log(err);
						          	Cargo.upsertWithWhere(
						          		{car_id:id},
						          		{car_estado:"ERROR"},
						          		(err, datos)=>{
						          			console.log("ejecuto2 upsert111111");
						          			console.log(err);
						          		}
						          	);
								}
					    	}, 1000,data.id);  

							next(null,{error:false}); 
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

    Cargo.remoteMethod(
        'generar',
        {
         http: {
         	path: '/generar',
         	 verb: 'post'
         },
         accepts: [
            {
            	arg: 'nombre', 
            	type: 'string', 
            	required: true
            }, 
            {
            	arg: 'cargo', 
            	type: 'string', 
            	required: true
            },
            {
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