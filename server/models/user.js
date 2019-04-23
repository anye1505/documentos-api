'use strict';

module.exports = function(User) {
	require('./user/buscar')(User);
	/*Methods blocked*/
	/*User.disableRemoteMethodByName('create');
	
	User.disableRemoteMethodByName('upsert');
	User.disableRemoteMethodByName('updateAll');
	User.disableRemoteMethodByName('prototype.updateAttributes');

	User.disableRemoteMethodByName('find');
	User.disableRemoteMethodByName('findById');
	User.disableRemoteMethodByName('findOne');

	User.disableRemoteMethodByName('deleteById');

	User.disableRemoteMethodByName('confirm');
	User.disableRemoteMethodByName('count');
	User.disableRemoteMethodByName('exists');
	User.disableRemoteMethodByName('resetPassword');

	User.disableRemoteMethodByName('prototype.__count__accessTokens');
	User.disableRemoteMethodByName('prototype.__create__accessTokens');
	User.disableRemoteMethodByName('prototype.__delete__accessTokens');
	User.disableRemoteMethodByName('prototype.__destroyById__accessTokens');
	User.disableRemoteMethodByName('prototype.__findById__accessTokens');
	User.disableRemoteMethodByName('prototype.__get__accessTokens');
	User.disableRemoteMethodByName('prototype.__updateById__accessTokens');
	*/

};
