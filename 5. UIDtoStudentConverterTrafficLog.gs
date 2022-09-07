function TrafficLogUIDConverterTrafficLog() {

  //gets hold of both required sheets for this code
  let newTrafficLogSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Traffic Log");
  let sdSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("StudentInfoDatabase");
  let numofCompleteEntries = 0;
  

  //creates an array of the UID's of present scholars in CSS
  let uid2D = sdSheet.getRange(27,1,sdSheet.getLastRow()).getValues();
  let uid1D = transform2D(uid2D);

  var startingRow = 7; //can change this manually to reduce the runtime


  //for loop that traverses the rows in order to convert their UID to their first and last name
  for(var index = startingRow; index <= newTrafficLogSheet.getLastRow(); index++) {

    //if there is no last name (meaning that the row does not have a complete entry) or a wrong entry, we add information to the columns
    if(newTrafficLogSheet.getRange(index,4).isBlank() || newTrafficLogSheet.getRange(index,4).getValue() == "WRONG UID ENTERED") {

    //grabs the entry data (scholar UID), and returns the index of the row in the student database
      let scholarUID = newTrafficLogSheet.getRange(index,6).getValue();
        
      //conditional to check if the user entered the wrong UID (since we have all the correct student UID's in the array)
      if(uid1D.indexOf(scholarUID) != -1) {

        //the database has 27 scholars that are not present anymore in CSS, + 27 in order to keep good indexing
        let rowIndex = uid1D.indexOf(scholarUID) + 27;

        //grabs the scholar's first and last name based on the index, goes back to the traffic log, and prints out the values next to the entry
        let scholarLastName = sdSheet.getRange(rowIndex,2).getValue();
        let scholarFirstName = sdSheet.getRange(rowIndex,3).getValue();

        newTrafficLogSheet.getRange(index,5).setValue(scholarFirstName);
        newTrafficLogSheet.getRange(index,4).setValue(scholarLastName);

        //grabs the new complete entry and adds one to the total of complete entries
        numofCompleteEntries++;
        newTrafficLogSheet.getRange(5,2).setValue(numofCompleteEntries);
        
      } else {
        newTrafficLogSheet.getRange(index,5).setValue("WRONG UID ENTERED");
        newTrafficLogSheet.getRange(index,4).setValue("WRONG UID ENTERED");
      }

    } else {

      //if there is already a complete entry, adds one to the counter and updates the value on the sheet

      numofCompleteEntries++;
      newTrafficLogSheet.getRange(5,2).setValue(numofCompleteEntries);
    }

  }

}

//helper to transform 2D array into 1D array
//assuming each row only has 1 column -> s[0]
function transform2D(arr){

  let res = arr.map(function(currRow){
    return currRow[0];
  });
  return res;

}



function test() {
  Logger.log("Hello there");

}
