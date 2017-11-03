exports = module.exports = function(verifyPassword) {
  var Strategy = require('passport-local');
  
  var strategy = new Strategy(verifyPassword);
  return strategy;
};

// TODO: Set this name to www/password
exports['@implements'] = 'http://i.bixbyjs.org/http/auth/Scheme';
exports['@require'] = [
  'http://i.bixbyjs.org/security/authentication/password/verify'
];
