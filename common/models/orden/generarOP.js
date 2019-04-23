

var { exec } = require('child_process');


module.exports = (Orden) => {
	Orden.generarOP = (ord_id,cliente,producto,operador,nroOp,fechaInicio,nroDias,ord_mensaje_cargo,tif_id,options,next) => {
		var ds = Orden.dataSource;
		var data = {};
		let valores = options && options.accessToken;
		let token = valores && valores.id;
 		let userId = valores && valores.userId;
 		Orden.app.models.user.findById(
			userId,{},
			(err,data)=>{
				if(err)next(err);
				else{
					if(!data){
						next("Error");
					}else{						
						let p_emp_id_courier = data.emp_id;//id de courier - empresa del usuario
						/*orden.findById(
							ord_id,{},
							(err,orden)=>{
								if(err)next(err);
								if(!orden){
									return next(null,{error:true,mensaje:"Orden no existe"});
								}else{
									if(orden.pro_estado<6){
										return next(null,{error:true,mensaje:"Orden no esta disponible para generar OP."});
									}else{
										if(orden.pro_estado>6){
											return next(null,{error:true,mensaje:"Orden ya ha generado una OP."});
										}else{		*/				
											//var sql = "select * from proceso.spu_orden_generar_servicio($1,$2,$3,$4,$5,$6,$7,$8,$9)";
											
										    //ds.connector.execute(sql, [ord_id,p_emp_id_courier,producto,nroOp,fechaInicio,nroDias,userId,data.suc_id,ord_mensaje_cargo], function(err, data) {
											//Inicio - Editado por Anyelys Escalona
											let params = [];
											var sql;
											if(tif_id==2){//if(operador!=2 && operador!=23){
												console.log("entre en tif=2");
												sql = "select * from proceso.spu_orden_generar_servicio($1,$2,$3,$4,$5,$6,$7,$8,$9)";
												console.log("sql=",sql);
												params = [ord_id,p_emp_id_courier,producto,nroOp,fechaInicio,nroDias,userId,data.suc_id,ord_mensaje_cargo];
											}else{
												console.log("entre en tif!=2");
												sql = "select * from proceso.spu_orden_generar_servicio_documentos($1,$2,$3,$4,$5,$6,$7)";
												console.log("sql=",sql);
												params = [ord_id,p_emp_id_courier,producto,fechaInicio,userId,data.suc_id,ord_mensaje_cargo];
											}
											ds.connector.execute(sql, params, function(err, data) {	//Fin - Editado por Anyelys Escalona
										        if (err)next(err);
										        else {
										        	try{

								        				let cmd = "python3 "+Orden.app.get('python').cargo.generar+" "+data[0]["id"];
								        				console.log(cmd);

									        			exec(cmd, (err, stdout, stderr) => {					        
									        				console.log("ejecuto commando");
													        if (err) {
													        	console.log(data[0]["id"]);
													        	console.log(err);
													          	Orden.upsertWithWhere(
													          		{ord_id:data[0]["id"]},
													          		{pro_estado_temp:"Error al generar cargos"},
													          		(err, datos)=>{
													          			console.log("ejecuto upsert111111");
													          			console.log(err);
													          		}
													          	);
													        }else{
													        	console.log("ejecuto bien el comando");
													        }
													    });
								        			}catch(err){
														console.log(err);
														Orden.upsertWithWhere(
											          		{ord_id:data[0]["id"]},
											          		{pro_estado_temp:"Error al generar cargos"},
											          		(err, datos)=>{
													          			console.log("ejecuto upsert2222");
													          			console.log(err);
											          		}
											          	);

								        			}

										        	next(null, data[0]);
										        }
										    });   
										/*}
									}
								}
							}
						);*/
					}
				}
			}
 		);
	};

	Orden.remoteMethod('generarOP', {


		accepts: [
			{
				arg: 'ord_id',
				type: 'number',
				required: true
			},
			{
				arg: 'cliente',
				type: 'number',
				required: true
			},
			{
				arg: 'producto',
				type: 'number',
				required: true
			},
			{
				arg: 'operador',
				type: 'number',
				required: true
			},
			{
				arg: 'nroOp',
				type: 'string'
			},
			{
				arg: 'fechaInicio',
				type: 'string',
				required: true
			},
			{
				arg: 'nroDias',
				type: 'number',
				required: true
			},
			{
				arg: 'ord_mensaje_cargo',
				type: 'string',
				required: false
			},
			{
				arg: 'tif_id',
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
			path: '/generarOP'
		}
	});
}