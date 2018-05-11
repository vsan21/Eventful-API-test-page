const eventfulKey = require("./keys.js").eventful;
const eventful = require('eventful-node');
const client = new eventful.Client(eventfulKey);

const connection = require('./connection');

//sample search, try running it to see it in action
// client.searchEvents({
//   keywords: 'tango',
//   location: 'San Francisco',
//   date: "Next Week"
// }, function(err, data){
//    if(err){
//      return console.error(err);
//    }
//    let resultEvents = data.search.events.event;
//    console.log('Received ' + data.search.total_items + ' events');
//    console.log('Event listings: ');
//    for ( let i =0 ; i < resultEvents.length; i++){
//      console.log("===========================================================")
//      console.log('title: ',resultEvents[i].title);
//      console.log('start_time: ',resultEvents[i].start_time);
//      console.log('venue_name: ',resultEvents[i].venue_name);
//      console.log('venue_address: ',resultEvents[i].venue_address);
//    }
// });

function findEvents (keyword, callback) {
  // YOUR WORK HERE
  client.searchEvents({
    keywords: keyword,
    location: 'San Francisco',
    date: "Next Week"
  }, function(err, data){
     if(err){
       return console.error(err);
     }
     let resultEvents = data.search.events.event;
     console.log('Received ' + data.search.total_items + ' events');
     console.log('Event listings: ');

     //id is in an object {'$': {id: ....}, ....}
     // let newId = resultEvents[0].$.id;
     let newTitle = resultEvents[0].title;
     let newTime = resultEvents[0].start_time;
     let newVenue = resultEvents[0].venue_name;
     let newAddress = resultEvents[0].venue_address;

     let usersEvent = {
       // event_id: newId,
       title: newTitle,
       time: newTime,
       venue: newVenue,
       address: newAddress
     };

     // console.log('event_id: ', newId);
     console.log('title: ', newTitle);
     console.log('start_time: ', newTime);
     console.log('venue_name: ', newVenue);
     console.log('venue_address: ', newAddress);

     callback(usersEvent);
  });
}

//export a custom function that searches via Eventful API, displays the results AND stores some of the data into MySQL
module.exports = findEvents;
