var sheetRange = databaseSheet.getRange(4, 1, lastScholarRow - 3, lastCol);
// var scholars = initScholarInfo();

function sortScholars() {
  sheetRange.sort({column: 1, ascending: true});
}

//BINARY SEARCH (it works)
//returns a scholar object

function searchFor(scholarRow) {
  let low = 4; 
  let high = lastScholarRow;

  sortScholars();
  let uidArray = databaseSheet.getRange(4, 1, lastScholarRow - 3).getValues();

  while (low <= high) {

    let currRow = low + Math.floor((high - low) / 2); 
    let currUID = databaseSheet.getRange(currRow, 1).getValue();
    let targetUID = uidArray[scholarRow - 4][0];

    if (currUID < targetUID) {  //this is where im having the issue
      low = currRow + 1;
    } else if (currUID > targetUID) {
      high = currRow - 1;
    } else {
      return getScholarInformation(currRow);
    }
  }

//if the code ever steps outside the loop then the scholar was never found
return "this dude aint even in the system";

}

function test() {
    Logger.log(searchFor(164));
}
