var express = require('express');
var router = express.Router();

var UserModel = require('../models/users')
var MessagesModel = require('../models/messages')
var ConversationsModel = require('../models/conversations')

router.get('/change_avatar', async function (req, res, next) {

  var imgAvatarSrc = [
    'https://i.imgur.com/Xqf1Ilk.png',
    'https://i.imgur.com/w9g1N3c.png',
    'https://i.imgur.com/lbx9ygk.png',
    'https://i.imgur.com/Fl632zM.png',
    'https://i.imgur.com/uC9E6zE.png',
    'https://i.imgur.com/FbL66Lc.png',
    'https://i.imgur.com/3X0bsrQ.png',
  ]
  
  var users = await UserModel.find()
  console.log(users)
  users.forEach(async u => {
    let i = Math.floor(Math.random() * imgAvatarSrc.length)
    console.log(i)
    
    await UserModel.updateOne(
      { _id: u._id},
      {
        avatar: imgAvatarSrc[i]
      })
  });

})


router.get('/random-users', async function (req, res, next) {

  var users = ["Tony", "Matteo", "Maud", "Ines", "Jeremy", "Antoine", "Emeline", "Zoe", "Alan", "Alexis", "Maelle", "Lena",
    "Mathias", "Theo", "Victoire", "Anais", "Aaron", "Louis", "Lise", "Anais", "Jean", "Nicolas", "Ninon"]
  var date = ["1985-02-01", "1987-03-02", "2000-07-03", "1999-02-04", "1976-08-30"]

  var desc = [
    'Praesent et nulla leo. Nam non interdum risus. In venenatis efficitur sem sit amet dictum. Etiam feugiat lacus non odio malesuada, et eleifend ligula hendrerit. Aenean condimentum risus vel iaculis lobortis. Sed venenatis dolor ut sapien pellentesque tempus. Sed id ipsum nibh.',
    'Fusce quis dolor varius, auctor felis at, bibendum velit. Sed in bibendum enim. Pellentesque consectetur, lacus ultrices porta venenatis, tellus lorem faucibus ex, id dapibus quam lorem sit amet lacus. Integer vel nisi venenatis, luctus lacus id, ultrices ex. Proin convallis dui risus.',
    'Sed viverra est orci, at luctus nibh elementum fermentum. Phasellus leo diam, eleifend non facilisis non, cursus scelerisque orci. Proin at lectus ornare, dapibus purus sit amet, mollis dui. ',
    'Nulla pulvinar nulla ac justo eleifend laoreet. Nulla sed enim metus. Quisque cursus quam venenatis finibus aliquam. ',
    'Donec egestas nibh vehicula risus pulvinar interdum. Maecenas ultricies lacus quis lacus feugiat tempus.',
  ]

  var count = 8

  // Save  ---------------------------------------------------
  for (var i = 0; i < count; i++) {

    randomUsers = users[Math.floor(Math.random() * Math.floor(users.length))]
    randomBirthday = date[Math.floor(Math.random() * Math.floor(users.length))]
    randomDesc = desc[Math.floor(Math.random() * Math.floor(users.length))]

    var doesUserNameExist = await UserModel.findOne({ pseudo: randomUsers })

    if (doesUserNameExist.length === 0) {

      var newUser = new UserModel({
        email: randomUsers + '@gmail.com',
        password: 'azerty',
        pseudo: randomUsers,
        birthDate: randomBirthday,
        is_adult: true,
        problems_types: ['mon problème'],
        problem_description: randomDesc,
        localisation: randomUsers,
        gender: Math.random() > .5 ? 'male' : 'femelle',
        avatar: 'women' + Math.ceil(Math.random() * 8) + '.png',
        statut: 'statut',
        blocked_user_id: 'blocked_user_id',
        blocked_by_id: 'blocked_by_id',
      });

      let s = await newUser.save();
      console.log('s = ', s)
    }
  }
  res.render('index', { title: 'Save users' });
});


router.get('/random-conversations', async function (req, res, next) {

  var users = await UserModel.find()

  var one = users.splice(Math.floor(Math.random() * users.length), 1)
  var two = users.splice(Math.floor(Math.random() * users.length), 1)

  var conv = await new ConversationsModel({
    participants: [one[0]._id, two[0]._id]
  })

  let convSave = await conv.save()
  console.log('convSave = ', convSave)

  res.render('index', { title: 'Save conversations' });
})

router.get('/random-msg', async function (req, res, next) {

  var conv = await ConversationsModel.find()

  var oneConv = conv.splice(Math.floor(Math.random() * conv.length), 1)[0]

  // console.log(one[0]._id)
  console.log(oneConv)

  var msgRandom = [
    'pellentesque tempus. Sed id ipsum',
    'ultrices ex. Proin convallis dui ',
    'dapibus purus sit amet, mollis',
    'Quisque cursus quam venenatis finibus ali',
    'ultricies lacus quis lacus feugiat t',
    's efficitur sem sit amet',
    'Sed in bibendum enim',
    'Phasellus leo diam,',
    'enim metus. Quisque',
    'nas ultricies lacus quis lacus',
  ]

  for (let i = 0; i < 10; i++) {


    let who1 = Math.random() > .5 ? oneConv.participants[0] : oneConv.participants[1]
    let who2 = who1 === oneConv.participants[0] ? oneConv.participants[1] : oneConv.participants[0]

    var newMsg = new MessagesModel({
      conversation_id: oneConv._id,
      from_id: who1,
      to_id: who2,
      content: msgRandom[Math.floor(Math.random() * msgRandom.length)],
      read_user_id1: false,
      read_user_id2: false,
      date: new Date(),
      delete_user_id1: false,
      delete_user_id2: false,
    })
    let msg = await newMsg.save()
    console.log('msg = ', msg)

  }


  res.render('index', { title: 'Save messages between 2 users' });
})


module.exports = router;