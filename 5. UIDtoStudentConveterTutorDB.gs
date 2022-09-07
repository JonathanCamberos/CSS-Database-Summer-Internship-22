function UIDtoStudentConverterTutorDB() {

  //gets hold of both required sheets for this code
  let TutorDatabaseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tutor Database");
  let sdSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("StudentInfoDatabase");

  //creates an array of the UID's of present scholars in CSS
  let uid2D = sdSheet.getRange(27,1,sdSheet.getLastRow()).getValues();
  let uid1D = transform2D(uid2D);

  let startingRow = 3; //can change this manually to reduce the runtime

  //for loop that traverses the rows in order to convert their UID to their first and last name
  for(var index = startingRow; index <= TutorDatabaseSheet.getLastRow(); index++) {

    //if there is no last name (meaning that the row does not have a complete entry) or a wrong entry, we add information to the columns
    if(TutorDatabaseSheet.getRange(index,7).isBlank() || TutorDatabaseSheet.getRange(index,7).getValue() == "WRONG UID ENTERED") {

    //grabs the entry data (scholar UID), and returns the index of the row in the student database
      let scholarUID = TutorDatabaseSheet.getRange(index,5).getValue();
        
      //conditional to check if the user entered the wrong UID (since we have all the correct student UID's in the array)
      if(uid1D.indexOf(scholarUID) != -1) {

        //the database has 27 scholars that are not present anymore in CSS, + 27 in order to keep good indexing
        let rowIndex = uid1D.indexOf(scholarUID) + 27;

        //grabs the scholar's first and last name based on the index, goes back to the traffic log, and prints out the values next to the entry
        let scholarLastName = sdSheet.getRange(rowIndex,2).getValue();
        let scholarFirstName = sdSheet.getRange(rowIndex,3).getValue();

        TutorDatabaseSheet.getRange(index,6).setValue(scholarFirstName);
        TutorDatabaseSheet.getRange(index,7).setValue(scholarLastName);

      } else {
        TutorDatabaseSheet.getRange(index,6).setValue("WRONG UID ENTERED");
        TutorDatabaseSheet.getRange(index,7).setValue("WRONG UID ENTERED");
      }
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
