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
