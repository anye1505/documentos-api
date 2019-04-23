module.exports = function(Tarea) {
  	require('./tarea/reporte')(Tarea);

  	Tarea.beforeRemote('find',  function(ctx, user, next) {
		let filter = ctx.args.filter;
		
		Tarea.app.models.user.findById(
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
								filter.where['usu_id']=data.id;
							}else{
								filter['where']={emp_id_courier:data.emp_id,usu_id:data.id};	
							}
						}else{
							filter={where:{emp_id_courier:data.emp_id,usu_id:data.id}};	
						}
						ctx.args.filter = filter;
						next();
					}
				}
		});
    });

    Tarea.beforeRemote('count',  function(ctx, user, next) {
		let where = ctx.args.where;

		Tarea.app.models.user.findById(
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
							where['usu_id']=data.id;							
						}else{
							where={emp_id_courier:data.emp_id,usu_id:data.id};
						}
						ctx.args.where = where;
						next();
					}
				}
		});
    });
};
