const express = require('express');
const router = express.Router();

var { User, Address, User_Address, Address_User} = require("../models.js");


router.get('/users/:userId/addresses/coordinates/', function (req, res) {
	let userId = req.params.userId;

	getById(User, userId).then(function(user) {
		user.getAddresses().then(function(addresses) {

			//what to do about multiple addresses? have a "current" tag?
			res.json({latitude: addresses[0].latitude,
					longitude: addresses[0].longitude});
		})
	});
});

router.get('/addresses/users', function(req, res){
	Address.findAll({
		include: [
			{
				model: User
			}
		]
	}).then(address => res.json(address))
})

// 	// Address.findAll({
// 	// 	include: [{
// 	// 		model: [user]
// 	// 	}]
// 	// }).then(function(addresses) {
// 	// 	res.json(addresses);
// 	// });

// // function getById(model, id) {
// // 	return model.findOne({
// // 		where: {
// // 			id: id
// // 		}
// // 	})
// // };

router.post('/createUser', function(req, res) {
	User.create(req.body);
})

router.post('/createAddress', function(req, res) {
	let data = req.body
	User.findOrCreate(
		{
			where:{email: data.email},
			defaults:{
				firstName: data.firstName,
				lastName: data.lastName,
				batch: data.batch
			}
		}
	).spread((user, created) => {
		console.log(user.dataValues)
		Address.create({
			current: data.current,
			latitude: data.latitude,
			longitude: data.longitude,
			userId: user.id
		})
	})
})


router.get('/users', function (req, res) {
	User.findAll().then(function(users) {
		res.json(users);
	});
});

module.exports = router;
// app.listen(port, () => console.log(`Serving on port ${port}.`))
