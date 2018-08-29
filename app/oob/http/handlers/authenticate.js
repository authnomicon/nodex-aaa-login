exports = module.exports = function(parse, csrfProtection, authenticate, ceremony) {
  var path = require('path');
  
  /*
  return [
    require('body-parser').urlencoded({ extended: false }),
    ceremony.loadState('mfa'),
    authenticator.authenticate('session'),
    authenticator.authenticate('mfa-oob'),
    ceremony.complete('mfa'),
    function(err, req, res, next) {
      console.log(err);
      console.log(err.stack);
      next(err);
    },
    ceremony.completeError('mfa')
  ];
  */
  
  
  return [
    parse('application/x-www-form-urlencoded'),
    ceremony('login/oob',
      csrfProtection(),
      authenticate('oob'),
      function(req, res, next) {
        console.log('AUTHENTICATE!');
        console.log(req.body)
        console.log(req.user);
        console.log(req.authInfo);
        console.log('----')
        
        return;
        
        if (req.body.otp == '123') {
          req.user = { id: '1', displayName: 'joe'}
          return next();
        }
        
        return next(new errors.Unauthorized('Invalid otp'));
      },
      function unauthorizedErrorHandler(err, req, res, next) {
        if (err.status !== 401) { return next(err); }
        
        req.state.failureCount = req.state.failureCount ? req.state.failureCount + 1 : 1;
        res.locals.failureCount = req.state.failureCount;
        res.prompt();
        // TODO: Have some maxAttempt limit
      },
    { through: 'login' })
  ];
  
  
  
  return [
    parse('application/x-www-form-urlencoded'),
    ceremony('authenticate-oob',
      function(req, res, next) {
        console.log('OTP AUTHENTICATING...');
        console.log(req.body)
        next();
      },
      csrfProtection(), // TODO: ensure this works on GET requests
      //loadState('login'),
      authenticate('oob'),
      function(req, res, next) {
        console.log('OOB AUTHENTICATED!');
        console.log(req.user)
      
        if (!req.user) {
          console.log('again...');
        
          res.locals.ticket = req.body.ticket || req.query.ticket;
        
          var view = path.join(__dirname, '../../../views/oob/prompt.ejs');
          res.render(view);
          return;
        }
      
        console.log('LOGGED IN!');
        console.log(req.user);
      
        //next();
      },
    { through: 'login' })
  ];
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://i.bixbyjs.org/http/middleware/csrfProtection',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/ceremony',
];
