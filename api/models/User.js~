/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true
    },
    username: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    encryptedPassword: {
      type: 'string'
    },


    // Este método es para evitar pasar toda la información del modelo
    // Evitamos pasar los siguientes parámetros: password, confirmation, encryptedpassword y _csrf. 
    toJSON: function() { 
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
    }
  }
};
