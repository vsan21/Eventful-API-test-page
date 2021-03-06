const inquirer = require('inquirer');
//connection available to all
const connection = require('./connection');
const findEvents = require('./eventfulAPI.js');

// const getUsersName = () => {
//   return inquirer.prompt([{
//     type: 'input',
//     name: 'first_name',
//     message: 'What is your first name?'
//   },{
//     type: 'input',
//     name: 'last_name',
//     message: 'What is your last name?'
//   },{
//     type: 'input',
//     name: 'age',
//     message: 'How old are you?'
//   },{
//     type: 'input',
//     name: 'email',
//     message: 'What is your email address?'
//   }])
// }

const app = {};
app.startQuestion = (closeConnectionCallback) => {
  inquirer.prompt({
    type: 'list',
    message: 'What action would you like to do?',
    choices: [
      'Complete a sentence',
      'Create a new user',
      'Find one event of a particular type in San Francisco next week',
      'Mark an existing user to attend an event in database',
      'See all events that a particular user is going to',
      'See all the users that are going to a particular event',
      'Exit'
    ],
    name:'action',
  }).then((res) => {
    const continueCallback = () => app.startQuestion(closeConnectionCallback);

    if (res.action === 'Complete a sentence') app.completeSentence(continueCallback);
    if (res.action === 'Create a new user') app.createNewUser(continueCallback);
    if (res.action === 'Find one event of a particular type in San Francisco next week') app.searchEventful(continueCallback);
    if (res.action === 'Mark an existing user to attend an event in database') app.matchUserWithEvent(continueCallback);
    if (res.action === 'See all events that a particular user is going to') app.seeEventsOfOneUser(continueCallback);
    if (res.action === 'See all the users that are going to a particular event') app.seeUsersOfOneEvent(continueCallback);
    if (res.action === 'Exit') {
      closeConnectionCallback();
      return;
    }
  })
}

app.completeSentence = (continueCallback) => {
 inquirer.prompt([{
   type: 'input',
   name: 'fav_color',
   message: 'What is your favorite color?'
 },{
   type: 'input',
   name: 'item',
   message: 'What is an item in your favorite color?'
 }]).then((res) => {
   console.log(`My favorite color is ${res.fav_color} so my dream is to buy a ${res.fav_color} ${res.item}`);
 }).then(continueCallback);
}

app.createNewUser = (continueCallback) => {
  // getUsersName().then((res) => {
  //   firstname = res.first_name;
  //   lastname = res.last_name;
  //   usersemail = res.email;
  inquirer.prompt([{
    type: 'input',
    name: 'first_name',
    message: 'What is your first name?'
  },{
    type: 'input',
    name: 'last_name',
    message: 'What is your last name?'
  },{
    type: 'input',
    name: 'email',
    message: 'What is your email address?'
  }]).then((res) => {
    //res gives us an obj with the "name" as the key and the value = user's input
    console.log(`Fullname: ${res.first_name} ${res.last_name}, Email: ${res.email}`);

    var userInfo = {first_name: res.first_name, last_name: res.last_name, email: res.email};

    connection.query("INSERT INTO Users SET ?", userInfo, function(error, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
      if (error) throw error;
    });

  }).then(continueCallback);
}

app.searchEventful = (continueCallback) => {
  inquirer.prompt({
    type: 'input',
    name: 'event',
    message: 'What event do you want to search for?'
  }).then((res) => {

    findEvents(res.event, (usersEvent) => {
      inquirer.prompt({
        type: 'confirm',
        name: 'toDatabase',
        message: 'Do you want to send this event to the database?',
        default: false
      }).then((res) => {
        if(res.toDatabase === true) {
          var events = usersEvent;
          connection.query("INSERT INTO Events SET ?", events, function(error, results, fields) {
            if (error) throw error;
            console.log('This event has been stored into the database.');
            continueCallback();
          });
        } else {
          app.searchEventful(continueCallback);
        }
      }).catch((err) => {
        console.log(err);
      })
    })
  });
}

//app.matchUserWithEvent: the App shows all the Users in database and have the user pick one; App shows all the Events in database, and have the user pick one... After that, maybe a confirmation question? Then you'll make the SQL query and then go back to ask what user wants to do

parseResults = (inputs, version) => {
  console.log(inputs);
  let items = JSON.parse(JSON.stringify(inputs));
  console.log(items);

  let results = []
  for(var item of items) {
    let row = `${item.id} || `;
    if(version === "user") {
      row += `${item.email}`;
    } else {
      row += `${item.title}`;
    }
    results.push(row);
  }

  return results;
}

