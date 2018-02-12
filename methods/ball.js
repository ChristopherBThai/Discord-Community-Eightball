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
	var sql = "SELECT * FROM answer WHERE id = (SELECT a1.id FROM accepted AS a1 JOIN (SELECT (RAND() * (SELECT MAX(num) FROM accepted)) AS num) AS a2 WHERE a1.num >= a2.num ORDER BY a1.num ASC LIMIT 1);";
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
