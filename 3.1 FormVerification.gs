function myFunction() {
  
  let ss = SpreadsheetApp.getActiveSpreadsheet(); //gets hold of main spreadsheet
  let sheetOne = ss.getSheetByName('Database');   //gets hold of the database sheet
  let sheetTwo = ss.getSheetByName('WAHF Form');   //gets hold of the L1. WAHF sheet
  let sheetThree = ss.getSheetByName('MCF Form');  //gets hold of the L2. MCF sheet

  let weekCounter = 1; //let's us keep track of what week we're on for school, have to manually change it
  let wahfColumn = 14 + (weekCounter - 1) * 9; //depending on the week, the column for the wahf can change in the database sheet
  let uidColumn = 1; //the column of the scholar's UIDs
  let teamLeaderColumn = 4; //the column of each scholar's team leader
  let startRow = 3; //the index of the first entry for WAHFs on a specific week (in the L1. WAHF sheet), will have to manually change
  let endRow = 77;  //the index of the last entry for WAHFs on a specific week (in the L1. WAHF sheet), will have to manually change

  //gets all the scholars WAHFs, TLs, and UIDs from their respective columns and makes a 2D array for each one
  let wahfList = sheetOne.getRange(147,wahfColumn, sheetOne.getLastRow()).getValues();
  let teamLeaderList = sheetOne.getRange(147,teamLeaderColumn,sheetOne.getLastRow()).getValues();
  let uidList = sheetOne.getRange(147,uidColumn,sheetOne.getLastRow()).getValues();

  //transforms the 2D array of the scholar's WAHFs, TLs, and UIDs and converts them into a 1D array
  let wahfList1D = transform2D(wahfList);

  //creates a new 1D array that has all the timestamps of the WAHFS (use the getTime() function, etc...)
  let tlList1D = transform2D(teamLeaderList);
  let uid1D = transform2D(uidList);

  
  //gets the WAHF entries for a specific week, and transforms it into a 1D array
  let timeWAHF2D = sheetTwo.getRange(3,4,endRow - startRow).getValues();
  let timeWAHF1D = transform2D(timeWAHF2D);

  //gets the MCF entries for a specific week, and transforms it into a 1D array
  let mcf2D = sheetThree.getRange(3,7,endRow - startRow).getValues();
  let mcf1D = transform2D(mcf2D);
  //Logger.log(mcf1D);


  let arr = []; //array is created to store FINAL data

  //an array is being created to store the actual time of the WAHF entries
  let actualWAHFTime = timeWAHF1D.map(function(currTimeStamp) {
    let x = getActualTime(currTimeStamp);
    return x;
  });

  
  

  
  uid1D.map(function(currentUID, index) { //traverses through the scholar's UIDs
      if(tlList1D[index] != "" && getForm(currentUID,sheetOne,uid1D) == "WAHF") { //if the scholar has a team leader
        let teamLeader = tlList1D[index];

        if(wahfList1D[index] != "N/A" && wahfList1D[index] != "Not found") { //if the scholar also submitted their WAHF
          
          //another function operates in order to put data into the final array
          arr.push(validScholar(currentUID,sheetOne,sheetTwo,sheetThree,wahfList1D[index],uid1D,actualWAHFTime,mcf1D,teamLeader));
        } else {

          arr.push(getName(uid1D[index],uid1D,sheetOne) + " did not submit their WAHF");

        }

      }

  })

  

  Logger.log(arr);
}


function validScholar(currentUID, firstSheet, secondSheet, thirdSheet, timeStamp, uid1D, wahfArray1D, mcfArray1D,teamLeader) {

    //gets the time of the WAHF entry
    let timeStampDate = new Date(timeStamp); 
    let time = timeStampDate.getTime();

    //gets the index of the row that the specific timestamp is located in
    let specificScholar = wahfArray1D.lastIndexOf(time) + 1;
    //Logger.log(specificScholar);

    if(specificScholar - 3 == -1) {
      return getName(currentUID,uid1D,firstSheet) + "did not submit their " + getForm(currentUID,firstSheet,uid1D) + " at all";
    }

    let scholarName = secondSheet.getRange(specificScholar,17).getValue(); //gets the scholar's name based on the row 

    if(scholarName != getName(currentUID,uid1D,firstSheet)) {
      scholarName = getName(currentUID,uid1D,firstSheet);
    }

    //Logger.log(scholarName);

    let metWithTL = secondSheet.getRange(specificScholar, 4).getValue();  //checks to see if the scholar met with their TL
    //Logger.log(metWithTL);
    

    //if the scholar did meet with their TL
    if(metWithTL == "Yes") {

      let output = wasMetWith(currentUID,thirdSheet,mcfArray1D); //stores a value that determines if mentee met with mentor (vice-versa)

      //goes into another method to determine if the mentor did meet with their mentee
      if(output == currentUID + " did not do their WAHF this week") {

        //Logger.log("hello world");
        return getName(currentUID,uid1D,firstSheet);

      } else if(output != -1) { //if the value is positive (i.e. they both met with each other)

        //Logger.log("hi");
          
          return scholarName + " met with " + teamLeader; //returns that the scholar met with their team leader

      } else { //if the value is negative (i.e. they did not meet with each other)

        return getName(currentUID,uid1D,firstSheet) + " did not meet with TL"; //returns that the scholar did not meet with their team leader

      }

    } else { //if the scholar didn't meet with their TL
        return getName(currentUID,uid1D,firstSheet) + " did not meet with TL";
    }

}



function wasMetWith(currUid,thirdSheet, mcfArray1D){

  //finds the row number of the scholar's uid in the MCF array
  let specificScholar = mcfArray1D.lastIndexOf(currUid) + 1;
  

  if(specificScholar == -1) { //if the scholar's uid isn't there (meaning that they either typed their uid wrong or didn't submit their wahf)
    return currUid + " did not do their WAHF this week";
  }

  let metWithMentee = thirdSheet.getRange(specificScholar,5).getValue(); //finds to see whether or not they met

  if(metWithMentee != "Did not Meet") { //if they did meet

    return specificScholar; //returns the row of the scholar's uid
  }
  return -1 ; //else it returns a negative number showing that they did not meet

}
