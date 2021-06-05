// send AJAX request to backend
// once data received from backend, update table accordingly

document.addEventListener('DOMContentLoaded', bindButtons);
function bindButtons() {
    // display all rows of table
    displayAll();

    // when Add New button is clicked after adding new data
    document.getElementById('submitNew').addEventListener('click', function (event) {
        event.preventDefault();
        var req = new XMLHttpRequest();
        var payload = {
            name: null,
            reps: null,
            weight: null,
            date: null,
            lbs: null
        };
        payload.name = document.getElementById('nameInput').value;
        payload.reps = document.getElementById('repsInput').value;
        payload.weight = document.getElementById('weightInput').value;

        // convert user input(MM-DD-YYYY) to the valid format for MySQL database(YYYY-MM-DD)
        payload.date = document.getElementById('dateInput').value;
        if (payload.date) {
            var month = payload.date.slice(0, 2);
            var date = payload.date.slice(3, 5);
            var year = payload.date.slice(6, 10);
            payload.date = year + '-' + month + '-' + date;
        }
        payload.lbs = document.getElementById('lbsInput').value;

        if (payload.name) {
            var myURL = 'http://flip3.engr.oregonstate.edu:33122/?name=' + payload.name + '&reps=' + payload.reps + '&weight=' + payload.weight + '&date=' + payload.date + '&lbs=' + payload.lbs

            // send request using an asynchronous call via POST
            req.open('POST', myURL, false);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(payload));

            var response = JSON.parse(req.responseText);
            // call displayRows function to display       
            var rowNum = response.allData.length - 1;
            displayRows(response.allData, "dataTableBody", rowNum);
        }
    })
};

// function to display all rows of table
function displayAll() {
    // send get request to display all workouts list
    var req = new XMLHttpRequest();
    var myURL = 'http://flip3.engr.oregonstate.edu:33122/';
    req.open('GET', myURL, false);
    req.send(null);
    var response = JSON.parse(req.responseText);

    for (var i = 0; i < response.length; i++) {
        // call displayRows function to display each row
        displayRows(response, "dataTableBody", i);
    }
}

// funtion do delete a row with matching ID
function deleteRow(tableID, currentID) {
    var req = new XMLHttpRequest();
    var myURL = 'http://flip3.engr.oregonstate.edu:33122/?id=' + currentID;
    req.open('DELETE', myURL, false);
    req.send(null);

    var table = document.getElementById(tableID);
    for (var i = 1; i <= table.rows.length; i++) {
        var row = table.rows[i];
        if (row.id == currentID) {
            table.deleteRow(i);
            return;
        }
    }
}

// function to select a row with matching ID and display it in an edit table
function editRow(tableID, currentID) {
    // if there is a row editting, print error
    if (document.getElementById("editTableContainer").style.display == "block") {
        document.getElementById("warning").style.display = "block";
        return;
    }
    document.getElementById("warning").style.display = "none";
    var req = new XMLHttpRequest();
    var myURL = 'http://flip3.engr.oregonstate.edu:33122/?id=' + currentID;
    req.open('GET', myURL, false);
    req.send(null);

    // display the selected row 
    var response = JSON.parse(req.responseText);
    var table = document.getElementById(tableID);
    for (var i = 0; i <= table.rows.length; i++) {
        var row = table.rows[i];
        if (row.id == currentID) {
            displayEditRow(response, "editTableBody", 0);
            return;
        }
    }
}

