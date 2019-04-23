
var fs = require('fs-extra');
var uuid = require('uuid');
var path = require('path');

var Hooks = require('../../../helpers/hooks');
var Files = require('../../../helpers/files');
module.exports = (Orden) => {
	Orden.beforeRemote('upload', Hooks.beforeRemoteFormData);
	/*orden.csvexport = function(type, res, callback) {
	  //@todo: get your data from database etc...
	  var datetime = new Date();
	  res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
	  res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
	  res.set('Last-Modified', datetime +'GMT');
	  res.set('Content-Type','application/force-download');
	  res.set('Content-Type','application/octet-stream');
	  res.set('Content-Type','application/download');
	  res.set('Content-Disposition','attachment;filename=Data.csv');
	  res.set('Content-Transfer-Encoding','binary');
	  res.send('ok;'); //@todo: insert your CSV data here.
	};

	orden.remoteMethod('csvexport',
	{
	  accepts: [
	    {arg: 'type', type: 'string', required: true },
	    {arg: 'res', type: 'object', 'http': {source: 'res'}}
	  ],
	  returns: {},
	  http: {path: '/csvexport/:type', verb: 'get'}
	});
	*/

	




	Orden.upload = function( cliente, file, options, next) {

	    var ds = Orden.dataSource;
	    var data = {};
		let valores = options && options.accessToken;
		let token = valores && valores.id;
 		let userId = valores && valores.userId;

		Orden.app.models.configuracion.findOne(
			{where:{conf_id:1}},
			(err,configuracion)=>{
				if(err)next(err,null);
				if(!configuracion){
					next("Error: vuelva a intentarlo",null);
				}else{				
				console.log(configuracion);	
			        //var StorageContainer = orden.app.models.StorageContainer;
					Orden.create(
						{
							conf_id:1,
							pro_tipo:2,
							pro_estado:9999,
							usu_id:userId
						},
						(err,orden)=>{
							if(err)next(err,null);
							if(!orden){
								next("Error: vuelva a intentarlo",null);
							}else{								
						      	let filename = file.name;// uuid.v1() + file.name.substring(file.name.lastIndexOf('.'));
						      	let desFileName = orden.ord_id+"_"+filename;
						      	let destPath = path.join(configuracion.conf_local_carpeta_in, desFileName);

								fs.copyFile(file.path, destPath, (err) => {
									if (err) {
										orden.destroy();
										next(err,null);
									}else{
										orden.updateAttributes(
											{
												pro_nombre_archivo_in:desFileName,
												pro_estado:2
											},
											(err,ordenT)=>{
												if(err)next(err,null);
												if(!ordenT){
													next("Error: vuelva a intentarlo",null);
												}else{		
													next(null,{desFileName:desFileName});
												}
											}
										);
									}
								});
							}
						}
					);	
				}
			}
		);


        /*
    	Files.save(file, 'D:\\\\').then((relativePath) => {
    		consolelog(relativePath);                    
        }).catch(error=>{
        	next(error);
        });
        */

       /* StorageContainer.getContainers(function (err, containers) {
            if (containers.some(function(e) { return e.name == material_id; })) {
                StorageContainer.upload(req, res, {container: material_id}, cb);
            }
            else {
                StorageContainer.createContainer({name: material_id}, function(err, c) {
                    StorageContainer.upload(req, res, {container: c.name}, cb);
                });
            }
        });*/
    };

    Orden.remoteMethod(
        'upload',
        {
         http: {
         	path: '/upload',
         	 verb: 'post'
         },
         accepts: [
            {
            	arg: 'cliente', 
            	type: 'string', 
            	required: true
            }, {
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