app.matchUserWithEvent = (continueCallback) => {
  connection.query('SELECT * FROM Users', function(err, results, fields){
    inquirer.prompt({
      type: 'list',
      name: 'uID',
      message: 'Which of these is your email?',
      choices: parseResults(results, "user")
    }).then((res) => {
      let grabUserID = res.uID.split('||');
      let userID = grabUserID[0];

      connection.query('SELECT * FROM Events', function(err, results, fields) {
        inquirer.prompt({
          type: 'list',
          name: 'eID',
          message: 'Which event would you like to attend?',
          choices: parseResults(results, "event")
        }).then((res) => {
          let grabEventID = res.eID.split('||');
          let eventID = grabEventID[0];

          let combineUserAndEvent = {user_id: userID, event_id: eventID};
          connection.query('INSERT INTO users_events SET ?', combineUserAndEvent, function(err, results, fields){
            if(err) throw err;
            console.log(`You are going to ${grabEventID[1]}!`);
            continueCallback();
          })

        })
      })
    })

  })


  // connection.query('SELECT * FROM Users', function(err, results, fields) {
  //   let userList = JSON.parse(JSON.stringify(results));
  //   for(let i=0; i<userList.length; i++) {
  //     console.log(`${userList[i].id} | ${userList[i].email}`);
  //   }
  //
  //   inquirer.prompt({
  //     type: 'input',
  //     name: 'uID',
  //     message: 'Please type in your corresponding user ID',
  //   }).then((res) => {
  //     let userID = parseInt(res.uID);
  //
  //     connection.query('SELECT * FROM Events', function(err, results, fields) {
  //       let eventsList = JSON.parse(JSON.stringify(results));
  //       for(let i=0; i<eventsList.length; i++) {
  //         console.log(`${eventsList[i].id} | ${eventsList[i].title} | ${eventsList[i].time}`);
  //       }
  //       inquirer.prompt({
  //         type: 'input',
  //         name: 'eID',
  //         message: 'Please type in the ID of the event you would like to attend.'
  //       }).then((res) => {
  //         let eventID = parseInt(res.eID);
  //
  //         let combineId = 'INSERT INTO users_events (user_id) SELECT id FROM Users WHERE id = ?';
  //
  //         let params = [userID, eventID];
  //
  //         connection.query(combineId, params, function(err, results, fields){
  //           if(err) throw err;
  //         })
  //
  //         // let combine = {user_id: userID, event_id: eventID};
  //         //
  //         // connection.query('INSERT INTO users_events SET ?', combine, function(err, results, fields) {
  //         //   if(err) throw err;
  //         // })
  //
  //       })
  //     })
  //   }).catch((err) => {
  //     console.log(err);
  //   })
  // })

}

app.seeEventsOfOneUser = (continueCallback) => {
  let userArrayList = [];
  connection.query ('SELECT * FROM Users', function(err, results, fields) {
    let userList = JSON.parse(JSON.stringify(results));
    for(let i=0; i<userList.length; i++) {
      userArrayList.push(`${userList[i].id} || ${userList[i].email}`);
    }
    inquirer.prompt({
      type: 'list',
      name: 'oneUser',
      message: 'Which user\'s event(s) would you like to see?',
      choices: userArrayList
    }).then((res) => {
      let grabUserID = res.oneUser.split('||');
      let userID = grabUserID[0];
      let useremail = grabUserID[1];

      connection.query('SELECT Users.email, UE.event_id, Events.title FROM Users JOIN users_events AS UE ON Users.id = UE.user_id JOIN Events ON Events.id = UE.event_id WHERE UE.user_id = ?', [userID], function(err, results, fields) {

        if(err) throw err;
        let combineResult = JSON.parse(JSON.stringify(results));

        let eventsArray = [];
        for(let i=0; i<combineResult.length; i++){
          eventsArray.push(`${i+1}) ${combineResult[i].title}`);
        }
        let eventsList = eventsArray.join(" ");

        console.log(`${combineResult[0].email} is going to the following event(s): ${eventsList}` )

        continueCallback();
      })

    })
  })
}

app.seeUsersOfOneEvent = (continueCallback) => {
  let eventArrayList = [];
  connection.query('SELECT * FROM Events', function(err, results, fields) {
    let eventsList = JSON.parse(JSON.stringify(results));
    for(let i=0; i<eventsList.length; i++) {
      eventArrayList.push(`${eventsList[i].id} || ${eventsList[i].title}`);
    }
    inquirer.prompt({
      type: 'list',
      name: 'oneEvent',
      message: 'Select an event to see which user(s) are attending.',
      choices: eventArrayList
    }).then((res) => {
      let grabEventID = res.oneEvent.split('||');
      let eventID = grabEventID[0];

      connection.query('SELECT UE.event_id, Events.title, Users.email FROM Events JOIN users_events AS UE ON Events.id = UE.event_id JOIN Users ON UE.user_id = Users.id WHERE UE.event_id = ?', [eventID], function(err, results, fields){
        if(results.length === 0) {
          inquirer.prompt({
            type: 'confirm',
            name: 'noUsers',
            message: 'Sorry no users are attending this event :( Would you like to select another event?',
            default: false
          }).then((res) => {
            if(res.noUsers === true) {
              app.seeUsersOfOneEvent(continueCallback);
            } else {
              continueCallback();
            }
          })
        } else {
          let combineResult = JSON.parse(JSON.stringify(results));

          let userArray = [];
          for(let i=0; i<combineResult.length; i++) {
            userArray.push(`${i+1}) ${combineResult[i].email}`)
          }
          let usersList = userArray.join(" ");

          console.log(`Attending the "${combineResult[0].title}" event is/are: ${usersList}`)

          continueCallback();
        }
      })
    })
  })
}

module.exports = app;
