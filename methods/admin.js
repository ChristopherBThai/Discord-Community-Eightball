const emoji = require("./emoji.js");

exports.grab = function(client,con,msg,id,admin){
	var sql = "SELECT * FROM answer WHERE id = "+id+";";
	con.query(sql,function(err,rows,field){
		if(err) throw err;
		emoji.check(client,rows[0].msg,admin)
		.then(text => {
			const embed = {
				"description":""+text,
				"color":1,
				"footer":{"text":"Answer created by "+rows[0].username}
			};
			msg.channel.send("**ID "+id+"**",{embed});
		});
		
	});

}
