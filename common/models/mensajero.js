module.exports = function(Mensajero) {	


    require('./mensajero/crear')(Mensajero);
    require('./mensajero/actualizar')(Mensajero);
	require('./mensajero/consultar-list')(Mensajero);
    require('./mensajero/foto')(Mensajero);


	Mensajero.beforeRemote('find',  function(ctx, user, next) {
		let filter = ctx.args.filter;

		Mensajero.app.models.user.findById(
			ctx.req.accessToken.userId,
			{},
			(error,data)=>{
				if(error){
					next(new Error('Usuario erroneo.'));
				}else{
					if(!data){
						next(new Error('Usuario erroneo.'));						
					}else{
						if(filter){
							if(filter.where){							
								filter.where['emp_id_courier']=data.emp_id;
							}else{
								filter['where']={emp_id_courier:data.emp_id};
							}
						}else{
							filter={where:{emp_id_courier:data.emp_id}};
						}
						ctx.args.filter = filter;
						next();
					}
				}
		});
    });

    Mensajero.beforeRemote('count',  function(ctx, user, next) {
		let where = ctx.args.where;
		Mensajero.app.models.user.findById(
			ctx.req.accessToken.userId,
			{},
			(error,data)=>{
				if(error){
					next(new Error('Usuario erroneo.'));
				}else{
					if(!data){
						next(new Error('Usuario erroneo.'));						
					}else{
						if(where){
							where['emp_id_courier']=data.emp_id;
							where['suc_id']=data.suc_id;
						}else{
							where={emp_id_courier:data.emp_id,suc_id:data.suc_id};
						}
						ctx.args.where = where;
						next();
					}
				}
		});
    });
};
