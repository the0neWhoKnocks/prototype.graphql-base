var graphqlLoc = '/graphql';
var api = graphqlLoc +'?query='
var usersQuery = api + encodeURIComponent('{ users { name, email } }');
var headers = new Headers({
  'Content-Type': 'application/graphql'
});
var opts = {
  method: 'GET',
  headers: headers
};
var userQuery;

// =============================================================================

function handleUserSelect(ev){
  var queryData = '{ users(email: "'+ ev.target.value +'") { name, first, last, email, password } }';
  userQuery = api + encodeURIComponent(queryData);
  var req = new Request(userQuery, opts);
  
  fetch(req)
    .then(function(resp){
      resp.json().then(function(json){
        var data = json.data.users;
        var userQueryEl = document.querySelector('#userQuery');
        var userDataEl = document.querySelector('#userData');
        
        userQueryEl.innerHTML = '<a href="'+ userQuery +'">User query</a><br><br>';
        
        if( data.length ){
          userDataEl.innerHTML = 
            'curl -X GET -H "Content-Type:application/graphql" -d \'query '+ queryData +'\' http://localhost:4000/graphql'
            + "\n\n"
            + JSON.stringify(data[0], null, 2);
        }else{
          userDataEl.innerHTML = 'No data found';
        }
      });
    });
}

function setupUserSelect(){
  var userSelect = document.querySelector('#userSelect');
  
  userSelect.addEventListener('change', handleUserSelect);
}

function initApp(users){
  var appBody = document.querySelector('#app');
  var userOpts = '';
  
  for(var i in users){
    var user = users[i];
    
    userOpts += '<option value="'+ user.email +'">'+ user.name +'</option>';
  }
  
  appBody.innerHTML = '<a href="'+ graphqlLoc +'">GraphiQL</a> | <a href="'+ usersQuery +'">User\'s query</a><br><br><select id="userSelect"><option>Select User</option>'+ userOpts +'</select><br><br><span id="userQuery"></span><pre id="userData"></pre>';
  
  setupUserSelect();
}

// =============================================================================

if( window.fetch ){
  var req = new Request(usersQuery, opts);
  
  fetch(req)
    .then(function(resp){
      resp.json().then(function(json){
        initApp(json.data.users);
      });
    });
}else{
  alert("Can't run in your browser");
}