
module.exports = (Orden) => {
	Orden.enotriaWs = function( idServicioCourier, fechaCorte, codigoProducto, archivo, next) {
		var errorProc=false;
		Promise.resolve()
	    .then(function() {	    	
			return new Promise(function(resolve, reject) {
				var fechaReg = new RegExp("\\d{6}");
				var resFecha = fechaReg.test(fechaCorte);

				if(resFecha){
					try{
						//ano,mes,dia
						var anio = parseInt(fechaCorte.substring(4, 6));
						var mes = parseInt(fechaCorte.substring(2, 4));
						var dia = parseInt(fechaCorte.substring(0, 2));
						var dateCorte = new Date(anio, mes, dia);
						if( (anio < 17 || anio > 25) || (mes < 1 || mes > 12) || (dia < 1 || dia > 31 ) ){
							errorProc=true;
							next(null,{error:true, codigo:2, mensaje:'Fecha incorrecta.'});
						}
						/*
						console.log("anio -> "+anio);
						console.log("mes -> "+mes);
						console.log("dia -> "+dia);
						console.log(dateCorte);
						*/
					}
					catch(err){
						console.log(err);
						errorProc=true;
						next(null,{error:true, codigo:2, mensaje:'Fecha incorrecta.'});
					}

					if(errorProc===false){

						var codigoReg = new RegExp("/^[a-zA-Z0-9]{3}$/i");
						var codigoReg = /^([a-zA-Z0-9]{3})$/;
						var resCodigo = codigoReg.test(codigoProducto);

						if(resCodigo){
	    					var ds = Orden.dataSource;
						 	var sql = "select * from proceso.vista_producto where ope_id = 2 and prd_nombre = $1";
							ds.connector.execute(sql, [codigoProducto], function(err, data) {
								if (err){
									console.log(err);
									//next(null,{error:true,codigo:1,mensaje:'Ocurrio un error, vuelva a intentar en unos minutos.....'});  								
									reject("Error en el SQL");
								}else{
									if(data.length!=1){
										//next(null,{error:true,codigo:1,mensaje:'Ocurrio un error, vuelva a intentar en unos minutos.....'});  
										reject("Error: Se encontro mas de un valor");
									}else{
										if(data[0].conf_id < 1 ){
											reject("Error: No se encontro Id. de configuración");
										}else{
														//console.log(data[0].conf_id);
														//console.log(idServicioCourier);
											Orden.findOne(
												{	
													where:{			
														conf_id:data[0].conf_id,
														pro_orden_operador:idServicioCourier														
													}									
												},
												(err,orden)=>{
													if(err){
														reject("Error: Error al buscar orden");
													}else{
														console.log(orden);
														if(orden){
															next(null,{error:true,codigo:4,mensaje:'Servicio ya ordenado'}); 
														}else{
															Orden.create(
																{
																	conf_id:data[0].conf_id,
																	pro_orden_operador:idServicioCourier,
																	pro_nombre_archivo_in:archivo,
																	pro_corte:fechaCorte,
																	pro_estado:1
																},
																(err,orden)=>{
																	if(err){
																		reject("Error: Error al registrar orden");
																	}else{
																		if(!orden){
																			reject("Error: Error al registrar orden");
																		}else{											      	
																			next(null,{error:false,codigo:0,mensaje:'registro exitoso'});  	
																		}
																	}
																}
															);											      	 	
														}
													}
												}
											);
										}
									}
								}
							});  
						}else{
							next(null,{error:true, codigo:3, mensaje:'Código incorrecto.'});
						}
					}
				}else{
					next(null,{error:true, codigo:2, mensaje:'Fecha incorrecta.'});
				}
			});
	    })
		.catch(function(err){
			console.log(err);
			next(null,{error:true, codigo:1, mensaje:'Ocurrio un error, vuelva a intentar en unos minutos.....'});
		});


    };

    Orden.remoteMethod(
        'enotriaWs',
        {
         http: {
         	path: '/enotriaWs',
         	 verb: 'post'
         },
         accepts: [
            {
            	arg: 'idServicioCourier', 
            	type: 'string', 
            	required: true
            }, {
		      	arg: 'fechaCorte',
		      	type: 'string', 
            	required: true
		    }, {
		      	arg: 'codigoProducto',
		      	type: 'string', 
            	required: true
		    }, {
		      	arg: 'archivo',
		      	type: 'string', 
            	required: true
		    }
         ],
         returns: {         	
		      args: 'response',
		      type: 'object',
		      root: true
         }
        }
    );

}