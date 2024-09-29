<title>ExcelToCsv - XlToCsv</title>

# Deployment

1. Log into (Connect) the [EC2 Instance](https://eu-central-1.console.aws.amazon.com/ec2/home?region=eu-central-1#Instances:sort=platform-details)
2. Go into project folder and Git pull
3. Restart pm2 using
    - ```pm2 restart 0```
4. OR: Setup new pm2 instance, if server path or name was changed (See chapter pm2)
5. Check Instance: http://18.157.51.67:3000/

# pm2
After installing everything on an AWS EC2 instance for example, use the following to autostart the server, everytime the instance is started:
https://levelup.gitconnected.com/deploying-a-node-app-on-amazon-ec2-d2fb9a6757eb

1. Install pm2 by running the following command
    - ```npm install -g pm2```
2. Set up pm2 to start the server automatically on server restart.
    - ```pm2 start server.js```
    - ```pm2 save```
    - ```pm2 startup```
3. Note that after running the pm2 startup command we get a command starting with “sudo”.
4. Copy that command from sudo till the end of the next line and paste it in the terminal and press enter.
Now your node server is running and is set to start automatically whenever you restart the EC2 instance.

## Commands: [➡️ pm2 website](https://www.npmjs.com/package/pm2)
More usefull commands:
- ```pm2 list```
- ```pm2 describe 0```
- ```pm2 monit 0```
- ```pm2 delete <id>```

## Color palette

<div style="background-color:#14908E; width:150px; height:50px; display:inline-block;">#14908E</div>

<div style="background-color:#37BFAE; width:150px; height:50px; display:inline-block;">##039996</div>

<div style="background-color:#B7AA67; width:150px; height:50px; display:inline-block;">#B7AA67</div>

<div style="background-color:#B2735B; width:150px; height:50px; display:inline-block;">#B2735B</div>

<div style="background-color:#CB524F; width:150px; height:50px; display:inline-block;">#CB524F</div>