

var { exec } = require('child_process');
module.exports = (orden) => {
	orden.generarOPapido = (ord_id,fechaInicio,options,next) => {
		var ds = orden.dataSource;
		var data = {};
		let valores = options && options.accessToken;
		let token = valores && valores.id;
 		let userId = valores && valores.userId;
 		orden.app.models.user.findById(
			userId,{},
			(err,data)=>{
				if(err)next(err);
				else{
					if(!data){
						next("Error");
					}else{						
						let p_emp_id_courier = data.emp_id;//id de courier - empresa del usuario
						console.log("data:",data.emp_id);
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
											//if(tif_id==2){
												console.log("entre en tif==2");
												var sql = "select * from proceso.spu_orden_generar_servicio_rapido($1,$2,$3,$4,$5)";
												console.log("parametros=",ord_id,p_emp_id_courier,fechaInicio,userId,data.suc_id);
												ds.connector.execute(sql, [ord_id,p_emp_id_courier,fechaInicio,userId,data.suc_id], function(err, data) {
													console.log("err:",err);
													console.log("data:",data);
													if (err)next(err);
													else {
														try{

															let cmd = "python3 "+orden.app.get('python').cargo.generar+" "+data[0]["id"];
															console.log(cmd);

															exec(cmd, (err, stdout, stderr) => {					        
																console.log("ejecuto commando");
																if (err) {
																	console.log(data[0]["id"]);
																	console.log("error en ejecucion de python: ",err);
																	orden.upsertWithWhere(
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
															orden.upsertWithWhere(
																{ord_id:data[0]["id"]},
																{pro_estado_temp:"Error al generar cargos"},
																(err, datos)=>{
																			console.log("ejecuto upsert2222");
																			console.log(err);
																}
															);

														}
														console.log("data",data);
														next(null, data[0]);
													}
												});
											/*}else{
												console.log("entre en tif!=2");
												let data=[{error:true, mensaje:'Error al generar cargos'}]
												console.log("data",data);
												next(null, data[0]);
											}   */
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

	orden.remoteMethod('generarOPapido', {


		accepts: [
			{
				arg: 'ord_id',
				type: 'number',
				required: true
			},
			
			{
				arg: 'fechaInicio',
				type: 'string',
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
			path: '/generarOPapido'
		}
	});
}