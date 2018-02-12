const Discord = require("discord.js");
const client = new Discord.Client();
const helper = require("./methods/helper.js");
const approval = require("./methods/approval.js");
const ball = require("./methods/ball.js");
var auth = require('../tokens/eightball-auth.json');
var login = require('../tokens/eightball-login.json');
var prefix = "8b";

client.on('message',msg => {
	//Special admin commands via DM
	if(msg.author.id===auth.admin&&msg.channel.type==="dm"){
		var adminMsg = msg.content.trim().split(/ +/g);
		const adminCommand = adminMsg.shift().toLowerCase();

		//Reply to a feedback/report/suggestion
		if(adminCommand === 'accept'){
			//Accept new answer
			approval.accept(mysql, con, client, msg, adminMsg);
		}

		else if(adminCommand === 'decline'){
			//Deny new answer 
			approval.decline(mysql, con, client, msg, adminMsg);
		}
	}

	//Ignore if its a bot or DM
	if(msg.author.bot||msg.channel.type!=="text") return;

	//Check if command
	var args = "";
	var isMention = false;
	var isCommand = false;
	//Check for 'owo' prefix
	if(msg.content.toLowerCase().indexOf(prefix) === 0){
		args = msg.content.slice(prefix.length).trim().split(/ +/g);
		isCommand = true;
	}else if(msg.mentions.users.has(client.user.id)){
		args = msg.content.substring(msg.content.indexOf(" ")).trim().split(/ +/g);;
		isMention = true;
		isCommand = true;
	}

	//Commands
	if(isCommand){
		const command = args.shift().toLowerCase();

		//Suggests a new answer
		if(command === 'add'|| command === 'suggest'){
			approval.send(mysql, con,msg, client.users.get(auth.admin), args.join(' '),false);
		}

		//Suggests a new answer anonymously
		else if(command === 'addanon'|| command === 'suggestanon'){
			approval.send(mysql, con,msg, client.users.get(auth.admin), args.join(' '),true);
		}

		//Eightball!
		else if(msg.content[msg.content.length-1] === '?'){
			ball.ask(con,msg,isMention,prefix);
			isCommand = false;
			console.log("Command: ? {"+args+"} by "+msg.author.username+"["+msg.guild.name+"]["+msg.channel.name+"]");
		}

		//Displays all the commands
		else if(command === "help" || command === "command"){
			helper.showHelp(msg.channel);
		}

		//Display link for discord invite
		else if(command === "invite" || command === "link"){
			helper.showLink(msg.channel);
		}

		//If not a command...
		else if(isMention) msg.channel.send("Type '8b help' for help!");

		if(isCommand)
			console.log("Command: "+command+" {"+args+"} ["+msg.guild.name+"]["+msg.channel.name+"]"+msg.author.username);
	}
});

//Discord login
client.login(auth.token);

//Establish mysql connection
var mysql = require('mysql');
var con = mysql.createConnection({
	host: "localhost",
	user: login.user,
	password: login.pass,
	database: "eightball",
	supportBigNumbers: true,
	bigNumberStrings: true,
	multipleStatements: true,
	charset: "utf8mb4"
});

//Display log when connected to mysql
con.connect(function(err){
	if(err) throw err;
	console.log("Connected!");
});

//=============================================================================Console Logs===============================================================

//When the bot client starts
client.on('ready',()=>{
	console.log('Logged in as '+client.user.tag+'!');
	console.log('Bot has started, with '+client.users.size+' users, in '+client.channels.size+' channels of '+client.guilds.size+' guilds.');
	client.user.setActivity('with '+client.guilds.size+' Servers! | \n\'8b help\' for help!');
});

//When bot joins a new guild
client.on("guildCreate", guild => {
	console.log('New guild joined: '+guild.name+' (id: '+guild.id+'). This guild has '+guild.memberCount+' members!');
	client.user.setActivity('with '+client.guilds.size+' Servers! | \n\'8b help\' for help!');
});

//When bot is kicked from a guild
client.on("guildDelete", guild => {
	console.log('I have been removed from: '+guild.name+' (id: '+guild.id+')');
	client.user.setActivity('with '+client.guilds.size+' Servers! | \n\'8b help\' for help!');
});


