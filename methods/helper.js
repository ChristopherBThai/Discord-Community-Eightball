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
			"\n\n< 8b stats\n>\tDisplays the bot stats```"+
			"\n```# Remove brackets when typing commands\n# {} = user input```";
	channel.send(embed);
}

/**
 * Show bot's info
 * @param {mysql.connection}	con
 * @param {discord.message}	msg
 */
exports.showStats = function(client, con, msg){
	var sql = "SELECT COUNT(*) total, "+
		"sum(case when type = 'y' then 1 else 0 end) yes, "+
		"sum(case when type = 'n' then 1 else 0 end) no, "+
		"sum(case when type = 'm' then 1 else 0 end) maybe, "+
		"sum(case when type = 'o' then 1 else 0 end) other "+
		"FROM answer NATURAL JOIN accepted;";
	sql += "SELECT COUNT(*) total, "+
		"sum(case when type = 'y' then 1 else 0 end) yes, "+
		"sum(case when type = 'n' then 1 else 0 end) no, "+
		"sum(case when type = 'm' then 1 else 0 end) maybe, "+
		"sum(case when type = 'o' then 1 else 0 end) other, "+
		"sum(case when type IS NULL then 1 else 0 end) pending "+
		"FROM answer;";
	con.query(sql,function(err,rows,field){
		if(err) throw err;
		answer = rows[0][0];
		all = rows[1][0];
		const embed = {
		"description": "Here's a little bit of information! If you need help with commands, type `8b help`.",
			"color": 1,
			"timestamp": "2018-02-15T05:21:04.460Z",
			"author": {"name": "Community 8Ball Information",
				"url": "https://discordapp.com",
				"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"},
			"fields": [{"name": "Number of Answers",
					"value": "```md\n<Total:  "+answer.total+">\n<Yes:    "+answer.yes+">\n<No:     "+answer.no+">\n<Maybe:  "+answer.maybe+">\n<Other:  "+answer.other+">\n<```",
					"inline": true},
				{"name": "Number of Submitions",
					"value": "```md\n<Total:   "+all.total+">\n<Yes:     "+all.yes+">\n<No:      "+all.no+">\n<Maybe:   "+all.maybe+">\n<Other:   "+all.other+">\n<Pending: "+all.pending+">```",
					"inline": true},
				{"name": "Bot Information",
					"value": "```md\n<Guilds:    "+client.guilds.size+">\n<Channels:  "+client.channels.size+">\n<Users:     "+client.users.size+">``````md\n<Ping:       "+client.ping+"ms>\n<UpdatedOn:  "+client.readyAt+">\n<Uptime:     "+client.uptime+">```"
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
