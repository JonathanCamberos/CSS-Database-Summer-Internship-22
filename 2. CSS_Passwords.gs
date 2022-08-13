/*CSS_Passwrod Functions 8/10/22:
  Update/clean up "Hash Sheet" spreadsheet
*/


/* saveHash()
   Creates hash for scholar, based on given password
 */
function saveHash(){
  let currUid = 115402171;
  let password = "hello";

  //Generates Hash based on "uid + password" as a string
  //Places Hash in "Hash Sheet" ss
  //generateHash() - found in Crypto_Utils.gs
  
  let hashResult = generateHash(currUid + password)
  placeHash(currUid, hashResult);

}

function placeHash(uid, hash){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let passwordSheet = ss.getSheetByName("Hash Sheet");
  let print = ss.getSheetByName("Ready Print");

  let rows = passwordSheet.getLastRow();

  let uidList = passwordSheet.getRange(8, 1, rows-7, 1).getValues();
  
  let uidList1D = transform2D(uidList);
  
  let uidIndex = uidList1D.indexOf(uid);

  passwordSheet.getRange(8+uidIndex, 2).setValue(hash);

}
