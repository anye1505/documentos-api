module.exports = (Gestion) => {
    /*Implementación*/
    Gestion.motivo = (options, next) => {
      var ds = Gestion.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from proceso.gestion where tig_id=4 or tig_id=5 order by tig_id asc, tig_nombre asc ;";
            ds.connector.execute(sql, function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Motivo.");   
      });
    };
    Gestion.motivoid = (ges_id,options, next) => {
      var ds = Gestion.dataSource;
      const valores = options && options.accessToken;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from proceso.gestion where ges_id=$1";
            ds.connector.execute(sql,[ges_id], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Motivo.");   
      });
    };
    Gestion.couriers = (emp_id,options, next) => {
      var ds = Gestion.dataSource;
      const valores = options && options.accessToken;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            //var sql = "select id_courier,nombre_courier from general.vista_operador_distribucion where emp_id=$1 order by nombre_courier";
            var sql = "select id_courier,nombre_courier from general.vista_operador where emp_id=$1 order by nombre_courier"
            ds.connector.execute(sql, [emp_id], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Couriers.");   
      });
    };

    Gestion.productos = (cli_id,options, next) => {
      var ds = Gestion.dataSource;
      const valores = options && options.accessToken;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            //var sql = "select id_courier,nombre_courier from general.vista_operador_distribucion where emp_id=$1 order by nombre_courier";
            var sql = "select prd_id,prd_nombre_docs from proceso.vista_producto where cli_id=$1 order by prd_nombre_docs;"
            ds.connector.execute(sql, [cli_id], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Couriers.");   
      });
    };

    Gestion.getordenes = (desde, hasta, ope, cli, pro, tiposProd, corte, tipo, ordenes, suc_id, options, next) => {
      var ds = Gestion.dataSource;
      const valores = options && options.accessToken;
      const usu_id = valores && valores.userId;
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from gestion.spu_ordenes_consultar_os_sucursal($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)";
            var data = [];
            data = [desde,hasta,ope,cli,pro,tiposProd,usu_id,corte,tipo,ordenes,suc_id];
            ds.connector.execute(sql, data, function(err, data) {
                if (err){ reject(err); }
                else{console.log("Cantidad:",data.length);//15/03/2019
                  let dataid = [];
                  if(data.length > 0){
                  
                  let idscli = [];
                  let idspro = [];
                  let idscor = [];
                  let lima_per_d1 = 0;
                  let lima_per_a1 = 0;
                  let lima_per_e1 = 0;
                  let lima_per_r1 = 0;
                  let lima_per_i1 = 0;

                  let prov_per_d1 = 0;
                  let prov_per_a1 = 0;
                  let prov_per_e1 = 0;
                  let prov_per_r1 = 0;
                  let prov_per_i1 = 0;let cont=0;let cont2=0;let cont3=0;
                  //lima
                  if(data[0].lima_nro_docs > 0){
                    lima_per_d1 = data[0].lima_nro_distribucion/data[0].lima_nro_docs;
                    lima_per_a1 = data[0].lima_nro_alistamiento/data[0].lima_nro_docs;
                    lima_per_e1 = data[0].lima_nro_entregas/data[0].lima_nro_docs;
                    if(lima_per_e1 > 0){
                      lima_per_r1 = data[0].lima_nro_rezagos/lima_per_e1;
                    }else{
                      lima_per_r1 = 0;
                    }
                  }else{
                    lima_per_d1 = 0;
                    lima_per_a1 = 0;
                    lima_per_e1 = 0;
                  }

                  if((data[0].lima_nro_docs - data[0].lima_nro_entregas - data[0].lima_nro_rezagos) > 0){
                    lima_per_i1 = data[0].lima_nro_imgs/data[0].lima_nro_docs - data[0].lima_nro_entregas - data[0].lima_nro_rezagos;
                  }else{
                    lima_per_i1 = 0;
                  }

                  //Prov 
                  if(data[0].prov_nro_docs > 0){
                    prov_per_d1 = data[0].prov_nro_distribucion/data[0].prov_nro_docs;
                    prov_per_a1 = data[0].prov_nro_alistamiento/data[0].prov_nro_docs;
                    prov_per_e1 = data[0].prov_nro_entregas/data[0].prov_nro_docs;
                    if(prov_per_e1 > 0){
                      prov_per_r1 = data[0].prov_nro_rezagos/prov_per_e1;
                    }else{
                      prov_per_r1 = 0;
                    }
                  }else{
                    prov_per_d1 = 0;
                    prov_per_a1 = 0;
                    prov_per_e1 = 0;
                  }

                  if((data[0].prov_nro_docs - data[0].prov_nro_entregas - data[0].prov_nro_rezagos) > 0){
                    prov_per_i1 = data[0].prov_nro_imgs/data[0].prov_nro_docs - data[0].prov_nro_entregas - data[0].prov_nro_rezagos;
                  }else{
                    prov_per_i1 = 0;
                  }

                  dataid.push(
                    {
                      id_cliente: data[0].id_cliente,
                      cliente: data[0].cliente,
                      producto: data[0].producto,
                      corte: data[0].corte,
                      fecha_inicio: data[0].fecha_inicio,
                      fecha_fin: data[0].fecha_fin,
                      nro_docs: data[0].nro_docs,

                      total_dis: data[0].prov_nro_distribucion + data[0].lima_nro_distribucion,
                      total_per_d: ( (data[0].prov_nro_distribucion + data[0].lima_nro_distribucion)/data[0].nro_docs ).toFixed(2),
                      total_ali: data[0].prov_nro_alistamiento + data[0].lima_nro_alistamiento,
                      total_per_a: ( (data[0].prov_nro_alistamiento + data[0].lima_nro_alistamiento)/data[0].nro_docs ).toFixed(2),
                      total_ent: data[0].prov_nro_entregas + data[0].lima_nro_entregas,
                      total_per_e: ( (data[0].prov_nro_entregas + data[0].lima_nro_entregas)/data[0].nro_docs ).toFixed(2),
                      total_rez: data[0].prov_nro_rezagos + data[0].lima_nro_rezagos,
                      total_per_r: ( (data[0].prov_nro_rezagos + data[0].lima_nro_rezagos)/data[0].nro_docs ).toFixed(2),                                  
                      total_img: data[0].prov_nro_imgs + data[0].lima_nro_imgs,
                      total_per_i: ( (data[0].prov_nro_imgs + data[0].lima_nro_imgs)/data[0].nro_docs ).toFixed(2),
                      //total_o: (data[0].lima_nro_docs - data[0].lima_nro_entregas - data[0].lima_nro_rezagos) +  (data[0].prov_nro_docs - data[0].prov_nro_entregas - data[0].prov_nro_rezagos),
                      total_o: (data[0].lima_nro_docs - data[0].lima_nro_alistamiento - data[0].lima_nro_distribucion - data[0].lima_nro_entregas - data[0].lima_nro_rezagos) +  (data[0].prov_nro_docs - data[0].prov_nro_alistamiento - data[0].prov_nro_distribucion - data[0].prov_nro_entregas - data[0].prov_nro_rezagos),

                      lima_nro_docs: data[0].lima_nro_docs,
                      lima_nro_distribucion: data[0].lima_nro_distribucion,
                      lima_per_d: lima_per_d1.toFixed(2),
                      lima_nro_alistamiento: data[0].lima_nro_alistamiento,
                      lima_per_a: lima_per_a1.toFixed(2),
                      lima_nro_entregas: data[0].lima_nro_entregas,
                      lima_per_e: lima_per_e1.toFixed(2),
                      lima_nro_rezagos: data[0].lima_nro_rezagos,
                      lima_per_r: lima_per_r1.toFixed(2),
                      lima_o: data[0].lima_nro_docs - data[0].lima_nro_entregas - data[0].lima_nro_rezagos,
                      lima_nro_imgs: data[0].lima_nro_imgs,
                      lima_per_i: lima_per_i1.toFixed(2),

                      prov_nro_docs: data[0].prov_nro_docs,
                      prov_nro_distribucion: data[0].prov_nro_distribucion,
                      prov_per_d: prov_per_d1.toFixed(2),
                      prov_nro_alistamiento: data[0].prov_nro_alistamiento,
                      prov_per_a: prov_per_a1.toFixed(2),
                      prov_nro_entregas: data[0].prov_nro_entregas,
                      prov_per_e: prov_per_e1.toFixed(2),
                      prov_nro_rezagos: data[0].prov_nro_rezagos,
                      prov_per_r: prov_per_r1.toFixed(2),
                      prov_nro_imgs: data[0].prov_nro_imgs,
                      prov_per_i: prov_per_i1.toFixed(2),
                      prov_o: data[0].prov_nro_docs - data[0].prov_nro_entregas - data[0].prov_nro_rezagos,
                      
                      detalle:[
                          {
                              ord_id: data[0].ord_id,
                              orden: data[0].orden,
                              estado: data[0].estado,
                              nro_docs: data[0].nro_docs,

                              total_dis: data[0].prov_nro_distribucion + data[0].lima_nro_distribucion,
                              total_per_d: ( (data[0].prov_nro_distribucion + data[0].lima_nro_distribucion)/data[0].nro_docs ).toFixed(2),
                              total_ali: data[0].prov_nro_alistamiento + data[0].lima_nro_alistamiento,
                              total_per_a: ( (data[0].prov_nro_alistamiento + data[0].lima_nro_alistamiento)/data[0].nro_docs ).toFixed(2),
                              total_ent: data[0].prov_nro_entregas + data[0].lima_nro_entregas,
                              total_per_e: ( (data[0].prov_nro_entregas + data[0].lima_nro_entregas)/data[0].nro_docs ).toFixed(2),
                              total_rez: data[0].prov_nro_rezagos + data[0].lima_nro_rezagos,
                              total_per_r: ( (data[0].prov_nro_rezagos + data[0].lima_nro_rezagos)/data[0].nro_docs ).toFixed(2),                                  
                              total_img: data[0].prov_nro_imgs + data[0].lima_nro_imgs,
                              total_per_i: ( (data[0].prov_nro_imgs + data[0].lima_nro_imgs)/data[0].nro_docs ).toFixed(2),
                              //total_o: (data[0].lima_nro_docs - data[0].lima_nro_entregas - data[0].lima_nro_rezagos) +  (data[0].prov_nro_docs - data[0].prov_nro_entregas - data[0].prov_nro_rezagos),
                              total_o: (data[0].lima_nro_docs - data[0].lima_nro_alistamiento - data[0].lima_nro_distribucion - data[0].lima_nro_entregas - data[0].lima_nro_rezagos) +  (data[0].prov_nro_docs - data[0].prov_nro_alistamiento - data[0].prov_nro_distribucion - data[0].prov_nro_entregas - data[0].prov_nro_rezagos),

                              lima_nro_docs: data[0].lima_nro_docs,
                              lima_nro_distribucion: data[0].lima_nro_distribucion,
                              lima_nro_alistamiento: data[0].lima_nro_alistamiento,
                              lima_nro_entregas: data[0].lima_nro_entregas,
                              lima_nro_rezagos: data[0].lima_nro_rezagos,
                              lima_nro_imgs: data[0].lima_nro_imgs,
                              lima_o: data[0].lima_nro_docs - data[0].lima_nro_entregas - data[0].lima_nro_rezagos - data[0].lima_nro_distribucion - data[0].lima_nro_alistamiento,
                              lima_per_d: lima_per_d1.toFixed(2),
                              lima_per_a: lima_per_a1.toFixed(2),
                              lima_per_e: lima_per_e1.toFixed(2),
                              lima_per_r: lima_per_r1.toFixed(2),
                              lima_per_i: lima_per_i1.toFixed(2),

                              prov_nro_docs: data[0].prov_nro_docs,
                              prov_nro_distribucion: data[0].prov_nro_distribucion,
                              prov_nro_alistamiento: data[0].prov_nro_alistamiento,
                              prov_nro_entregas: data[0].prov_nro_entregas,
                              prov_nro_rezagos: data[0].prov_nro_rezagos,
                              prov_nro_imgs: data[0].prov_nro_imgs,
                              prov_o: data[0].prov_nro_docs - data[0].prov_nro_entregas - data[0].prov_nro_rezagos - data[0].prov_nro_distribucion - data[0].prov_nro_alistamiento,
                              prov_per_d: prov_per_d1.toFixed(2),
                              prov_per_a: prov_per_a1.toFixed(2),
                              prov_per_e: prov_per_e1.toFixed(2),
                              prov_per_r: prov_per_r1.toFixed(2),
                              prov_per_i: prov_per_i1.toFixed(2)
                            }
                      ]
                  }
                  )
                  let h; let added;
                  for(let i = 1; i < data.length; i++){
                    h = 0;
                    added = false;
                    while(dataid[h].id_cliente != data[i].id_cliente || dataid[h].producto != data[i].producto || dataid[h].corte != data[i].corte){
                      //console.log("length:",dataid.length-1,"h:",h);
                      if(dataid.length-1 === h){
                      added = true;
                      //lima
                      if(data[i].lima_nro_docs > 0){
                        lima_per_d1 = data[i].lima_nro_distribucion/data[i].lima_nro_docs;
                        lima_per_a1 = data[i].lima_nro_alistamiento/data[i].lima_nro_docs;
                        lima_per_e1 = data[i].lima_nro_entregas/data[i].lima_nro_docs;
                        if(lima_per_e1 > 0){
                          lima_per_r1 = data[i].lima_nro_rezagos/lima_per_e1;
                        }else{
                          lima_per_r1 = 0;
                        }
                      }else{
                        lima_per_d1 = 0;
                        lima_per_a1 = 0;
                        lima_per_e1 = 0;
                      }

                      if((data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) > 0){
                        lima_per_i1 = data[i].lima_nro_imgs/data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos;
                      }else{
                        lima_per_i1 = 0;
                      }

                      //Prov 
                      if(data[i].prov_nro_docs > 0){
                        prov_per_d1 = data[i].prov_nro_distribucion/data[i].prov_nro_docs;
                        prov_per_a1 = data[i].prov_nro_alistamiento/data[i].prov_nro_docs;
                        prov_per_e1 = data[i].prov_nro_entregas/data[i].prov_nro_docs;
                        if(prov_per_e1 > 0){
                          prov_per_r1 = data[i].prov_nro_rezagos/prov_per_e1;
                        }else{
                          prov_per_r1 = 0;
                        }
                      }else{
                        prov_per_d1 = 0;
                        prov_per_a1 = 0;
                        prov_per_e1 = 0;
                      }

                      if((data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos) > 0){
                        prov_per_i1 = data[i].prov_nro_imgs/data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos;
                      }else{
                        prov_per_i1 = 0;
                      }

                      dataid.push(
                        {
                          id_cliente: data[i].id_cliente,
                          cliente: data[i].cliente,
                          producto: data[i].producto,
                          corte: data[i].corte,
                          fecha_inicio: data[i].fecha_inicio,
                          fecha_fin: data[i].fecha_fin,
                          nro_docs: data[i].nro_docs,

                          total_dis: data[i].prov_nro_distribucion + data[i].lima_nro_distribucion,
                          total_per_d: ( (data[i].prov_nro_distribucion + data[i].lima_nro_distribucion)/data[i].nro_docs ).toFixed(2),
                          total_ali: data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento,
                          total_per_a: ( (data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento)/data[i].nro_docs ).toFixed(2),
                          total_ent: data[i].prov_nro_entregas + data[i].lima_nro_entregas,
                          total_per_e: ( (data[i].prov_nro_entregas + data[i].lima_nro_entregas)/data[i].nro_docs ).toFixed(2),
                          total_rez: data[i].prov_nro_rezagos + data[i].lima_nro_rezagos,
                          total_per_r: ( (data[i].prov_nro_rezagos + data[i].lima_nro_rezagos)/data[i].nro_docs ).toFixed(2),                                  
                          total_img: data[i].prov_nro_imgs + data[i].lima_nro_imgs,
                          total_per_i: ( (data[i].prov_nro_imgs + data[i].lima_nro_imgs)/data[i].nro_docs ).toFixed(2),
                          //total_o: (data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),
                          total_o: (data[i].lima_nro_docs - data[i].lima_nro_alistamiento - data[i].lima_nro_distribucion - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_alistamiento - data[i].prov_nro_distribucion - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),

                          lima_nro_docs: data[i].lima_nro_docs,
                          lima_nro_distribucion: data[i].lima_nro_distribucion,
                          lima_per_d: lima_per_d1.toFixed(2),
                          lima_nro_alistamiento: data[i].lima_nro_alistamiento,
                          lima_per_a: lima_per_a1.toFixed(2),
                          lima_nro_entregas: data[i].lima_nro_entregas,
                          lima_per_e: lima_per_e1.toFixed(2),
                          lima_nro_rezagos: data[i].lima_nro_rezagos,
                          lima_per_r: lima_per_r1.toFixed(2),
                          lima_o: data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos,
                          lima_nro_imgs: data[i].lima_nro_imgs,
                          lima_per_i: lima_per_i1.toFixed(2),

                          prov_nro_docs: data[i].prov_nro_docs,
                          prov_nro_distribucion: data[i].prov_nro_distribucion,
                          prov_per_d: prov_per_d1.toFixed(2),
                          prov_nro_alistamiento: data[i].prov_nro_alistamiento,
                          prov_per_a: prov_per_a1.toFixed(2),
                          prov_nro_entregas: data[i].prov_nro_entregas,
                          prov_per_e: prov_per_e1.toFixed(2),
                          prov_nro_rezagos: data[i].prov_nro_rezagos,
                          prov_per_r: prov_per_r1.toFixed(2),
                          prov_nro_imgs: data[i].prov_nro_imgs,
                          prov_per_i: prov_per_i1.toFixed(2),
                          prov_o: data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos,
                          
                          detalle:[
                              {
                                  ord_id: data[i].ord_id,
                                  orden: data[i].orden,
                                  estado: data[i].estado,
                                  nro_docs: data[i].nro_docs,

                                  total_dis: data[i].prov_nro_distribucion + data[i].lima_nro_distribucion,
                                  total_per_d: ( (data[i].prov_nro_distribucion + data[i].lima_nro_distribucion)/data[i].nro_docs ).toFixed(2),
                                  total_ali: data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento,
                                  total_per_a: ( (data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento)/data[i].nro_docs ).toFixed(2),
                                  total_ent: data[i].prov_nro_entregas + data[i].lima_nro_entregas,
                                  total_per_e: ( (data[i].prov_nro_entregas + data[i].lima_nro_entregas)/data[i].nro_docs ).toFixed(2),
                                  total_rez: data[i].prov_nro_rezagos + data[i].lima_nro_rezagos,
                                  total_per_r: ( (data[i].prov_nro_rezagos + data[i].lima_nro_rezagos)/data[i].nro_docs ).toFixed(2),                                  
                                  total_img: data[i].prov_nro_imgs + data[i].lima_nro_imgs,
                                  total_per_i: ( (data[i].prov_nro_imgs + data[i].lima_nro_imgs)/data[i].nro_docs ).toFixed(2),
                                  //total_o: (data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),
                                  total_o: (data[i].lima_nro_docs - data[i].lima_nro_alistamiento - data[i].lima_nro_distribucion - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_alistamiento - data[i].prov_nro_distribucion - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),

                                  lima_nro_docs: data[i].lima_nro_docs,
                                  lima_nro_distribucion: data[i].lima_nro_distribucion,
                                  lima_nro_alistamiento: data[i].lima_nro_alistamiento,
                                  lima_nro_entregas: data[i].lima_nro_entregas,
                                  lima_nro_rezagos: data[i].lima_nro_rezagos,
                                  lima_nro_imgs: data[i].lima_nro_imgs,
                                  lima_o: data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos - data[i].lima_nro_distribucion - data[i].lima_nro_alistamiento,
                                  lima_per_d: lima_per_d1.toFixed(2),
                                  lima_per_a: lima_per_a1.toFixed(2),
                                  lima_per_e: lima_per_e1.toFixed(2),
                                  lima_per_r: lima_per_r1.toFixed(2),
                                  lima_per_i: lima_per_i1.toFixed(2),

                                  prov_nro_docs: data[i].prov_nro_docs,
                                  prov_nro_distribucion: data[i].prov_nro_distribucion,
                                  prov_nro_alistamiento: data[i].prov_nro_alistamiento,
                                  prov_nro_entregas: data[i].prov_nro_entregas,
                                  prov_nro_rezagos: data[i].prov_nro_rezagos,
                                  prov_nro_imgs: data[i].prov_nro_imgs,
                                  prov_o: data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos - data[i].prov_nro_distribucion - data[i].prov_nro_alistamiento,
                                  prov_per_d: prov_per_d1.toFixed(2),
                                  prov_per_a: prov_per_a1.toFixed(2),
                                  prov_per_e: prov_per_e1.toFixed(2),
                                  prov_per_r: prov_per_r1.toFixed(2),
                                  prov_per_i: prov_per_i1.toFixed(2)
                                }
                          ]
                      }
                      )
                      break;
                      }
                      h++;
                      
                    }
                  //}
                  cont++;
                  //for(let i = 0; i < data.length; i++){
                      /*if(idscli[h] != data[i].id_cliente && idspro[h] != data[i].producto && idscor[h] != data[0].corte){cont++;

                          
                          // Lima
                          if(data[i].lima_nro_docs > 0){
                            lima_per_d1 = data[i].lima_nro_distribucion/data[i].lima_nro_docs;
                            lima_per_a1 = data[i].lima_nro_alistamiento/data[i].lima_nro_docs;
                            lima_per_e1 = data[i].lima_nro_entregas/data[i].lima_nro_docs;
                            if(lima_per_e1 > 0){
                              lima_per_r1 = data[i].lima_nro_rezagos/lima_per_e1;
                            }else{
                              lima_per_r1 = 0;
                            }
                          }else{
                            lima_per_d1 = 0;
                            lima_per_a1 = 0;
                            lima_per_e1 = 0;
                          }

                          if((data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) > 0){
                            lima_per_i1 = data[i].lima_nro_imgs/data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos;
                          }else{
                            lima_per_i1 = 0;
                          }

                          //Prov 
                          if(data[i].prov_nro_docs > 0){
                            prov_per_d1 = data[i].prov_nro_distribucion/data[i].prov_nro_docs;
                            prov_per_a1 = data[i].prov_nro_alistamiento/data[i].prov_nro_docs;
                            prov_per_e1 = data[i].prov_nro_entregas/data[i].prov_nro_docs;
                            if(prov_per_e1 > 0){
                              prov_per_r1 = data[i].prov_nro_rezagos/prov_per_e1;
                            }else{
                              prov_per_r1 = 0;
                            }
                          }else{
                            prov_per_d1 = 0;
                            prov_per_a1 = 0;
                            prov_per_e1 = 0;
                          }

                          if((data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos) > 0){
                            prov_per_i1 = data[i].prov_nro_imgs/data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos;
                          }else{
                            prov_per_i1 = 0;
                          }
                          dataid.push(
                              {
                                  id_cliente: data[i].id_cliente,
                                  cliente: data[i].cliente,
                                  producto: data[i].producto,
                                  corte: data[i].corte,
                                  fecha_inicio: data[i].fecha_inicio,
                                  fecha_fin: data[i].fecha_fin,
                                  nro_docs: data[i].nro_docs,

                                  total_dis: data[i].prov_nro_distribucion + data[i].lima_nro_distribucion,
                                  total_per_d: ( (data[i].prov_nro_distribucion + data[i].lima_nro_distribucion)/data[i].nro_docs ).toFixed(2),
                                  total_ali: data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento,
                                  total_per_a: ( (data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento)/data[i].nro_docs ).toFixed(2),
                                  total_ent: data[i].prov_nro_entregas + data[i].lima_nro_entregas,
                                  total_per_e: ( (data[i].prov_nro_entregas + data[i].lima_nro_entregas)/data[i].nro_docs ).toFixed(2),
                                  total_rez: data[i].prov_nro_rezagos + data[i].lima_nro_rezagos,
                                  total_per_r: ( (data[i].prov_nro_rezagos + data[i].lima_nro_rezagos)/data[i].nro_docs ).toFixed(2),                                  
                                  total_img: data[i].prov_nro_imgs + data[i].lima_nro_imgs,
                                  total_per_i: ( (data[i].prov_nro_imgs + data[i].lima_nro_imgs)/data[i].nro_docs ).toFixed(2),
                                  //total_o: (data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),
                                  total_o: (data[i].lima_nro_docs - data[i].lima_nro_alistamiento - data[i].lima_nro_distribucion - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_alistamiento - data[i].prov_nro_distribucion - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),

                                  lima_nro_docs: data[i].lima_nro_docs,
                                  lima_nro_distribucion: data[i].lima_nro_distribucion,
                                  lima_per_d: lima_per_d1.toFixed(2),
                                  lima_nro_alistamiento: data[i].lima_nro_alistamiento,
                                  lima_per_a: lima_per_a1.toFixed(2),
                                  lima_nro_entregas: data[i].lima_nro_entregas,
                                  lima_per_e: lima_per_e1.toFixed(2),
                                  lima_nro_rezagos: data[i].lima_nro_rezagos,
                                  lima_per_r: lima_per_r1.toFixed(2),
                                  lima_o: data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos,
                                  lima_nro_imgs: data[i].lima_nro_imgs,
                                  lima_per_i: lima_per_i1.toFixed(2),

                                  prov_nro_docs: data[i].prov_nro_docs,
                                  prov_nro_distribucion: data[i].prov_nro_distribucion,
                                  prov_per_d: prov_per_d1.toFixed(2),
                                  prov_nro_alistamiento: data[i].prov_nro_alistamiento,
                                  prov_per_a: prov_per_a1.toFixed(2),
                                  prov_nro_entregas: data[i].prov_nro_entregas,
                                  prov_per_e: prov_per_e1.toFixed(2),
                                  prov_nro_rezagos: data[i].prov_nro_rezagos,
                                  prov_per_r: prov_per_r1.toFixed(2),
                                  prov_nro_imgs: data[i].prov_nro_imgs,
                                  prov_per_i: prov_per_i1.toFixed(2),
                                  prov_o: data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos,
                                  
                                  detalle:[
                                      {
                                          ord_id: data[i].ord_id,
                                          orden: data[i].orden,
                                          estado: data[i].estado,
                                          nro_docs: data[i].nro_docs,

                                          total_dis: data[i].prov_nro_distribucion + data[i].lima_nro_distribucion,
                                          total_per_d: ( (data[i].prov_nro_distribucion + data[i].lima_nro_distribucion)/data[i].nro_docs ).toFixed(2),
                                          total_ali: data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento,
                                          total_per_a: ( (data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento)/data[i].nro_docs ).toFixed(2),
                                          total_ent: data[i].prov_nro_entregas + data[i].lima_nro_entregas,
                                          total_per_e: ( (data[i].prov_nro_entregas + data[i].lima_nro_entregas)/data[i].nro_docs ).toFixed(2),
                                          total_rez: data[i].prov_nro_rezagos + data[i].lima_nro_rezagos,
                                          total_per_r: ( (data[i].prov_nro_rezagos + data[i].lima_nro_rezagos)/data[i].nro_docs ).toFixed(2),                                  
                                          total_img: data[i].prov_nro_imgs + data[i].lima_nro_imgs,
                                          total_per_i: ( (data[i].prov_nro_imgs + data[i].lima_nro_imgs)/data[i].nro_docs ).toFixed(2),
                                          //total_o: (data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),
                                          total_o: (data[i].lima_nro_docs - data[i].lima_nro_alistamiento - data[i].lima_nro_distribucion - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_alistamiento - data[i].prov_nro_distribucion - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),

                                          lima_nro_docs: data[i].lima_nro_docs,
                                          lima_nro_distribucion: data[i].lima_nro_distribucion,
                                          lima_nro_alistamiento: data[i].lima_nro_alistamiento,
                                          lima_nro_entregas: data[i].lima_nro_entregas,
                                          lima_nro_rezagos: data[i].lima_nro_rezagos,
                                          lima_nro_imgs: data[i].lima_nro_imgs,
                                          lima_o: data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos - data[i].lima_nro_distribucion - data[i].lima_nro_alistamiento,
                                          lima_per_d: lima_per_d1.toFixed(2),
                                          lima_per_a: lima_per_a1.toFixed(2),
                                          lima_per_e: lima_per_e1.toFixed(2),
                                          lima_per_r: lima_per_r1.toFixed(2),
                                          lima_per_i: lima_per_i1.toFixed(2),

                                          prov_nro_docs: data[i].prov_nro_docs,
                                          prov_nro_distribucion: data[i].prov_nro_distribucion,
                                          prov_nro_alistamiento: data[i].prov_nro_alistamiento,
                                          prov_nro_entregas: data[i].prov_nro_entregas,
                                          prov_nro_rezagos: data[i].prov_nro_rezagos,
                                          prov_nro_imgs: data[i].prov_nro_imgs,
                                          prov_o: data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos - data[i].prov_nro_distribucion - data[i].prov_nro_alistamiento,
                                          prov_per_d: prov_per_d1.toFixed(2),
                                          prov_per_a: prov_per_a1.toFixed(2),
                                          prov_per_e: prov_per_e1.toFixed(2),
                                          prov_per_r: prov_per_r1.toFixed(2),
                                          prov_per_i: prov_per_i1.toFixed(2)
                                        }
                                  ]
                              }
                          )
                          
                      }else{*///console.log("daid:",dataid.length,dataid);
                        if(!added){
                          for(let j = 0; j < dataid.length; j++){
                              if(data[i].id_cliente === dataid[j].id_cliente && data[i].producto === dataid[j].producto && data[i].corte === dataid[j].corte){cont2++;//15/03/2019
                                  let lima_per_d = 0;
                                  let lima_per_a = 0;
                                  let lima_per_e = 0;
                                  let lima_per_r = 0;
                                  let lima_per_i = 0;
                                  let prov_per_d = 0;
                                  let prov_per_a = 0;
                                  let prov_per_e = 0;
                                  let prov_per_r = 0;
                                  let prov_per_i = 0;
                                  // Lima
                                  if(data[i].lima_nro_docs > 0){
                                    lima_per_d = data[i].lima_nro_distribucion/data[i].lima_nro_docs;
                                    lima_per_a = data[i].lima_nro_alistamiento/data[i].lima_nro_docs;
                                    lima_per_e = data[i].lima_nro_entregas/data[i].lima_nro_docs;
                                    if(lima_per_e > 0){
                                      lima_per_r = data[i].lima_nro_rezagos/lima_per_e;
                                    }else{
                                      lima_per_r = 0;
                                    }
                                  }else{
                                    lima_per_d = 0;
                                    lima_per_a = 0;
                                    lima_per_e = 0;
                                  }

                                  if((data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) > 0){
                                    lima_per_i = data[i].lima_nro_imgs/data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos;
                                  }else{
                                    lima_per_i = 0;
                                  }

                                  //Prov 
                                  if(data[i].prov_nro_docs > 0){
                                    prov_per_d = data[i].prov_nro_distribucion/data[i].prov_nro_docs;
                                    prov_per_a = data[i].prov_nro_alistamiento/data[i].prov_nro_docs;
                                    prov_per_e = data[i].prov_nro_entregas/data[i].prov_nro_docs;
                                    if(prov_per_e > 0){
                                      prov_per_r = data[i].prov_nro_rezagos/prov_per_e;
                                    }else{
                                      prov_per_r = 0;
                                    }
                                  }else{
                                    prov_per_d = 0;
                                    prov_per_a = 0;
                                    prov_per_e = 0;
                                  }

                                  if((data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos) > 0){
                                    prov_per_i = data[i].prov_nro_imgs/data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos;
                                  }else{
                                    prov_per_i = 0;
                                  }    

                                  let dataid_lima_per_d = dataid[j].lima_per_d + lima_per_d;
                                  let dataid_lima_per_a = dataid[j].lima_per_a + lima_per_a;
                                  let dataid_lima_per_e = dataid[j].lima_per_e + lima_per_e;
                                  let dataid_lima_per_r = dataid[j].lima_per_r + lima_per_r;
                                  let dataid_lima_per_i = dataid[j].lima_per_i + lima_per_i;

                                  dataid_lima_per_d = Math.round(parseFloat(dataid_lima_per_d) * 100) / 100;
                                  dataid_lima_per_a = Math.round(parseFloat(dataid_lima_per_a) * 100) / 100;
                                  dataid_lima_per_e = Math.round(parseFloat(dataid_lima_per_e) * 100) / 100;
                                  dataid_lima_per_r = Math.round(parseFloat(dataid_lima_per_r) * 100) / 100;
                                  dataid_lima_per_i = Math.round(parseFloat(dataid_lima_per_i) * 100) / 100;

                                  let dataid_prov_per_d = dataid[j].prov_per_d + prov_per_d;
                                  let dataid_prov_per_a = dataid[j].prov_per_a + prov_per_a;
                                  let dataid_prov_per_e = dataid[j].prov_per_e + prov_per_e;
                                  let dataid_prov_per_r = dataid[j].prov_per_r + prov_per_r;
                                  let dataid_prov_per_i = dataid[j].prov_per_i + prov_per_i;

                                  dataid_prov_per_d = Math.round(parseFloat(dataid_prov_per_d) * 100) / 100;
                                  dataid_prov_per_a = Math.round(parseFloat(dataid_prov_per_a) * 100) / 100;
                                  dataid_prov_per_e = Math.round(parseFloat(dataid_prov_per_e) * 100) / 100;
                                  dataid_prov_per_r = Math.round(parseFloat(dataid_prov_per_r) * 100) / 100;
                                  dataid_prov_per_i = Math.round(parseFloat(dataid_prov_per_i) * 100) / 100;

                                  let dataid_total_per_d = dataid[j].total_per_d + (dataid[j].prov_nro_distribucion + dataid[j].lima_nro_distribucion)/dataid[j].nro_docs;
                                  let dataid_total_per_a = dataid[j].total_per_a + (dataid[j].prov_nro_alistamiento + dataid[j].lima_nro_alistamiento)/dataid[j].nro_docs;
                                  let dataid_total_per_e = dataid[j].total_per_e + (dataid[j].prov_nro_entregas + dataid[j].lima_nro_entregas)/dataid[j].nro_docs;
                                  let dataid_total_per_r = dataid[j].total_per_r + (dataid[j].prov_nro_rezagos + dataid[j].lima_nro_rezagos)/dataid[j].nro_docs;
                                  let dataid_total_per_i = dataid[j].total_per_i + (dataid[j].prov_nro_imgs + dataid[j].lima_nro_imgs)/dataid[j].nro_docs;

                                  dataid_total_per_d = Math.round(parseFloat(dataid_total_per_d) * 100) / 100;
                                  dataid_total_per_a = Math.round(parseFloat(dataid_total_per_a) * 100) / 100;
                                  dataid_total_per_e = Math.round(parseFloat(dataid_total_per_e) * 100) / 100;
                                  dataid_total_per_r = Math.round(parseFloat(dataid_total_per_r) * 100) / 100;
                                  dataid_total_per_i = Math.round(parseFloat(dataid_total_per_i) * 100) / 100;

                                  dataid[j].nro_docs =  dataid[j].nro_docs + data[i].nro_docs;

                                  dataid[j].lima_nro_docs =  dataid[j].lima_nro_docs + data[i].lima_nro_docs;
                                  dataid[j].lima_nro_distribucion =  dataid[j].lima_nro_distribucion + data[i].lima_nro_distribucion;
                                  dataid[j].lima_nro_alistamiento =  dataid[j].lima_nro_alistamiento + data[i].lima_nro_alistamiento;
                                  dataid[j].lima_nro_entregas =  dataid[j].lima_nro_entregas + data[i].lima_nro_entregas;
                                  dataid[j].lima_nro_rezagos =  dataid[j].lima_nro_rezagos + data[i].lima_nro_rezagos;
                                  dataid[j].lima_nro_imgs =  dataid[j].lima_nro_imgs + data[i].lima_nro_imgs;
                                  dataid[j].lima_o = dataid[j].lima_o + (dataid[j].lima_nro_docs - dataid[j].lima_nro_entregas - dataid[j].lima_nro_rezagos - dataid[j].lima_nro_distribucion - dataid[j].lima_nro_alistamiento);
                                  dataid[j].lima_per_d = dataid_lima_per_d;
                                  dataid[j].lima_per_a = dataid_lima_per_a;
                                  dataid[j].lima_per_e = dataid_lima_per_e;//( dataid[j].lima_per_e + lima_per_e )
                                  dataid[j].lima_per_r = dataid_lima_per_r;//( dataid[j].lima_per_r + lima_per_r )
                                  dataid[j].lima_per_i = dataid_lima_per_i;//( dataid[j].lima_per_i + lima_per_i )

                                  dataid[j].prov_nro_docs =  dataid[j].prov_nro_docs + data[i].prov_nro_docs;
                                  dataid[j].prov_nro_distribucion =  dataid[j].prov_nro_distribucion + data[i].prov_nro_distribucion;
                                  dataid[j].prov_nro_alistamiento =  dataid[j].prov_nro_alistamiento + data[i].prov_nro_alistamiento;
                                  dataid[j].prov_nro_entregas =  dataid[j].prov_nro_entregas + data[i].prov_nro_entregas;
                                  dataid[j].prov_nro_rezagos =  dataid[j].prov_nro_rezagos + data[i].prov_nro_rezagos;
                                  dataid[j].prov_nro_imgs =  dataid[j].prov_nro_imgs + data[i].prov_nro_imgs;//console.log("cant:",l++);console.log("dataid 2=",dataid[j]);
                                  dataid[j].prov_o = dataid[j].prov_o + (data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos - data[i].prov_nro_distribucion - data[i].prov_nro_alistamiento);
                                  dataid[j].prov_per_d = dataid_prov_per_d;
                                  dataid[j].prov_per_a = dataid_prov_per_a;
                                  dataid[j].prov_per_e = dataid_prov_per_e;//( dataid[j].prov_per_e + prov_per_e )
                                  dataid[j].prov_per_r = dataid_prov_per_r;//( dataid[j].prov_per_r + prov_per_r )
                                  dataid[j].prov_per_i = dataid_prov_per_i;//( dataid[j].prov_per_i + prov_per_i )
                                  
                                  dataid[j].total_dis =  dataid[j].total_dis + data[i].prov_nro_distribucion + data[i].lima_nro_distribucion;
                                  dataid[j].total_ali =  dataid[j].total_ali + data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento;
                                  dataid[j].total_ent =  dataid[j].total_ent + data[i].prov_nro_entregas + data[i].lima_nro_entregas;
                                  dataid[j].total_rez =  dataid[j].total_rez + data[i].prov_nro_rezagos + data[i].lima_nro_rezagos;
                                  dataid[j].total_img =  dataid[j].total_img + data[i].prov_nro_imgs + data[i].lima_nro_imgs;
                                  dataid[j].total_o =  dataid[j].total_o + ((data[i].lima_nro_docs - data[i].lima_nro_alistamiento - data[i].lima_nro_distribucion - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_alistamiento - data[i].prov_nro_distribucion - data[i].prov_nro_entregas - data[i].prov_nro_rezagos));
                                  dataid[j].total_per_d = dataid_total_per_d;
                                  dataid[j].total_per_a = dataid_total_per_a;
                                  dataid[j].total_per_e = dataid_total_per_e;//( dataid[j].total_per_e + (dataid[j].prov_nro_entregas + dataid[j].lima_nro_entregas)/dataid[j].nro_docs );
                                  dataid[j].total_per_r = dataid_total_per_r;//( dataid[j].total_per_r + (dataid[j].prov_nro_rezagos + dataid[j].lima_nro_rezagos)/dataid[j].nro_docs );
                                  dataid[j].total_per_i = dataid_total_per_i;//( dataid[j].total_per_i + (dataid[j].prov_nro_imgs + dataid[j].lima_nro_imgs)/dataid[j].nro_docs );
                                  
                                  for(let k = 0; k < dataid[j].detalle.length; k++){
                                      if(dataid[j].detalle[k].orden != data[i].orden){//console.log("k=",k,data[i].orden);
                                          if(lima_per_d && lima_per_a && lima_per_e && lima_per_r && lima_per_i){
                                            lima_per_d = lima_per_d.toFixed(2);
                                            lima_per_a = lima_per_a.toFixed(2);
                                            lima_per_e = lima_per_e.toFixed(2);
                                            lima_per_r = lima_per_r.toFixed(2);
                                            lima_per_i = lima_per_i.toFixed(2);
                                          }
                                          if(prov_per_d && prov_per_a && prov_per_e && prov_per_r && prov_per_i){
                                            prov_per_d = prov_per_d.toFixed(2);
                                            prov_per_a = prov_per_a.toFixed(2);
                                            prov_per_e = prov_per_e.toFixed(2);
                                            prov_per_r = prov_per_r.toFixed(2);
                                            prov_per_i = prov_per_i.toFixed(2);
                                          }

                                          dataid[j].detalle.push(
                                              {
                                                ord_id: data[i].ord_id,
                                                orden: data[i].orden,
                                                estado: data[i].estado,
                                                nro_docs: data[i].nro_docs,

                                                total_dis: data[i].prov_nro_distribucion + data[i].lima_nro_distribucion,
                                                total_per_d: ( (data[i].prov_nro_distribucion + data[i].lima_nro_distribucion)/data[i].nro_docs ).toFixed(2),
                                                total_ali: data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento,
                                                total_per_a: ( (data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento)/data[i].nro_docs ).toFixed(2),
                                                total_ent: data[i].prov_nro_entregas + data[i].lima_nro_entregas,
                                                total_per_e: ( (data[i].prov_nro_entregas + data[i].lima_nro_entregas)/data[i].nro_docs ).toFixed(2),
                                                total_rez: data[i].prov_nro_rezagos + data[i].lima_nro_rezagos,
                                                total_per_r: ( (data[i].prov_nro_rezagos + data[i].lima_nro_rezagos)/data[i].nro_docs ).toFixed(2),                                  
                                                total_img: data[i].prov_nro_imgs + data[i].lima_nro_imgs,
                                                total_per_i: ( (data[i].prov_nro_imgs + data[i].lima_nro_imgs)/data[i].nro_docs ).toFixed(2),
                                                total_o: (data[i].lima_nro_docs - data[i].lima_nro_alistamiento - data[i].lima_nro_distribucion - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_alistamiento - data[i].prov_nro_distribucion - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),

                                                lima_nro_docs: data[i].lima_nro_docs,
                                                lima_nro_distribucion: data[i].lima_nro_distribucion,
                                                lima_nro_alistamiento: data[i].lima_nro_alistamiento,
                                                lima_nro_entregas: data[i].lima_nro_entregas,
                                                lima_nro_rezagos: data[i].lima_nro_rezagos,
                                                lima_nro_imgs: data[i].lima_nro_imgs,
                                                lima_o: data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos - data[i].lima_nro_distribucion - data[i].lima_nro_alistamiento,
                                                lima_per_d: lima_per_d,
                                                lima_per_a: lima_per_a,
                                                lima_per_e: lima_per_e,
                                                lima_per_r: lima_per_r,
                                                lima_per_i: lima_per_i,

                                                prov_nro_docs: data[i].prov_nro_docs,
                                                prov_nro_distribucion: data[i].prov_nro_distribucion,
                                                prov_nro_alistamiento: data[i].prov_nro_alistamiento,
                                                prov_nro_entregas: data[i].prov_nro_entregas,
                                                prov_nro_rezagos: data[i].prov_nro_rezagos,
                                                prov_nro_imgs: data[i].prov_nro_imgs,
                                                prov_o: data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos - data[i].prov_nro_distribucion - data[i].prov_nro_alistamiento,
                                                prov_per_d: prov_per_d,
                                                prov_per_a: prov_per_a,
                                                prov_per_e: prov_per_e,
                                                prov_per_r: prov_per_r,
                                                prov_per_i: prov_per_i
                                              }
                                          )
                                      }break;
                                  }break;
                              }else{//console.log("i=",i,"j=",j);//15/03/2019
                                //console.log("cli_1:",data[42].id_cliente,"cli_2:",dataid[j].id_cliente,"pro_1:",data[42].producto,"pro_2:",dataid[j].producto,"cor_1:",data[42].corte,"cor_2:",dataid[j].corte)//15/03/2019
                                cont3++;//15/03/2019
                              }
                          }
                        }
                      //}
                  }console.log("cont:",cont);console.log("cont2:",cont2);console.log("cont3:",cont3);//15/03/2019
                   }next(null,dataid);
                  }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Couriers.");   
      });
    };

    Gestion.listordenes = (desde, hasta, ope, cli, pro, protipo, corte, options, next) => {
      var ds = Gestion.dataSource;
      const valores = options && options.accessToken;
      const usu_id = valores && valores.userId;
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from gestion.spu_ordenes_consultar_lista($1,$2,$3,$4,$5,$6,$7,$8)";
            ds.connector.execute(sql, [desde,hasta,ope,cli,pro,protipo,usu_id,corte], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Couriers.");   
      });
    };

    Gestion.getordeneslista = (ordenes, tipo, suc_id, options, next) => {
      var ds = Gestion.dataSource;
      const valores = options && options.accessToken;
      const usu_id = valores && valores.userId;
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from gestion.spu_ordenes_consultar_os_lista_sucursal($1,$2,$3,$4)";
            var data = [];
            data = [ordenes,tipo,usu_id,suc_id];
            ds.connector.execute(sql, data, function(err, data) {
                if (err){ reject(err); }
                else{
                  let dataid = [];
                  let idscli = [];
                  let idspro = [];
                  let idscor = [];
                  for(let i = 0; i < data.length; i++){
                      if(idscli.indexOf(data[i].id_cliente) < 0 || idspro.indexOf(data[i].producto) < 0 || idscor.indexOf(data[i].corte) < 0){
                          idscli.push(data[i].id_cliente);
                          idspro.push(data[i].producto);
                          idscor.push(data[i].corte);
                          let lima_per_d1 = 0;
                          let lima_per_a1 = 0;
                          let lima_per_e1 = 0;
                          let lima_per_r1 = 0;
                          let lima_per_i1 = 0;

                          let prov_per_d1 = 0;
                          let prov_per_a1 = 0;
                          let prov_per_e1 = 0;
                          let prov_per_r1 = 0;
                          let prov_per_i1 = 0;
                          // Lima
                          if(data[i].lima_nro_docs > 0){
                            lima_per_d1 = data[i].lima_nro_distribucion/data[i].lima_nro_docs;
                            lima_per_a1 = data[i].lima_nro_alistamiento/data[i].lima_nro_docs;
                            lima_per_e1 = data[i].lima_nro_entregas/data[i].lima_nro_docs;
                            if(lima_per_e1 > 0){
                              lima_per_r1 = data[i].lima_nro_rezagos/lima_per_e1;
                            }else{
                              lima_per_r1 = 0;
                            }
                          }else{
                            lima_per_d1 = 0;
                            lima_per_a1 = 0;
                            lima_per_e1 = 0;
                          }

                          if((data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) > 0){
                            lima_per_i1 = data[i].lima_nro_imgs/data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos;
                          }else{
                            lima_per_i1 = 0;
                          }

                          //Prov 
                          if(data[i].prov_nro_docs > 0){
                            prov_per_d1 = data[i].prov_nro_distribucion/data[i].prov_nro_docs;
                            prov_per_a1 = data[i].prov_nro_alistamiento/data[i].prov_nro_docs;
                            prov_per_e1 = data[i].prov_nro_entregas/data[i].prov_nro_docs;
                            if(prov_per_e1 > 0){
                              prov_per_r1 = data[i].prov_nro_rezagos/prov_per_e1;
                            }else{
                              prov_per_r1 = 0;
                            }
                          }else{
                            prov_per_d1 = 0;
                            prov_per_a1 = 0;
                            prov_per_e1 = 0;
                          }

                          if((data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos) > 0){
                            prov_per_i1 = data[i].prov_nro_imgs/data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos;
                          }else{
                            prov_per_i1 = 0;
                          }
                          dataid.push(
                              {
                                  id_cliente: data[i].id_cliente,
                                  cliente: data[i].cliente,
                                  producto: data[i].producto,
                                  corte: data[i].corte,
                                  fecha_inicio: data[i].fecha_inicio,
                                  fecha_fin: data[i].fecha_fin,
                                  nro_docs: data[i].nro_docs,

                                  total_dis: data[i].prov_nro_distribucion + data[i].lima_nro_distribucion,
                                  total_per_d: ( (data[i].prov_nro_distribucion + data[i].lima_nro_distribucion)/data[i].nro_docs ).toFixed(2),
                                  total_ali: data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento,
                                  total_per_a: ( (data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento)/data[i].nro_docs ).toFixed(2),
                                  total_ent: data[i].prov_nro_entregas + data[i].lima_nro_entregas,
                                  total_per_e: ( (data[i].prov_nro_entregas + data[i].lima_nro_entregas)/data[i].nro_docs ).toFixed(2),
                                  total_rez: data[i].prov_nro_rezagos + data[i].lima_nro_rezagos,
                                  total_per_r: ( (data[i].prov_nro_rezagos + data[i].lima_nro_rezagos)/data[i].nro_docs ).toFixed(2),                                  
                                  total_img: data[i].prov_nro_imgs + data[i].lima_nro_imgs,
                                  total_per_i: ( (data[i].prov_nro_imgs + data[i].lima_nro_imgs)/data[i].nro_docs ).toFixed(2),
                                  //total_o: (data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),
                                  total_o: (data[i].lima_nro_docs - data[i].lima_nro_alistamiento - data[i].lima_nro_distribucion - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_alistamiento - data[i].prov_nro_distribucion - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),

                                  lima_nro_docs: data[i].lima_nro_docs,
                                  lima_nro_distribucion: data[i].lima_nro_distribucion,
                                  lima_per_d: lima_per_d1.toFixed(2),
                                  lima_nro_alistamiento: data[i].lima_nro_alistamiento,
                                  lima_per_a: lima_per_a1.toFixed(2),
                                  lima_nro_entregas: data[i].lima_nro_entregas,
                                  lima_per_e: lima_per_e1.toFixed(2),
                                  lima_nro_rezagos: data[i].lima_nro_rezagos,
                                  lima_per_r: lima_per_r1.toFixed(2),
                                  lima_o: data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos,
                                  lima_nro_imgs: data[i].lima_nro_imgs,
                                  lima_per_i: lima_per_i1.toFixed(2),

                                  prov_nro_docs: data[i].prov_nro_docs,
                                  prov_nro_distribucion: data[i].prov_nro_distribucion,
                                  prov_per_d: prov_per_d1.toFixed(2),
                                  prov_nro_alistamiento: data[i].prov_nro_alistamiento,
                                  prov_per_a: prov_per_a1.toFixed(2),
                                  prov_nro_entregas: data[i].prov_nro_entregas,
                                  prov_per_e: prov_per_e1.toFixed(2),
                                  prov_nro_rezagos: data[i].prov_nro_rezagos,
                                  prov_per_r: prov_per_r1.toFixed(2),
                                  prov_nro_imgs: data[i].prov_nro_imgs,
                                  prov_per_i: prov_per_i1.toFixed(2),
                                  prov_o: data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos,
                                  
                                  detalle:[
                                      {
                                          ord_id: data[i].ord_id,
                                          orden: data[i].orden,
                                          estado: data[i].estado,
                                          nro_docs: data[i].nro_docs,

                                          total_dis: data[i].prov_nro_distribucion + data[i].lima_nro_distribucion,
                                          total_per_d: ( (data[i].prov_nro_distribucion + data[i].lima_nro_distribucion)/data[i].nro_docs ).toFixed(2),
                                          total_ali: data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento,
                                          total_per_a: ( (data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento)/data[i].nro_docs ).toFixed(2),
                                          total_ent: data[i].prov_nro_entregas + data[i].lima_nro_entregas,
                                          total_per_e: ( (data[i].prov_nro_entregas + data[i].lima_nro_entregas)/data[i].nro_docs ).toFixed(2),
                                          total_rez: data[i].prov_nro_rezagos + data[i].lima_nro_rezagos,
                                          total_per_r: ( (data[i].prov_nro_rezagos + data[i].lima_nro_rezagos)/data[i].nro_docs ).toFixed(2),                                  
                                          total_img: data[i].prov_nro_imgs + data[i].lima_nro_imgs,
                                          total_per_i: ( (data[i].prov_nro_imgs + data[i].lima_nro_imgs)/data[i].nro_docs ).toFixed(2),
                                          //total_o: (data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),
                                          total_o: (data[i].lima_nro_docs - data[i].lima_nro_alistamiento - data[i].lima_nro_distribucion - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_alistamiento - data[i].prov_nro_distribucion - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),

                                          lima_nro_docs: data[i].lima_nro_docs,
                                          lima_nro_distribucion: data[i].lima_nro_distribucion,
                                          lima_nro_alistamiento: data[i].lima_nro_alistamiento,
                                          lima_nro_entregas: data[i].lima_nro_entregas,
                                          lima_nro_rezagos: data[i].lima_nro_rezagos,
                                          lima_nro_imgs: data[i].lima_nro_imgs,
                                          lima_o: data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos - data[i].lima_nro_distribucion - data[i].lima_nro_alistamiento,
                                          lima_per_d: lima_per_d1.toFixed(2),
                                          lima_per_a: lima_per_a1.toFixed(2),
                                          lima_per_e: lima_per_e1.toFixed(2),
                                          lima_per_r: lima_per_r1.toFixed(2),
                                          lima_per_i: lima_per_i1.toFixed(2),

                                          prov_nro_docs: data[i].prov_nro_docs,
                                          prov_nro_distribucion: data[i].prov_nro_distribucion,
                                          prov_nro_alistamiento: data[i].prov_nro_alistamiento,
                                          prov_nro_entregas: data[i].prov_nro_entregas,
                                          prov_nro_rezagos: data[i].prov_nro_rezagos,
                                          prov_nro_imgs: data[i].prov_nro_imgs,
                                          prov_o: data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos - data[i].prov_nro_distribucion - data[i].prov_nro_alistamiento,
                                          prov_per_d: prov_per_d1.toFixed(2),
                                          prov_per_a: prov_per_a1.toFixed(2),
                                          prov_per_e: prov_per_e1.toFixed(2),
                                          prov_per_r: prov_per_r1.toFixed(2),
                                          prov_per_i: prov_per_i1.toFixed(2)
                                        }
                                  ]
                              }
                          )
                          
                      }else{//console.log("daid:",dataid.length,dataid);
                          for(let j = 0; j < dataid.length; j++){
                              if(data[i].id_cliente == dataid[j].id_cliente && data[i].producto == dataid[j].producto && data[i].corte == dataid[j].corte){//console.log("j=",j,dataid[j].nro_docs,"+",data[i].nro_docs);
                                  let lima_per_d = 0;
                                  let lima_per_a = 0;
                                  let lima_per_e = 0;
                                  let lima_per_r = 0;
                                  let lima_per_i = 0;
                                  let prov_per_d = 0;
                                  let prov_per_a = 0;
                                  let prov_per_e = 0;
                                  let prov_per_r = 0;
                                  let prov_per_i = 0;
                                  // Lima
                                  if(data[i].lima_nro_docs > 0){
                                    lima_per_d = data[i].lima_nro_distribucion/data[i].lima_nro_docs;
                                    lima_per_a = data[i].lima_nro_alistamiento/data[i].lima_nro_docs;
                                    lima_per_e = data[i].lima_nro_entregas/data[i].lima_nro_docs;
                                    if(lima_per_e > 0){
                                      lima_per_r = data[i].lima_nro_rezagos/lima_per_e;
                                    }else{
                                      lima_per_r = 0;
                                    }
                                  }else{
                                    lima_per_d = 0;
                                    lima_per_a = 0;
                                    lima_per_e = 0;
                                  }

                                  if((data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) > 0){
                                    lima_per_i = data[i].lima_nro_imgs/data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos;
                                  }else{
                                    lima_per_i = 0;
                                  }

                                  //Prov 
                                  if(data[i].prov_nro_docs > 0){
                                    prov_per_d = data[i].prov_nro_distribucion/data[i].prov_nro_docs;
                                    prov_per_a = data[i].prov_nro_alistamiento/data[i].prov_nro_docs;
                                    prov_per_e = data[i].prov_nro_entregas/data[i].prov_nro_docs;
                                    if(prov_per_e > 0){
                                      prov_per_r = data[i].prov_nro_rezagos/prov_per_e;
                                    }else{
                                      prov_per_r = 0;
                                    }
                                  }else{
                                    prov_per_d = 0;
                                    prov_per_a = 0;
                                    prov_per_e = 0;
                                  }

                                  if((data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos) > 0){
                                    prov_per_i = data[i].prov_nro_imgs/data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos;
                                  }else{
                                    prov_per_i = 0;
                                  }    

                                  let dataid_lima_per_d = dataid[j].lima_per_d + lima_per_d;
                                  let dataid_lima_per_a = dataid[j].lima_per_a + lima_per_a;
                                  let dataid_lima_per_e = dataid[j].lima_per_e + lima_per_e;
                                  let dataid_lima_per_r = dataid[j].lima_per_r + lima_per_r;
                                  let dataid_lima_per_i = dataid[j].lima_per_i + lima_per_i;

                                  dataid_lima_per_d = Math.round(parseFloat(dataid_lima_per_d) * 100) / 100;
                                  dataid_lima_per_a = Math.round(parseFloat(dataid_lima_per_a) * 100) / 100;
                                  dataid_lima_per_e = Math.round(parseFloat(dataid_lima_per_e) * 100) / 100;
                                  dataid_lima_per_r = Math.round(parseFloat(dataid_lima_per_r) * 100) / 100;
                                  dataid_lima_per_i = Math.round(parseFloat(dataid_lima_per_i) * 100) / 100;

                                  let dataid_prov_per_d = dataid[j].prov_per_d + prov_per_d;
                                  let dataid_prov_per_a = dataid[j].prov_per_a + prov_per_a;
                                  let dataid_prov_per_e = dataid[j].prov_per_e + prov_per_e;
                                  let dataid_prov_per_r = dataid[j].prov_per_r + prov_per_r;
                                  let dataid_prov_per_i = dataid[j].prov_per_i + prov_per_i;

                                  dataid_prov_per_d = Math.round(parseFloat(dataid_prov_per_d) * 100) / 100;
                                  dataid_prov_per_a = Math.round(parseFloat(dataid_prov_per_a) * 100) / 100;
                                  dataid_prov_per_e = Math.round(parseFloat(dataid_prov_per_e) * 100) / 100;
                                  dataid_prov_per_r = Math.round(parseFloat(dataid_prov_per_r) * 100) / 100;
                                  dataid_prov_per_i = Math.round(parseFloat(dataid_prov_per_i) * 100) / 100;

                                  let dataid_total_per_d = dataid[j].total_per_d + (dataid[j].prov_nro_distribucion + dataid[j].lima_nro_distribucion)/dataid[j].nro_docs;
                                  let dataid_total_per_a = dataid[j].total_per_a + (dataid[j].prov_nro_alistamiento + dataid[j].lima_nro_alistamiento)/dataid[j].nro_docs;
                                  let dataid_total_per_e = dataid[j].total_per_e + (dataid[j].prov_nro_entregas + dataid[j].lima_nro_entregas)/dataid[j].nro_docs;
                                  let dataid_total_per_r = dataid[j].total_per_r + (dataid[j].prov_nro_rezagos + dataid[j].lima_nro_rezagos)/dataid[j].nro_docs;
                                  let dataid_total_per_i = dataid[j].total_per_i + (dataid[j].prov_nro_imgs + dataid[j].lima_nro_imgs)/dataid[j].nro_docs;

                                  dataid_total_per_d = Math.round(parseFloat(dataid_total_per_d) * 100) / 100;
                                  dataid_total_per_a = Math.round(parseFloat(dataid_total_per_a) * 100) / 100;
                                  dataid_total_per_e = Math.round(parseFloat(dataid_total_per_e) * 100) / 100;
                                  dataid_total_per_r = Math.round(parseFloat(dataid_total_per_r) * 100) / 100;
                                  dataid_total_per_i = Math.round(parseFloat(dataid_total_per_i) * 100) / 100;

                                  dataid[j].nro_docs =  dataid[j].nro_docs + data[i].nro_docs;

                                  dataid[j].lima_nro_docs =  dataid[j].lima_nro_docs + data[i].lima_nro_docs;
                                  dataid[j].lima_nro_distribucion =  dataid[j].lima_nro_distribucion + data[i].lima_nro_distribucion;
                                  dataid[j].lima_nro_alistamiento =  dataid[j].lima_nro_alistamiento + data[i].lima_nro_alistamiento;
                                  dataid[j].lima_nro_entregas =  dataid[j].lima_nro_entregas + data[i].lima_nro_entregas;
                                  dataid[j].lima_nro_rezagos =  dataid[j].lima_nro_rezagos + data[i].lima_nro_rezagos;
                                  dataid[j].lima_nro_imgs =  dataid[j].lima_nro_imgs + data[i].lima_nro_imgs;
                                  dataid[j].lima_o = dataid[j].lima_o + (dataid[j].lima_nro_docs - dataid[j].lima_nro_entregas - dataid[j].lima_nro_rezagos - dataid[j].lima_nro_distribucion - dataid[j].lima_nro_alistamiento);
                                  dataid[j].lima_per_d = dataid_lima_per_d;
                                  dataid[j].lima_per_a = dataid_lima_per_a;
                                  dataid[j].lima_per_e = dataid_lima_per_e;//( dataid[j].lima_per_e + lima_per_e )
                                  dataid[j].lima_per_r = dataid_lima_per_r;//( dataid[j].lima_per_r + lima_per_r )
                                  dataid[j].lima_per_i = dataid_lima_per_i;//( dataid[j].lima_per_i + lima_per_i )

                                  dataid[j].prov_nro_docs =  dataid[j].prov_nro_docs + data[i].prov_nro_docs;
                                  dataid[j].prov_nro_distribucion =  dataid[j].prov_nro_distribucion + data[i].prov_nro_distribucion;
                                  dataid[j].prov_nro_alistamiento =  dataid[j].prov_nro_alistamiento + data[i].prov_nro_alistamiento;
                                  dataid[j].prov_nro_entregas =  dataid[j].prov_nro_entregas + data[i].prov_nro_entregas;
                                  dataid[j].prov_nro_rezagos =  dataid[j].prov_nro_rezagos + data[i].prov_nro_rezagos;
                                  dataid[j].prov_nro_imgs =  dataid[j].prov_nro_imgs + data[i].prov_nro_imgs;//console.log("cant:",l++);console.log("dataid 2=",dataid[j]);
                                  dataid[j].prov_o = dataid[j].prov_o + (data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos - data[i].prov_nro_distribucion - data[i].prov_nro_alistamiento);
                                  dataid[j].prov_per_d = dataid_prov_per_d;
                                  dataid[j].prov_per_a = dataid_prov_per_a;
                                  dataid[j].prov_per_e = dataid_prov_per_e;//( dataid[j].prov_per_e + prov_per_e )
                                  dataid[j].prov_per_r = dataid_prov_per_r;//( dataid[j].prov_per_r + prov_per_r )
                                  dataid[j].prov_per_i = dataid_prov_per_i;//( dataid[j].prov_per_i + prov_per_i )
                                  
                                  dataid[j].total_dis =  dataid[j].total_dis + data[i].prov_nro_distribucion + data[i].lima_nro_distribucion;
                                  dataid[j].total_ali =  dataid[j].total_ali + data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento;
                                  dataid[j].total_ent =  dataid[j].total_ent + data[i].prov_nro_entregas + data[i].lima_nro_entregas;
                                  dataid[j].total_rez =  dataid[j].total_rez + data[i].prov_nro_rezagos + data[i].lima_nro_rezagos;
                                  dataid[j].total_img =  dataid[j].total_img + data[i].prov_nro_imgs + data[i].lima_nro_imgs;
                                  dataid[j].total_o =  dataid[j].total_o + ((data[i].lima_nro_docs - data[i].lima_nro_alistamiento - data[i].lima_nro_distribucion - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_alistamiento - data[i].prov_nro_distribucion - data[i].prov_nro_entregas - data[i].prov_nro_rezagos));
                                  dataid[j].total_per_d = dataid_total_per_d;
                                  dataid[j].total_per_a = dataid_total_per_a;
                                  dataid[j].total_per_e = dataid_total_per_e;//( dataid[j].total_per_e + (dataid[j].prov_nro_entregas + dataid[j].lima_nro_entregas)/dataid[j].nro_docs );
                                  dataid[j].total_per_r = dataid_total_per_r;//( dataid[j].total_per_r + (dataid[j].prov_nro_rezagos + dataid[j].lima_nro_rezagos)/dataid[j].nro_docs );
                                  dataid[j].total_per_i = dataid_total_per_i;//( dataid[j].total_per_i + (dataid[j].prov_nro_imgs + dataid[j].lima_nro_imgs)/dataid[j].nro_docs );
                                  
                                  for(let k = 0; k < dataid[j].detalle.length; k++){
                                      if(dataid[j].detalle[k].orden != data[i].orden){//console.log("k=",k,data[i].orden);
                                          if(lima_per_d && lima_per_a && lima_per_e && lima_per_r && lima_per_i){
                                            lima_per_d = lima_per_d.toFixed(2);
                                            lima_per_a = lima_per_a.toFixed(2);
                                            lima_per_e = lima_per_e.toFixed(2);
                                            lima_per_r = lima_per_r.toFixed(2);
                                            lima_per_i = lima_per_i.toFixed(2);
                                          }
                                          if(prov_per_d && prov_per_a && prov_per_e && prov_per_r && prov_per_i){
                                            prov_per_d = prov_per_d.toFixed(2);
                                            prov_per_a = prov_per_a.toFixed(2);
                                            prov_per_e = prov_per_e.toFixed(2);
                                            prov_per_r = prov_per_r.toFixed(2);
                                            prov_per_i = prov_per_i.toFixed(2);
                                          }

                                          dataid[j].detalle.push(
                                              {
                                                ord_id: data[i].ord_id,
                                                orden: data[i].orden,
                                                estado: data[i].estado,
                                                nro_docs: data[i].nro_docs,

                                                total_dis: data[i].prov_nro_distribucion + data[i].lima_nro_distribucion,
                                                total_per_d: ( (data[i].prov_nro_distribucion + data[i].lima_nro_distribucion)/data[i].nro_docs ).toFixed(2),
                                                total_ali: data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento,
                                                total_per_a: ( (data[i].prov_nro_alistamiento + data[i].lima_nro_alistamiento)/data[i].nro_docs ).toFixed(2),
                                                total_ent: data[i].prov_nro_entregas + data[i].lima_nro_entregas,
                                                total_per_e: ( (data[i].prov_nro_entregas + data[i].lima_nro_entregas)/data[i].nro_docs ).toFixed(2),
                                                total_rez: data[i].prov_nro_rezagos + data[i].lima_nro_rezagos,
                                                total_per_r: ( (data[i].prov_nro_rezagos + data[i].lima_nro_rezagos)/data[i].nro_docs ).toFixed(2),                                  
                                                total_img: data[i].prov_nro_imgs + data[i].lima_nro_imgs,
                                                total_per_i: ( (data[i].prov_nro_imgs + data[i].lima_nro_imgs)/data[i].nro_docs ).toFixed(2),
                                                total_o: (data[i].lima_nro_docs - data[i].lima_nro_alistamiento - data[i].lima_nro_distribucion - data[i].lima_nro_entregas - data[i].lima_nro_rezagos) +  (data[i].prov_nro_docs - data[i].prov_nro_alistamiento - data[i].prov_nro_distribucion - data[i].prov_nro_entregas - data[i].prov_nro_rezagos),

                                                lima_nro_docs: data[i].lima_nro_docs,
                                                lima_nro_distribucion: data[i].lima_nro_distribucion,
                                                lima_nro_alistamiento: data[i].lima_nro_alistamiento,
                                                lima_nro_entregas: data[i].lima_nro_entregas,
                                                lima_nro_rezagos: data[i].lima_nro_rezagos,
                                                lima_nro_imgs: data[i].lima_nro_imgs,
                                                lima_o: data[i].lima_nro_docs - data[i].lima_nro_entregas - data[i].lima_nro_rezagos - data[i].lima_nro_distribucion - data[i].lima_nro_alistamiento,
                                                lima_per_d: lima_per_d,
                                                lima_per_a: lima_per_a,
                                                lima_per_e: lima_per_e,
                                                lima_per_r: lima_per_r,
                                                lima_per_i: lima_per_i,

                                                prov_nro_docs: data[i].prov_nro_docs,
                                                prov_nro_distribucion: data[i].prov_nro_distribucion,
                                                prov_nro_alistamiento: data[i].prov_nro_alistamiento,
                                                prov_nro_entregas: data[i].prov_nro_entregas,
                                                prov_nro_rezagos: data[i].prov_nro_rezagos,
                                                prov_nro_imgs: data[i].prov_nro_imgs,
                                                prov_o: data[i].prov_nro_docs - data[i].prov_nro_entregas - data[i].prov_nro_rezagos - data[i].prov_nro_distribucion - data[i].prov_nro_alistamiento,
                                                prov_per_d: prov_per_d,
                                                prov_per_a: prov_per_a,
                                                prov_per_e: prov_per_e,
                                                prov_per_r: prov_per_r,
                                                prov_per_i: prov_per_i
                                              }
                                          )
                                      }break;
                                  }break;
                              }
                          }
                      }
                  }//console.log("dataid:",dataid);
                  next(null,dataid); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Couriers.");   
      });
    };

    Gestion.remoteMethod('motivo', {
        accepts: [        
          {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
          arg: 'response',
          type: 'object',
          root: true
        },
        http: {
          verb: 'GET',
          path: '/motivo'
        }
      });

      Gestion.remoteMethod('motivoid', {
        accepts: [
          {arg: "ges_id", type: "number", required: true },
          {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
          arg: 'response',
          type: 'object',
          root: true
        },
        http: {
          verb: 'GET',
          path: '/motivoid'
        }
      });

    Gestion.remoteMethod('couriers', {
      accepts: [
        {arg: "emp_id", type: "number", required: true },      
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'GET',
        path: '/couriers'
      }
    });

    Gestion.remoteMethod('productos', {
      accepts: [
        {arg: "cli_id", type: "number", required: true },      
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'GET',
        path: '/productos'
      }
    });

    Gestion.remoteMethod('getordenes', {
      accepts: [
        {arg: "desde", type: "string", required: true },
        {arg: "hasta", type: "string", required: true },
        {arg: "ope", type: "number", required: true },
        {arg: "cli", type: "string", required: false },
        {arg: "pro", type: "string", required: false },
        {arg: "tiposProd", type: "string", required: false },
        {arg: "corte", type: "string", required: false },
        {arg: "tipo", type: "number", required: true },
        {arg: "ordenes", type: "string", required: false },
        {arg: "suc_id", type: "number", required: true },
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'POST',
        path: '/clientes/ordenes'
      }
    });

    Gestion.remoteMethod('listordenes', {
      accepts: [
        {arg: "desde", type: "string", required: true },
        {arg: "hasta", type: "string", required: true },
        {arg: "ope", type: "number", required: true },
        {arg: "cli", type: "string", required: false },
        {arg: "pro", type: "string", required: false },
        {arg: "protipo", type: "string", required: false },
        {arg: "corte", type: "string", required: false },
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'POST',
        path: '/clientes/listordenes'
      }
    });

    Gestion.remoteMethod('getordeneslista', {
      accepts: [
        {arg: "ordenes", type: "string", required: false },
        {arg: "tipo", type: "number", required: true },
        {arg: "suc_id", type: "number", required: true },
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'POST',
        path: '/clientes/ordeneslista'
      }
    });
};