//+==========================================+
//||					    ||
//||		APPROVAL METHODS	    ||
//||					    ||
//+==========================================+



/**
 * Sends a feedback to an admin
 * @param {mysql} 		mysql	-  MySql
 * @param {mysql.Connection} 	con 	-  MySql.createConnection()
 * @param {discord.User} 	admin 	-  Admin's User
 * @param {string} 		type 	-  type of feedback
 * @param {string} 		message -  the message of feedback
 *
 */
exports.send = function(mysql, con, msg, admin, message,anon){
	var sender = msg.author;
	var channel = msg.channel;
	if(!message||message === ''){
		channel.send("Silly "+sender + ", add your new answer first!"); 
		return;
	}

	var anonMsg = "";
	var anonymous = 0;
	if(anon){
		anonymous = 1;
		anonMsg = " anonymously";
	}
	var sql = "INSERT INTO answer (msg,user,anon) values ("+
		"?,"+
		sender.id+","+
		anonymous+");";
	if(message.length > 100){
		console.log("\tMessage too big");
		channel.send("Sorry! Messages must be under 100 character!!!");
		return;
	}
	sql = mysql.format(sql,message);
	con.query(sql,function(err,rows,field){
		if(err) throw err;
		const embed = {
			"color": 10590193,
			"timestamp": new Date(),
			"thumbnail":{"url": "https://cdn.discordapp.com/app-icons/410537337513050133/69bef083bd93cb2213cd0912489118e8.png"},
			"author": {
				"name": "Community Eightball Bot Support",
				"icon_url": "https://cdn.discordapp.com/app-icons/410537337513050133/69bef083bd93cb2213cd0912489118e8.png"
			},
			"fields": [
				{
					"name":"A user sent a new answer"+anonMsg+"!",
					"value": "==============================================="
				},{
					"name": "Message ID",
					"value": rows.insertId,
					"inline": true
				},{
					"name": "From "+sender.username,
					"value": "```"+message+"```\n\n==============================================="
				}
			]
		};
		channel.send("Thanks for the new answer, "+sender+"! It will be reviewed within 24 hours!");
		admin.send({embed});
		console.log("	New answer sent to admin's DM");
	});
}

/**
 * Replies to a feedback 
 * @param {mysql} 		mysql	-  MySql
 * @param {mysql.Connection} 	con 	-  MySql.createConnection()
 * @param {discord.Client} 	client	-  Discord.js client
 * @param {discord.Message}	msg 	-  the msg from discord
 * @param {string} 		args	-  The arguments of the command
 *
 */
exports.accept= function(mysql, con, client, msg, args){
	var dm = msg.channel;
	var idList = "";
	for (i in args)
		if(isInt(args[i]))
			idList += args[i] + ",";
	if(idList==="")
		return;
	idList = idList.slice(0,-1);
	console.log(idList);
	var sql = "SELECT ans.* FROM answer ans LEFT JOIN accepted acc ON ans.id = acc.id WHERE acc.id IS NULL AND ans.id in ("+idList+");";
	sql += "INSERT IGNORE INTO accepted SELECT id FROM answer WHERE id in ("+idList+");";

	idList = "";
	con.query(sql,function(err,rows,field){
		if(err) throw err;
		var accepted = rows[0];
		for (i in accepted){
			var user = client.users.get(String(accepted[i].user));
			var anon = "false";
			if(accepted[i].anon==1)
				anon = "true";
			const embed = {
				"color": 10590193,
				"timestamp": new Date(),
				"thumbnail":{"url": "https://cdn.discordapp.com/app-icons/410537337513050133/69bef083bd93cb2213cd0912489118e8.png"},
				"author": {
					"name": "Community Eightball Bot Support",
					"icon_url": "https://cdn.discordapp.com/app-icons/410537337513050133/69bef083bd93cb2213cd0912489118e8.png"
				},
				"fields": [
					{
						"name":"Your answer has been approved!",
						"value": "==============================================="
					},{
						"name": "Answer ID",
						"value": accepted[i].id,
						"inline": true
					},{
						"name": "Anonymous",
						"value": anon,
						"inline": true 
					},{
						"name": "Your Accepted Answer",
						"value": accepted[i].msg+"\n\n===============================================\n"
					}				
				]
			};

			user.send({embed});
			idList += " ["+accepted[i].id+"]";
		}

		dm.send("Accepted: "+idList);
		console.log("Admin Command: accepted "+idList);
	});
}

/**
 * Checks if its an integer
 * @param {string}	value - value to check if integer
 *
 */
function isInt(value){
	return !isNaN(value) &&
		parseInt(Number(value)) == value &&
		!isNaN(parseInt(value,10));
}



