export default function(user = {}, action) {
     if(action.type === 'ADD_USER') {
        var newInfo = action.payload
        console.log(newInfo, '<------ user on store')
        return newInfo;
      } if(action.type === 'ADD_PROBLEM') {
        var newInfo = {...user, problem_description: action.problem}
        console.log("action.problem", newInfo)
        return newInfo;
      } if(action.type === 'ADD_LOCALISATION') {
        var newInfo = {...user, localisation: action.localisation}
        console.log("action.localisation", newInfo)
        return newInfo;
      } if(action.type === 'ADD_GENDER') {
        var newInfo = {...user, gender: action.gender}
        console.log("action.gender", newInfo)
        return newInfo;
      } if(action.type === 'ADD_AVATAR') {
        var newInfo = {...user, avatar: action.avatar}
        console.log("action.avatar", newInfo)
        return newInfo;
      } else {
          return user
      }
   }