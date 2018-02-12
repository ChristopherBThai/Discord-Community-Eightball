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
			"\n\n```# Remove brackets when typing commands\n# [] = optional arguments\n# {} = optional user input```";
	channel.send(embed);
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
