

var { exec } = require('child_process');
module.exports = (Orden) => {
	Orden.generarEtiqueta = (tet_id, ord_id, options, next) => {
		var ds = Orden.dataSource;
		var data = {};
		let valores = options && options.accessToken;
		let token = valores && valores.id;
 		let userId = valores && valores.userId;

 		Orden.findById(ord_id,{},
 			(err,data)=>{
				if(err){
					console.log(next);
					next(null, {error:true,mensaje:"Ocurrio un error!"});
				}
				else{
					if(!data){
						next(null, {error:true,mensaje:"Ocurrio un error!"});
					}else{	
						try{
	        				let cmd = "python3 "+Orden.app.get("python").etiqueta.generar+" "+ord_id+" "+tet_id;
	        				console.log(cmd);

		        			exec(cmd, (err, stdout, stderr) => {					        
		        				console.log("ejecuto commando");
						        if (err) {
						        	console.log(err);
									next(null, {error:true,mensaje:"Ocurrio un error!"});
						        }else{
									next(null, {error:false,mensaje:"Etiqueta generada."});
						        }
						    });
	        			}catch(err){
							console.log(err);
							next(null, {error:true,mensaje:"Ocurrio un error!"});
						}			        	
					}
				}
 			}
 		);

	};

	Orden.remoteMethod('generarEtiqueta', {


		accepts: [
			{
				arg: 'tet_id',
				type: 'number',
				required: true
			},
			{
				arg: 'ord_id',
				type: 'number',
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
			path: '/generarEtiqueta'
		}
	});
}