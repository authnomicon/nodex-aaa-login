exports = module.exports = function(Users) {

  return function(uid, state, cb){
    uid = '5001';
    
    if (!uid) { return cb(null, false); }
    Users.get(uid, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
    });
  };
};

exports['@require'] = [ 'http://schemas.authnomicon.org/js/ds/Users' ];
