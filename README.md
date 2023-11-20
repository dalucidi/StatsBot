# StatsBot

StatsBot is my personal NFL stats fetcher.

# Commands
/statsbot - A list of commands

/records {team name} - Gets the current record for a given team

/upcoming {team name} - Gets a teams matchup for the week

/leaders {stat type} - Gets the top 5 players for a given stat

/scoreboard {team name} - Gets the score for a team if they play today

/birds - birds birds birds


# Forking
Should you choose to fork this repo for your own use and customization, below are steps to get you started.

1. Make your own bot profile on the discord developer portal
2. Navigate to `OAuth2 > URL Generator` and select `application.commands` && `bot` check boxes
3. Copy the generated URL at the bottom and paste it into a new tab. Follow instructions to add to server
4. add a `.env` file at the same level as the `bot.js` file, and add the following to the file -
```
CLIENTID={ The Application ID of your bot }
SERVERID={ A comma separated list (no spaces) of the ID's of the servers you want to be able to publish commands to}
TOKEN={ Your bots token }
```
5. run `node .\deploy-commands.js` to publsh commands
6. run `node .\bot.js` to run
