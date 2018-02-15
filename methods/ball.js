//+========================================+
//||					  ||
//||		OTHER METHODS		  ||
//||					  ||
//+========================================+

/**
 * Eightball that replies as a yes/no answer
 * @param {mysql.con} 		con
 * @param {discord.Message} 	msg - Discord's message
 * @param {boolean}		isMention - if the command was called as a mention or not
 */
exports.ask = function(con,msg,isMention,prefix){
	var rand = Math.random();
	var type = "o";
	if(rand<=.35)
		type = "y";
	else if (rand<=.7)
		type = "n";
	else if (rand<=.85)
		type = "m";
	var sql = "SELECT * FROM (SELECT answer.*,@rownum := @rownum + 1 AS rank FROM answer NATURAL JOIN accepted, (SELECT @rownum := 0) r WHERE type = '"+type+"') d WHERE rank <= (CEIL(RAND()*(SELECT COUNT(*) FROM answer NATURAL JOIN accepted WHERE type = '"+type+"'))) ORDER BY rank DESC LIMIT 1;"
	con.query(sql,function(err,rows,field){
		if(err) throw err;
		var question = msg.content;
		if(isMention)
			question = question.substring(question.indexOf(" ")+1);
		else
			question = question.substring(prefix.length+1);
		var creator = "anonymous";
		if(rows[0].anon == 0)
			creator = rows[0].username;

		const embed = {
			"description":""+rows[0].msg,
			"color":1,
			"footer":{"text":"Answer created by "+creator}
		};
		msg.channel.send("**"+msg.author+" asked:** "+question,{embed});
		console.log("	question: "+question);
		console.log("	answer: "+rows[0].msg);
	});
}
