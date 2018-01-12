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
var userQuery, userQueryEl, userDataEl;

// =============================================================================

function handleUserSelect(ev){
  var selectionValue = ev.target.value;
  
  if( selectionValue !== '' ){
    var queryData = '{ users(email: "'+ selectionValue +'") { name, first, last, email, password } }';
    userQuery = api + encodeURIComponent(queryData);
    var req = new Request(userQuery, opts);
    
    fetch(req)
    .then(function(resp){
      resp.json().then(function(json){
        var data = json.data.users;
        userQueryEl.innerHTML = '<a class="link-btn" href="'+ userQuery +'" target="_blank">View User Query</a>';
        
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
  else{
    userQueryEl.innerHTML = '';
    userDataEl.innerHTML = '';
  }
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
  
  appBody.innerHTML = 
    '<p>'+
      "Select a user from the below drop-down to view the CURL request (if you "+
      "don't want to utilize AJAX), and the request's JSON result. You can then "+
      "click the <b>View User Query</b> button to see the formatting in GraphiQL. "+
      "The <b>Query Builder</b> takes you to an empty GraphiQL instance, and the <b>View "+
      "User's Query</b> button shows what's needed to get a list of users within GraphiQL"+
    '</p>'+
    '<select id="userSelect">'+
      '<option value="">Select User</option>'+
      userOpts +
    '</select>'+
    '<span id="userQuery" class="user-query"></span>'+
    '<pre id="userData"></pre>'+
    '<a class="link-btn" href="'+ graphqlLoc +'" target="_blank">Query Builder</a>'+
    '<a class="link-btn" href="'+ usersQuery +'" target="_blank">View User\'s Query</a>';
    
  userQueryEl = document.querySelector('#userQuery');
  userDataEl = document.querySelector('#userData');
  
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