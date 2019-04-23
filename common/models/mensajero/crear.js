
var fs = require('fs-extra');
var uuid = require('uuid');
var path = require('path');

//var Hooks = require('../../../helpers/hooks');
//var Files = require('../../../helpers/files');
module.exports = (Mensajero) => {
	//Mensajero.beforeRemote('basePrioritario', Hooks.beforeRemoteFormData);

	Mensajero.crear = function( per_id,per_tipo_documento,per_nro_documento,per_nombre1,per_nombre2,per_apellido1,
            per_apellido2,per_email,per_telefono1,per_telefono2,per_fecha_nacimiento,
			per_direccion,ubi_id_distrito,men_activo,cod_mensajero_courier,
			imagen,options,next) {

	    var ds = Mensajero.dataSource;
	    var data = {};
		let valores = options && options.accessToken;
		let token = valores && valores.id;
 		let userId = valores && valores.userId;


 		let persona = null;
 		let type=null;
 		//let pathFoto=null;
		Promise.resolve()

		.then(function() {
			return new Promise(function(resolve, reject) {
				if(imagen != ''){
					type = imagen.split(';')[0].split('/')[1];
					type = type.toUpperCase();

					if(type=='PNG' || type=='JPEG' || type=='JPG'){// || type=='GIF' ){
						resolve();
					}else{
						reject("Imagen erronea");
					}
				}else{
					resolve();
				}				
			})
		})
	    .then(function() {
			return new Promise(function(resolve, reject) {
				Mensajero.app.models.user.findById(
					userId,{},
					(err,data)=>{
						if(err){
							reject(err);
						}
						else{
							if(!data){
								reject("No se encontraron datos del usuario.");
							}else{		
								resolve(data);
							}
						}
					}
				)
			})
		})
		.then((user)=>{
			return new Promise(function(resolve, reject) {
				if(per_id > 0){
					Mensajero.findOne(
						{
							where:{
								per_id:per_id,
								suc_id:user.suc_id//user.emp_id
							}
						},
						(err,data)=>{
							if(err){
								reject(err);
							}
							else{
								if(data){
									reject("Mensajero ya se encuentra registrado.")
								}else{		
									resolve(user);
								}
							}
						}	
					);
				}else{
					resolve(user);
				}
			})		
		})
	    .then(function(user) {
			return new Promise(function(resolve, reject) {
				if(per_id > 0){
					Mensajero.app.models.persona.upsertWithWhere(
						{							
							per_id:per_id							
						},
						{
							per_tipo_documento:per_tipo_documento
							,per_nro_documento:per_nro_documento
							,per_nombre1:per_nombre1
							,per_nombre2:per_nombre2
							,per_apellido1:per_apellido1
							,per_apellido2:per_apellido2
							,per_email:per_email
							,per_telefono1:per_telefono1
							,per_telefono2:per_telefono2
							,per_fecha_nacimiento:per_fecha_nacimiento
							,per_direccion:per_direccion
							,ubi_id_distrito:ubi_id_distrito
						},
						(err,data)=>{
							if(err){
								reject(err);
							}
							else{
								if(!data){
									reject("Persona erronea al registrar.")
								}else{		
									persona = data;
									resolve(user);
								}
							}
						}
					);
					/*Mensajero.app.models.persona.findById(
						per_id,{},
						(err,data)=>{
							if(err){
								reject(err);
							}
							else{
								if(!data){
									reject("Persona erronea al registrar.")
								}else{		
									persona = data;
									resolve(user);
								}
							}
						}
					);*/
				}else{
					Mensajero.app.models.persona.upsertWithWhere(
						{
							//where:{
								per_tipo_documento:per_tipo_documento,
								per_nro_documento:per_nro_documento
							//}
						},
						{
							per_tipo_documento:per_tipo_documento
							,per_nro_documento:per_nro_documento
							,per_nombre1:per_nombre1
							,per_nombre2:per_nombre2
							,per_apellido1:per_apellido1
							,per_apellido2:per_apellido2
							,per_email:per_email
							,per_telefono1:per_telefono1
							,per_telefono2:per_telefono2
							,per_fecha_nacimiento:per_fecha_nacimiento
							,per_direccion:per_direccion
							,ubi_id_distrito:ubi_id_distrito
						},
						(err,data)=>{
							if(err){
								reject(err);
							}
							else{
								if(!data){
									reject("Persona erronea al registrar.")
								}else{		
									persona = data;
									resolve(user);
								}
							}
						}
					);
				}		 	
			})
		}).then((user)=>{
			return new Promise(function(resolve, reject) {
				if(imagen !=''){
					let buf = new Buffer(imagen.replace(/^data:image\/\w+;base64,/, ""),'base64');
					let pathFoto = uuid()+'.'+type;
					fs.writeFile(Mensajero.app.get("path").mensajero.foto + pathFoto, buf, (err) => {  
					    // throws an error, you could also catch it here
					    if (err) {
					    	reject(err);
					    }else{
					    	//resolve(user);
					    	persona.updateAttributes(
							{
								per_foto: pathFoto
							},
							(err,data)=>{
								if(err){
									reject(err);
								}
								else{
									if(!data){
										reject("Mensajero erroneo al registrar.")
									}else{		
										resolve(user);
									}
								}
							}	
						);
					    }
					});
				}else{
					resolve(user);
				}
			})		
		})
		.then((user)=>{
			return new Promise(function(resolve, reject) {
				Mensajero.findOne(
					{
						where:{
							per_id:persona.per_id,
							suc_id:user.suc_id//user.emp_id
						}
					},
					(err,data)=>{
						if(err){
							reject(err);
						}
						else{
							if(data){
								reject("Mensajero ya se encuentra registrado.")
							}else{		
								resolve(user);
							}
						}
					}	
				);
			})		
		})
		.then((user)=>{
			return new Promise(function(resolve, reject) {
				Mensajero.create(
					{
						per_id:persona.per_id,
						emp_id_courier:user.emp_id,
						men_activo:men_activo,
						cod_mensajero_courier:cod_mensajero_courier,
						suc_id:user.suc_id
					},
					(err,data)=>{
						if(err){
							reject(err);
						}
						else{
							if(!data){
								reject("Mensajero erroneo al registrar.")
							}else{		
								next(null,data);
							}
						}
					}	
				);
			})			
		})
		.catch(function(err){
			console.log(err);
			//next('Ocurrio un error, vuelva a intentar en unos minutos');
			next(err);
		});
    };

    Mensajero.remoteMethod(
        'crear',
        {
         http: {
         	path: '/crear',
         	 verb: 'post'
         },
         accepts: [
            {
            	arg: 'per_id', 
            	type: 'number', 
            	required: true
            },{
            	arg: 'per_tipo_documento', 
            	type: 'string', 
            	required: true
            },{
            	arg: 'per_nro_documento', 
            	type: 'string', 
            	required: true
            },{
            	arg: 'per_nombre1', 
            	type: 'string', 
            	required: true
            },{
            	arg: 'per_nombre2', 
            	type: 'string', 
            	required: false
            },{
            	arg: 'per_apellido1', 
            	type: 'string', 
            	required: true
            },{
            	arg: 'per_apellido2', 
            	type: 'string', 
            	required: false
            },{
            	arg: 'per_email', 
            	type: 'string', 
            	required: false
            },{
            	arg: 'per_telefono1', 
            	type: 'string', 
            	required: false
            },{
            	arg: 'per_telefono2', 
            	type: 'string', 
            	required: false
            },{
            	arg: 'per_fecha_nacimiento', 
            	type: 'date', 
            	required: true
            },{
            	arg: 'per_direccion', 
            	type: 'string', 
            	required: false
            },{
            	arg: 'ubi_id_distrito', 
            	type: 'number', 
            	required: false
            },{
            	arg: 'men_activo', 
            	type: 'Boolean', 
            	required: true
            },{
            	arg: 'cod_mensajero_courier', 
            	type: 'string', 
            	required: false
            },

      		{arg: 'imagen', 			type: 'buffer', 	required: false}, 
            /*{
		      	arg: 'file',
		      	type: 'object', 
            	required: true
		    },*/
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