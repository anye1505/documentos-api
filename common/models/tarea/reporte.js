

var { exec } = require('child_process');

module.exports = (Tarea) => {
	Tarea.reporte = (descripcion,tipo,extension,ordenes,options,next) => {

		let valores = options && options.accessToken;
		let token = valores && valores.id;
 		let userId = valores && valores.userId;

 		if(extension != 'PDF' && extension != 'XLSX'){
 			next(null,{error:true,mensaje:'Extension es erroneo'});
 		}else{
 			Tarea.app.models.user.findById(
				userId,{},
				(err,data)=>{
					if(err)next(err);
					else{
						if(!data){
							next("Usuario no tiene acceso");
						}else{						
							let cmd = 'python3 '+Tarea.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "orden='+ordenes.join(',')+'"\' '+userId+' \''+descripcion+'\'';
		        			console.log(cmd);
		        			exec(cmd, (err, stdout, stderr) => {					        
		        				console.log("ejecuto commando");
						        if (err) {
						        	console.log(err);
						        }else{
						        	console.log("ejecuto bien el comando");
						        }
						    });

		        			next(null,{error:false,mensaje:"Generando reporte"});
						}
					}
				}
	 		);
 		} 		
	};

	Tarea.remoteMethod('reporte', {


		accepts: [

			{
				arg: 'descripcion',
				type: 'string',
				required: true
			},
			{
				arg: 'tipo',
				type: 'number',
				required: true
			},
			{
				arg: 'extension',
				type: 'string',
				required: true
			},
			{
				arg: 'ordenes',
				type: 'array',
				required: true
			},
   			{arg: "options", type: "object", 'http': "optionsFromRequest"}
		],
		returns: {
			arg: 'response',
			type: 'object',
			root: true
		},
		http: {
			verb: 'POST',
			path: '/reporte'
		}
	});
}