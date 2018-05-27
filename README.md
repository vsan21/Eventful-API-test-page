# Eventonica

**_Tools:_** Node, [Inquirer](https://github.com/SBoudrias/Inquirer.js), [MySQL](https://github.com/mysqljs/mysql), [Eventful API](http://api.eventful.com/), [Eventful Node](https://www.npmjs.com/package/eventful-node).

**_Project instruction outline:_** https://github.com/Techtonica/curriculum/blob/master/projects/project-four-point-five.md

Eventonica is an interactive event search command-line application. Features include: 
  * Creating a new user 
  * Searching for events through Eventful
  * Ability to store into the database the events they would like to attend
  * Retrieve information on all the events that **_one user_** will be attending 
  * Retrieve information on all the users that will be attending **_one particular event_**
  
![application image](https://github.com/vsan21/Eventful-API-test-page/blob/master/images/application.png)

![search image](https://github.com/vsan21/Eventful-API-test-page/blob/master/images/search.png)
  
---
### MySQL Database Setup: 
1. Install mysql. If you have brew, run `brew install mysql`, then start with `brew services start mysql` (otherwise you can download [MySQL](https://dev.mysql.com/doc/refman/5.6/en/osx-installation-pkg.html)) 
1. Download [Sequel Pro](http://www.sequelpro.com/)
2. Open `Sequel Pro`, and enter the following to establish a connection: 

    ```
    Host: 127.0.0.1
    Username: root
    ```
3. Create a new database named `eventonica`
4. Within the `mapjourney` database, create three tables: `Users`, `Events`, `users_events`

    - In `Users` table, add these columns: `first_name` (VARCHAR), `last_name` (VARCHAR), `email` (VARCHAR)
    - In `Events` table, add these columns: `title` (VARCHAR), `time` (TIMESTAMP), `venue` (VARCHAR), `address` (VARCHAR)
    - In `users_events` table, add these columns: `user_id` (INT, FK), `event_id` (INT, FK)

---
### Application Setup:
1. Go onto your desktop and then clone this repo to your local machine

    `cd desktop` and `git clone https://github.com/vsan21/Eventful-API-test-page.git`

2. Go into that project folder

    `cd Eventful-API-test-page`
    
3. Create an keys file

    `touch keys.js` 

4. Inside of the keys.js file, add: 
    
     ```javascript
     module.exports = {
        "eventful": <Your-Eventful-API-key>,
        "mySql": ""
     };
     ```
5. Install all dependencies

    `npm install`
    
6. Run `node index.js` (this will start the application) 
    
