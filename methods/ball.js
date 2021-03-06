//+========================================+
//||					  ||
//||		OTHER METHODS		  ||
//||					  ||
//+========================================+
const emoji = require("./emoji.js");

/**
 * Eightball that replies as a yes/no answer
 * @param {mysql.con} 		con
 * @param {discord.Message} 	msg - Discord's message
 * @param {boolean}		isMention - if the command was called as a mention or not
 */
exports.ask = function(client,con,msg,admin,isMention,prefix){
	var rand = Math.random();
	var type = "o";
	if(rand<=.35)
		type = "y";
	else if (rand<=.7)
		type = "n";
	else if (rand<=.85)
		type = "m";
	var sql = "SET @rand = (CEIL(RAND()*(SELECT COUNT(*) FROM answer NATURAL JOIN accepted WHERE type = '"+type+"')));SELECT * FROM (SELECT answer.*,@rownum := @rownum + 1 AS rank FROM answer NATURAL JOIN accepted, (SELECT @rownum := 0) r WHERE type = '"+type+"') d WHERE rank <= @rand ORDER BY rank DESC LIMIT 1;"
	con.query(sql,function(err,rows,field){
		if(err) throw err;
		rows = rows[1];
		var question = msg.content;
		if(isMention)
			question = question.substring(question.indexOf(" ")+1);
		else
			question = question.substring(prefix.length+1);
		var creator = "anonymous";
		if(rows[0].anon == 0)
			creator = rows[0].username;

		emoji.check(client,rows[0].msg,admin)
		.then(text => {
			const embed = {
				"description":""+text,
				"color":1,
				"footer":{"text":"Answer created by "+creator}
			};
			msg.channel.send("**"+msg.author+" asked:** "+question,{embed});
			console.log("	question: "+question);
			console.log("	answer: "+rows[0].msg);
		});
	});
}
