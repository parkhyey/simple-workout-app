# simple-workout-app

This is a simple database backed website that features Ajax interaction. 
Below is a handler to set up the database table. It contains all the fields needed to make a simple workout tracker.
app.get('/reset-table',function(req,res,next){
  var context = {};
  [your connection pool].query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    [your connection pool].query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

name - the name of the exercise
reps - the number of times the exercise was performed
weight - the weight of the weights used
date - the date the exercise was performed (in the format of Month-Day-Year, e.g., 05-25-2018)
unit -  indicating if the measurement is in lbs or kg

# Requirements
This is a single page application with the following functionality:

Visiting the page will show a table displaying all completed exercises. 
The header lists all the columns (id must not be displayed in the header or in the table itself. Use hidden inputs to keep track of the id).

At the top of the page there should be a form that let user enter in all the data needed to make a new entry in the table with a button to submit it. 
Hitting that button should add the row to the table if it was successfully added to the database. If it was not successfully added (probably because name was left blank and it is required) it should not add it to the table.
Each row should have two buttons. One to delete the row and one to edit the row. 
Hitting the delete button should immediately remove the row from the table and from the database.
Hitting the edit button should make it possible to edit the data. The form to edit the exercise should be pre-populated with the existing data from that row.
That form should also have an input of type="hidden" which holds the id of the row so you can easily pass that information to the server to delete or update the row.

All interactions, other than updating an exercise, should happen via Ajax. 
This means that at no time should the page refresh. Instead, Ajax calls should be used to GET or POST to the server and it should use the data the server provides to update the page. 

Here is an example: http://jsfiddle.net/GRgMb/

If you hit delete on one of those rows it gets deleted without the page refreshing. 
Your page should do this and it should update the database at the same time to reflect the deleted data. 
It should essentially happen in reverse when you add a row. You hit add and the table is populated with a new row.

For the "single page", it means only one URL should be used for both types of requests. 
In the server-side code, you will write two to four methods, all of which use the same URL. 
1) app.get('/',..........)
2) app.post('/',..........)
3) app.put('/',..........)
4) app.delete('/',..........)
Properly implementing the viewing, editing, adding and deleting of data.


# Helpful Suggestions
In this assignment, you need to implement both frontend and backend. Implement your own API to manipulate MySQL. 
Generally, HTML, CSS, and JavaScript for HTML are frontend and they run in the browser and provide a UI for the webpage. 
Node.JS and MySQL are backends. Because Ajax allows the web page to be updated asynchronously, it is a frontend technology.

The data flow should look like the following.
Request: Ajax -> Node Server -> MySQL
Respond: mySQL -> Node Server -> Ajax
 
Returning Data From The Database
Because the interactions should be handled via Ajax, you often only want the database to send back an updated version of the table, not a whole new page. 
If you go back to the very first example with Express.js, you will see an example where we return plain text rather than HTML in a fancy Handlebars template. You can use this same technique to return a simple JSON string (which conveniently is what is shown being displayed in the MySQL demos). Just send that back to the browser in response to an Ajax request and build a table using it rather than generating the HTML on the server.
You could even do this when you make the page initially (i.e. not use Handlebars at all, which is my recommendation). Just have JavaScript make an Ajax request when the page is loaded to get the JSON representing the table. You never even need to build a table on the server that way.

Including JavaScript
Include static JavaScript files just like statics CSS files. e same thing to link static client side JS files.
