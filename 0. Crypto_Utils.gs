/* generateHash()
  uses Utilties provided by Google Scripts
  password : string
  final1 : string
*/
function generateHash(password){

  let key1 = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, password);
  let res1 = Utilities.base64Encode(key1)
  let final1 = smallerString(res1);
  
  return final1;
}

/* smallerString()
  cleans/splits up resulting hash
  removes 'i' and 'I', for sanity purposes on forms :) 
  (easy to confused upcase I with 1 in certain font)
  curr : string
  res: string
*/
function smallerString(curr){
  let res = "";

  for(let i = 0; i < 6; i++){
    
    if(curr[i] == 'i' || curr[i] == 'I'){
      res += '1';
    }else{
      res += curr[i];
    }
       //resvole toUpperCase() Problem **********************************
  }

  return res.toUpperCase();
}
