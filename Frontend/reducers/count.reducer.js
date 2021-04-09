export default function(count = 0, action) {
    if(action.type == 'INCREASE_COUNT') {
       var newCount = count + 1;
       console.log("count redux", newCount);
       return newCount;
     } else if(action.type == 'DECREASE_COUNT') {
        var newCount = count - 1;
        if(newCount<0){
           newCount = 0;
        }
        console.log("count redux", newCount);
       return newCount;
      } else {
         return count
     }
  }