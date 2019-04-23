
module.exports = (orden) => {

	orden.consumo = (valor, next) => {
		var ds = orden.dataSource;
		/*page = page || 1;
		limit = limit || 10;

		var skip = (page - 1) * limit;
		*/
		var data = {};

		var sql = "select * from proceso.spu_consumo_consultar($1)";
	    ds.connector.execute(sql, [valor], function(err, data) {
	        if (err){
	        	//ctx.res.status(400);
	        	/*
	        	var error = new Error("New password and confirmation do not match");
				error.status = 400;
				*/
				console.error(err);
				next(err);	        	
	        }
	        console.info(data);
	        next(null, data);
	    });   

		/*
		Service.count().then((count) => {
			Service.find({
				include: ['user', 'worker', 'category', 'district','serviceQuote'],
				order: 'created DESC',
				skip: skip,
				limit: limit
			}).then((services) => {
				data.count = count;
				data.totalPages = Math.ceil(data.count / limit);
				data.currentPage = page;

				data.services = services;
				next(null, data);
			}).catch(next);
		});
		*/
	};

	orden.remoteMethod('consumo', {
		accepts: [
			/*{
				arg: 'page',
				type: 'number',
				required: true
			},
			{
				arg: 'limit',
				type: 'number',
				required: true
			},*/
			{
				arg: 'valor',
				type: 'number',
				required: true
			}
		],
		returns: {
			arg: 'response',
			type: 'object',
			root: true
		},
		http: {
			verb: 'GET',
			path: '/consumo'
		}
	});
}