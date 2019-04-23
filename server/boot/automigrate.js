module.exports = function(app){
/*
	var ds = app.datasources.postgres;


	var User = app.models.user;
	var Role = app.models.Role;
	var RoleMapping = app.models.RoleMapping;
	//var Team = app.models.Team;



	//ds.automigrate(['user','application','role','acl','roleMapping','accessToken'],err=>{
	ds.automigrate(['user','role','acl','roleMapping','accessToken'],err=>{
		if(err) throw err;

		User.create([
		    {realm:'sau',username: 'jhonn','name':'jhonn',surname:'caceres', email: 'jhonn.caceres@dataimagenes.pe', password: '12345'}
		], function(err, users) {
		    if (err) return console.log('aca el error %j', err);


		    //...
		    // Create projects, assign project owners and project team members
		    //...
		    // Create the admin role
		    Role.create({
		      name: 'admin'
		    }, function(err, role) {
		      if (err) return console.log(err);

		      // Make Bob an admin
		      //app.models.roleMapping.create({
		      role.principals.create({
		        principalType: RoleMapping.USER,
		        principalId: users[0].id
		      }, function(err, principal) {
		        if (err) return console.log(err);
		      });
		    });



		    Role.create({
		      name: 'administrador'
		    }, function(err, role) {});
		    Role.create({
		      name: 'consultas'
		    }, function(err, role) {});

		  });
	})
*/
}