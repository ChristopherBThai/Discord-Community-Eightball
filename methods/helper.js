//+========================================+
//||					  ||
//||		HELPER METHODS		  ||
//||					  ||
//+========================================+


/**
 * Checks if its an integer
 * @param {string}	value - value to check if integer
 *
 */
exports.isInt = function(value){
	return !isNaN(value) &&
		parseInt(Number(value)) == value &&
		!isNaN(parseInt(value,10));
}

/**
 * Shows the help message
 * @param {discord.Channel}	channel - The channel the message was sent in
 *
 */
exports.showHelp = function(channel){
	const embed = "I'm an eightball bot! All my answers are created by **you**, the Discord community!!!\n\n**Commands**"+ 
			"\n```md\n< 8b help \n>\tDisplays this commands list!"+
			"\n\n< 8b {question}?\n>\treplies as a yes/no answer\n>\te.g. `8b Am I cute?`"+
			"\n\n< 8b add {new answer}\n>\tSuggests a new yes/no answer to this eightball!\n>\te.g. `8b add ofc not!`"+
			"\n\n< 8b addanon {new answer}\n>\tSuggests a new yes/no answer anonymously to this eightball!\n>\te.g. `8b addanon Never!`"+
			"\n\n< 8b link\n>\tWant to add the bot to another server?? :D```"+
			"\n```# Remove brackets when typing commands\n# {} = user input```";
	channel.send(embed);
}

/**
 * Show bot's info
 * @param {mysql.connection}	con
 * @param {discord.message}	msg
 */
exports.showStats = function(con, msg){
	var sql = "SELECT COUNT(*) AS count FROM answer NATURAL JOIN accepted;";
	con.query(sql,function(err,rows,field){
		if(err) throw err;
		const embed = {
		"description": "Here's a little bit of information! If you need help with commands, type `8b help`.",
			"color": 1,
			"timestamp": "2018-02-15T05:21:04.460Z",
			"author": {"name": "Community 8Ball Information",
				"url": "https://discordapp.com",
				"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"},
			"fields": [{"name": "Number of Answers",
					"value": "```md\n<Total:  84>\n<Yes:    32>\n<No:     21>\n<Maybe:  12>\n<Other:  21>\n```",
					"inline": true},
				{"name": "Number of Submitions",
					"value": "```md\n<Total:   84>\n<Yes:     32>\n<No:      21>\n<Maybe:   12>\n<Other:   21>\n<Pending: 23>```",
					"inline": true},
				{"name": "Bot Information",
					"value": "```md\n<Guilds:    84>\n<Channels:  32>\n<Users:     21>``````md\n<Ping:       32ms>\n<UpdatedOn:  3-22-12>\n<Uptime:     32>```"
				}]
		};
		msg.channel.send({embed});
	});
}

/**
 * Shows a link to invite this bot
 * @param {discord.Channel}	channel - The channel the message was sent in
 *
 */
exports.showLink = function(channel){
	const embed = {
		"title":"Click me to invite me to your server!",
		"url":"https://discordapp.com/api/oauth2/authorize?client_id=410537337513050133&permissions=2048&scope=bot",
		"color": 4886754,
		"thumbnail":{"url":"https://cdn.discordapp.com/app-icons/410537337513050133/69bef083bd93cb2213cd0912489118e8.png"},
	};
	channel.send({embed});
}
