const eGuild = "414188338795380736";

exports.check = async function(client,text,admin){
	var emojis = text.match(/<a?:[a-zA-Z0-9_]+:[0-9]+>/gm);
	for (var i in emojis){
		//Grab emoji id
		temp = emojis[i];
		var type = "png";
		if(temp.match(/<a:/g))
			type = "gif";
		var id = String(temp.match(/:[0-9]+>/g));
		id = id.substring(1,id.length-1);

		//Check if its avaiable to bot
		if(!client.emojis.has(id)){
			var found = client.emojis.find("name",id);
			var guild = client.guilds.get(eGuild);
			if(found===null){
				if(guild.emojis.size >= 45)
					admin.send("Emoji storage almost out!");
				await guild.createEmoji('https://cdn.discordapp.com/emojis/'+id+'.'+type,id)
				.then((emoji) => {
					found = emoji;
				});
				text = text.replace(temp,found.toString());
			}else{
				text = text.replace(temp,found.toString());
			}
		}
	}
	return text;
}
