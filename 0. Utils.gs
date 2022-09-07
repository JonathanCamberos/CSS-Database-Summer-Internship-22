const databaseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database") || SpreadsheetApp.getActiveSpreadsheet().getSheets()[1];
const lastScholarRow = databaseSheet.getLastRow();
const firstWeekDatabase = { row: 4, column: 13 };
const lastCol = databaseSheet.getLastColumn();
const scholarInfo = initScholarInfo();

//IMRANS VARIABLES
const num_Freshmen = 41;
const num_Sophomores = 37;
const num_TLs = 42;

//called from const scholarInfo
//returns a 1-d array of Scholar objects, with accessabe firstNames, returnedValue[1].firstName, etc
function initScholarInfo() { 
    const values = databaseSheet.getRange(firstWeekDatabase.row, 1, lastScholarRow - firstWeekDatabase.row + 1, 11).getValues();
    return values;
}

//helper to transform 2D array into 1D array
//assuming each row only has 1 column -> s[0]
function transform2D(arr){

  let res = arr.map(function(currRow){
    return currRow[0];
  });
  return res;

}

//helper to transform 1D array into 2D array
//result will return rows with only 1 column -> s[0][0], s[1][0]
function transform1D(arr){

  let res = arr.map(function(currRow){
    return [currRow];
  });
  return res;

}

//returns new array of certain size filled with 0's
//since google scripts does not have java method new Array(){0, 0, 0};
function newSizeArray(size){
  let res = [];
  for(let i = 0; i < size; i++){
    res.push(0);
  }
  return res;
}

function newSize2DArray(size){
  let res = [];
  for(let i = 0; i < size; i++){
    res.push([-1]);
  }
  return res;
}

//helper to print 1D array since print.getRange(1,1, 1, arr.length).setValues(arr), does not work since requires at least 2 rows
function print1D(arr, row, col, print){
  print.getRange(3,4).setValue(typeof(arr[0]));

  arr.map(function(curr, index){
    print.getRange(row, col+index).setValue(curr);

  });

}


//update with "some" array function later
function arraysEqual(some, key){
  let test = true;
  key.map(function(currItem){
    if(some.indexOf(currItem) == -1){
        test = false;
    }
  })
  return test;
}

//returns scholar object from the row number inserted into the parameter
function getScholarInformation(currScholarRow) {
  return {
      uid: databaseSheet.getRange(currScholarRow, 1).getValue(),
      lastName: databaseSheet.getRange(currScholarRow, 2).getValue(),
      firstName: databaseSheet.getRange(currScholarRow, 3).getValue(),
      nickName: databaseSheet.getRange(currScholarRow, 4).getValue(),
      teamLeader: databaseSheet.getRange(currScholarRow, 5).getValue(),
      gradAssistant: databaseSheet.getRange(currScholarRow, 6).getValue(),
      role: databaseSheet.getRange(currScholarRow, 7).getValue(),
      hotListStatus: databaseSheet.getRange(currScholarRow, 8).getValue(),
      frontDeskReq: databaseSheet.getRange(currScholarRow, 9).getValue(),
      studySessionReq: databaseSheet.getRange(currScholarRow, 10).getValue(),
      menteeNum: databaseSheet.getRange(currScholarRow, 11).getValue(),
      cohort: databaseSheet.getRange(currScholarRow, 12).getValue(),
  };
}
