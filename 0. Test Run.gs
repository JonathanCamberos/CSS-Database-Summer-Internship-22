function generateAllPasswords(){

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let passwordSheet = ss.getSheetByName("Hash Sheet");

  let rows = passwordSheet.getLastRow();

  let uidList = passwordSheet.getRange(8, 1, rows-7, 1).getValues();

  let uidList1D = transform2D(uidList);

  uidList1D.map(function(currUid){
    testSaveHash(currUid);
  })

}

function testSaveHash(currUid){
  //let currUid = 115402171;
  let password = "CSS2022";

  //Generates Hash based on "uid + password" as a string
  //Places Hash in "Hash Sheet" ss
  //generateHash() - found in Crypto_Utils.gs
  
  let hashResult = generateHash(currUid + password)
  placeHash(currUid, hashResult);

}