// function to display each row of the table
function displayEditRow(response, tableBodyId, i) {
    // change display style to make the edit table to appear
    document.getElementById("editTableContainer").style.display = "block";
    var tableBody = document.getElementById(tableBodyId);
    var row = tableBody.insertRow(i);

    // keep track of hidden id by adding row id
    row.setAttribute("id", response[i].id);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);

    // creating input forms with default values loaded from the selected row
    cell1.innerHTML = '<td><input type="text" name="name" id="nameEdit" value=\"' + response[i].name + '\"></td>';
    cell2.innerHTML = '<td><input type="number" name="Reps" id="repsEdit" value=\"' + response[i].reps + '\"></td>';
    cell3.innerHTML = '<td><input type="number" name="weight" id="weightEdit" value=\"' + response[i].weight + '\"></td>';
    // convert data form to MM-DD-YYYY
    if (response[i].date) {
        var year = response[i].date.slice(0, 4);
        var month = response[i].date.slice(5, 7);
        var date = response[i].date.slice(8, 10);
        cell4.innerHTML = '<td><input type="text" name="date" id="dateEdit" value=\"' + month + '-' + date + '-' + year + '\"></td>';
    }
    cell5.innerHTML = '<td><input type="text" name="lbs" id="lbsEdit" value=\"' + response[i].lbs + '\"></td>';

    // insert update, cancel buttons for each row
    // add the hidden id into onclick event attribute to keep track
    cell6.innerHTML = '<button id="updateButton" class="button" name="update" onclick="updateRow(\'dataTable\',' + response[i].id + ')">Update</button>';
    cell7.innerHTML = '<button id="cancelButton" class="button" name="cancel" onclick="cancelRow(\'editTable\',' + response[i].id + ')">Cancel</button>';
}

// updating MySQL data and update the main table to reflect the change
function updateRow(tableID, currentID, e) {
    var req = new XMLHttpRequest();
    var payload = {
        name: null,
        reps: null,
        weight: null,
        date: null,
        lbs: null
    };
    payload.name = document.getElementById('nameEdit').value;
    payload.reps = document.getElementById('repsEdit').value;
    payload.weight = document.getElementById('weightEdit').value;
    // convert user input(MM-DD-YYYY) to the valid format for MySQL database(YYYY-MM-DD)
    payload.date = document.getElementById('dateEdit').value;
    if (payload.date) {
        var month = payload.date.slice(0, 2);
        var date = payload.date.slice(3, 5);
        var year = payload.date.slice(6, 10);
        payload.date = year + '-' + month + '-' + date;
    }
    payload.lbs = document.getElementById('lbsEdit').value;

    if (payload.name) {
        var myURL = 'http://flip3.engr.oregonstate.edu:33122/?name=' + payload.name + '&reps=' + payload.reps + '&weight=' + payload.weight + '&date=' + payload.date + '&lbs=' + payload.lbs + '&id=' + currentID;

        // send request
        req.open('PUT', myURL, false);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(payload));
        // var response = JSON.parse(req.responseText);

        // delete table and redisplay the table to reflect the change
        deleteTable("dataTable");
        displayAll();

        // delete the edit section
        cancelRow("editTable", currentID);
    }
    // prevent page refresh
    e = e || window.event;
    e.preventDefault();
}

// delete all rows of a table
function deleteTable(tableID) {
    // delete a row
    var table = document.getElementById(tableID);
    for (var i = 0; i <= table.rows.length * 10; i++) {
        if (table.rows.length <= 1) {
            return;
        }
        table.deleteRow(1);
    }
}

// function to cancel editting
function cancelRow(tableID, currentID) {
    // hide editTable template
    document.getElementById("editTableContainer").style.display = "none";
    // delete a row with matching id
    var table = document.getElementById(tableID);
    for (var i = 1; i <= table.rows.length; i++) {
        var row = table.rows[i];
        if (row.id == currentID) {
            table.deleteRow(i);
            return;
        }
    }
}

// function to display a table row
function displayRows(response, tableBodyId, i) {
    var tableBody = document.getElementById(tableBodyId);
    var row = tableBody.insertRow(i);

    // keep track of hidden id by adding row id
    row.setAttribute("id", response[i].id);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);

    cell1.innerHTML = response[i].name;
    cell2.innerHTML = response[i].reps;
    cell3.innerHTML = response[i].weight;
    // convert date format to MM-DD-YYYY
    if (response[i].date) {
        var year = response[i].date.slice(0, 4);
        var month = response[i].date.slice(5, 7);
        var date = response[i].date.slice(8, 10);
        cell4.innerHTML = month + '-' + date + '-' + year;
    }
    cell5.innerHTML = response[i].lbs;

    // insert edit, delete buttons for each row
    // add the hidden id into onclick event attribute to keep track
    cell6.innerHTML = '<button id="editButton" class="button" name="edit" onclick="editRow(\'dataTable\',' + response[i].id + ')">Edit</button>';
    cell7.innerHTML = '<button id="deleteButton" class="button" name="delete" onclick="deleteRow(\'dataTable\',' + response[i].id + ')">Delete</button>';
}
