// If there is an error trying to get the token/profile 
// and the user doesn't exist anymore you get an error. 
// The problem is that you can't hook into that error to redirect them etc
// Here is an example of how that would work...

  function checkAuth() {
    if (!auth.isAuthenticated) {
      var token = store.get(prefix+'token');
      // var token = auth.idToken || store.get(prefix+'token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(auth.profile || store.get(prefix+'profile'), token)['catch'](function() {
            Auth.loginModal(true);
          });
        } else {
          var refreshToken = store.get(prefix+'refreshToken');
          // Either show Login page or use the refresh token to get a new idToken
          if (refreshToken) {
            auth.refreshIdToken(refreshToken).then(function(idToken) {
              store.set(prefix+'token', idToken);
              auth.authenticate(auth.profile || store.get(prefix+'profile'), idToken);
            })['catch'](function() {
              Auth.loginModal(true);
            });
          } else {
            Auth.loginModal(true);
          }
        }
      } else {
        Auth.loginModal(true);
      }
    }
  }

  $rootScope.$on('$locationChangeStart', checkAuth);

      // do render the google plus login button
      gapi.signin.render(
        'signinButton',
        {
          clientid: attrs.clientId+'.apps.googleusercontent.com',
          callback: function(oauth) {
            scope.afterSignin({oauth: oauth});
          },
          cookiepolicy: 'single_host_origin',
          requestvisibleactions: 'http://schemas.google.com/AddActivity',
          scope: scopeUrls.join(' ')
        });

