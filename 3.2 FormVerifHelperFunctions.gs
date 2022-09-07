function getName(currentUID, arr, sheet) {
  let row = arr.lastIndexOf(currentUID) + 128;
  if(row - 128 == -1) {
    return "WRONG UID ENTERED";
  }
  let firstName = sheet.getRange(row,3).getValue();
  let lastName = sheet.getRange(row,2).getValue();

  return lastName + ", " + firstName;
}

function transformTimeTo1D(arr) {

  let wahf = [];

    arr.map(function(timeStamp) {
      let wahfTime = new Date(timeStamp);
      let x = wahfTime.getTime();
      wahf.push(x);
    }) 
    return wahf;
}

function getActualTime(timeStamp) {
  let time = new Date(timeStamp);
  let x = time.getTime()
  return x;
}

function getForm(id,sheet,arr) {
  
    let row = arr.lastIndexOf(id);
    let role = sheet.getRange(row + 128,6).getValue();
    if(role != "Scholar") {
      return "MCF";
    } else {
      return "WAHF";
    }

}

function getMentorLastName(sheet,index) {
  return sheet.getRange(index,1).getValue();
}

//helper to transform 2D array into 1D array
//assuming each row only has 1 column -> s[0]
function transform2D(arr){

  let res = arr.map(function(currRow){
    return currRow[0];
  });
  return res;

}
