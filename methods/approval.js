//+==========================================+
//||					    ||
//||		APPROVAL METHODS	    ||
//||					    ||
//+==========================================+

//select * from answer ans left join accepted acc on ans.id = acc.id left join declined decl on ans.id = decl.id where acc.id is null and decl.id is null;


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

	//Check if there is a message
	if(!message||message === ''){
		channel.send("Silly "+sender + ", add your new answer first!"); 
		return;
	}

	//Check anonymous
	var anonMsg = "";
	var anonymous = 0;
	if(anon){
		anonymous = 1;
		anonMsg = " anonymously";
	}

	//SQL statement
	var sql = "INSERT INTO answer (msg,userId,username,anon) values ("+
		"?,"+
		sender.id+","+
		"?,"+
		anonymous+");";

	//Check message size
	if(message.length > 100){
		console.log("\tMessage too big");
		channel.send("Sorry! Messages must be under 100 character!!!");
		return;
	}
	
	//Remove brackets if user typed them in
	message = message.trim();
	if(message.charAt(0)==='{')
		message = message.substring(1);
	if(message.charAt(message.length-1)==='}')
		message = message.substring(0,message.length-1);

	var mysqlformat = [message,sender.username];
	sql = mysql.format(sql,mysqlformat);
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
					"name": "Anonymous",
					"value": ""+anon,
					"inline": true
				},{
					"name": "From "+sender.username,
					"value": message+"\n\n==============================================="
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
 * @param {string} 		type  	-  The type of answer
 *
 */
exports.accept= function(mysql, con, client, msg, args, type){
	var dm = msg.channel;
	var idList = "";
	if(!(type==="y"||type==="n"||type==="m"||type==="o")){
		dm.send("Not a valid type");
		return;
	}
	for (i in args)
		if(isInt(args[i]))
			idList += args[i] + ",";
	if(idList==="")
		return;
	idList = idList.slice(0,-1);
	var sql = "SELECT ans.* FROM answer ans LEFT JOIN accepted acc ON ans.id = acc.id WHERE acc.id IS NULL AND ans.id IN ("+idList+");";
	sql += "INSERT IGNORE INTO accepted (id) SELECT id FROM answer WHERE id IN("+idList+");";
	sql += "UPDATE IGNORE answer SET type = '"+type+"' WHERE id IN("+idList+");"
	sql += "DELETE FROM declined WHERE id IN ("+idList+")";

	idList = "";
	con.query(sql,function(err,rows,field){
		if(err) throw err;
		var accepted = rows[0];
		for (i in accepted){
			var user = client.users.get(String(accepted[i].userId));
			if(user===null||user===undefined){
				dm.send("Could not find user: "+accepted[i].userId);
			}else{
				var anon = "false";
				if(accepted[i].anon==1)
					anon = "true";
				const embed = {
					"color": 65280,
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
			
		}

		dm.send("Accepted: "+idList);
		console.log("Admin Command: accepted "+idList);
	});
}

/**
 * Declines an answer
 * @param {mysql} 		mysql	-  MySql
 * @param {mysql.Connection} 	con 	-  MySql.createConnection()
 * @param {discord.Client} 	client	-  Discord.js client
 * @param {discord.Message}	msg 	-  the msg from discord
 * @param {string} 		args	-  The arguments of the command
 * @param {string} 		type  	-  The type of answer
 *
 */
exports.decline = function(mysql, con, client, msg, args, type){
	var dm = msg.channel;
	var idList = "";
	if(!(type==="y"||type==="n"||type==="m"||type==="o")){
		dm.send("Not a valid type");
		return;
	}
	for (i in args)
		if(isInt(args[i]))
			idList += args[i] + ",";
	if(idList==="")
		return;
	idList = idList.slice(0,-1);
	var sql = "SELECT ans.* FROM answer ans LEFT JOIN declined decl ON ans.id = decl.id WHERE decl.id IS NULL AND ans.id IN ("+idList+");";
	sql += "INSERT IGNORE INTO declined (id) SELECT id FROM answer WHERE id IN("+idList+");";
	sql += "UPDATE IGNORE answer SET type = '"+type+"' WHERE id IN("+idList+");"
	sql += "DELETE FROM accepted WHERE id IN ("+idList+")";

	idList = "";
	con.query(sql,function(err,rows,field){
		if(err) throw err;
		var declined = rows[0];
		for (i in declined){
			var user = client.users.get(String(declined[i].userId));
			if (user===null||user===undefined){
				dm.send("Could not find "+declined[i].userId);
			}else{
				var anon = "false";
				if(declined[i].anon==1)
					anon = "true";
				const embed = {
					"color": 16711680,
					"timestamp": new Date(),
					"thumbnail":{"url": "https://cdn.discordapp.com/app-icons/410537337513050133/69bef083bd93cb2213cd0912489118e8.png"},
					"author": {
						"name": "Community Eightball Bot Support",
						"icon_url": "https://cdn.discordapp.com/app-icons/410537337513050133/69bef083bd93cb2213cd0912489118e8.png"
					},
					"fields": [
						{
							"name":"Sorry! Your answer has been declined!",
							"value": "Only yes/no/maybe answers are accepted\n==============================================="
						},{
							"name": "Answer ID",
							"value": declined[i].id,
							"inline": true
						},{
							"name": "Anonymous",
							"value": anon,
							"inline": true 
						},{
							"name": "Your Declined Answer",
							"value": declined[i].msg+"\n\n===============================================\n"
						}				
					]
				};

				user.send({embed});
				idList += " ["+declined[i].id+"]";
			}
			
		}

		dm.send("Declined: "+idList);
		console.log("Admin Command: declined "+idList);
	});
}


/**
 * Declines an answer
 * @param {mysql.Connection} 	con 	-  MySql.createConnection()
 * @param {discord.Message}	msg 	-  the msg from discord
 * @param {string} 		args	-  The arguments of the command
 * @param {string} 		type  	-  The type of answer
 *
 */
exports.set = function(con, msg, args, type){
	var dm = msg.channel;
	var idList = "";
	if(!(type==="y"||type==="n"||type==="m"||type==="o")){
		dm.send("Not a valid type");
		return;
	}
	for (i in args)
		if(isInt(args[i]))
			idList += args[i] + ",";
	idList = idList.slice(0,-1);
	var sql = "UPDATE IGNORE answer SET type = '"+type+"' WHERE id IN("+idList+");"
	con.query(sql,function(err,rows,field){
		if(err) throw err;
		dm.send("Updated to '"+type+"' for: ["+idList+"]");
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



