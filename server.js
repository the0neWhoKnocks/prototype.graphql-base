var express = require('express');
var graphqlHTTP = require('express-graphql');
var buildSchema = require('graphql').buildSchema;
var data = {
  users: () => [
    {
      name: 'John Doe',
      first: 'John',
      last: 'Doe',
      email: 'john.doe@example.com',
      password: 'pass'
    },
    {
      name: 'Jane Doe',
      first: 'Jane',
      last: 'Doe',
      email: 'jane.doe@example.com',
      password: 'word'
    }
  ]
};
var root = {
  users: (filter) => {
    var users = data.users();
    
    if(filter){
      switch(typeof filter){
        case 'object' :
          if( Object.keys(filter).length ) console.log('[ FILTER ]', filter);
          var matchedUsers = [];
          
          for(var i in users){
            var user = users[i];
            var matches = [];
            
            for(var key in filter){
              var val = filter[key];
              
              if( user[key] === val ){
                console.log(JSON.stringify(user, null, 2));
                matches.push(true);
                break;
              }
              
              matches.push(false);
            }
            
            if( matches.indexOf(false) === -1 ){
              matchedUsers.push(user);
            }
          }
          
          return matchedUsers;
          
        default :
          return users;
      }
    }
    
    return users;
  }
};
var schema = buildSchema(`
  type User {
    name: String
    first: String
    last: String
    email: String!
    password: String!
  }
  
  type Query {
    users(email: String): [User]
  }
`);
var app = express();

app.use(express.static('public'));

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.use('/', function(req, res){
  res.sendFile(__dirname +'/index.html');
});
app.listen(4000, () => console.log('Now browse to http://localhost:4000/'));