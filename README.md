<title>ExcelToCsv - XlToCsv</title>

# Deployment
After installing everything on an AWS EC2 instance for example, use the following to autostart the server, everytime the instance is started:
https://levelup.gitconnected.com/deploying-a-node-app-on-amazon-ec2-d2fb9a6757eb

1. Install pm2 by running the following command

    ```npm install -g pm2```

2. Set up pm2 to start the server automatically on server restart.

    ```pm2 start app.js```

    ```pm2 save```

    ```pm2 startup```

3. Note that after running the pm2 startup command we get a command starting with “sudo”.
4. Copy that command from sudo till the end of the next line and paste it in the terminal and press enter.
Now your node server is running and is set to start automatically whenever you restart the EC2 instance.

# Stunden

## Demnächst

+ Server code in server ordner
+ Client code in client ordner
+ Pfad für upload zu server anpassen
+ Pfad für download aus upload entnehmen
+ Heruntergeladene Datei vom Server löschen
+ https, verschlüsselte Kommunikation
+ log erstellen mit metadaten über die transformationen
+ Tests prüfen und ggf. korrigieren

## 2023-MM-DD Wochentag, Dauer: X:YZ || A:BC

## 2023-09-29 Sonntag, Dauer: 7:15 || 15:45
+ Excel file upload
+ Excel file download
+ UI für upload und download

## 2023-08-19 Samstag,  Dauer: 3:00 || 8:30
+ Iteration über jede Zeile
+ Iteration über jede Zelle einer Zeile
+ Prüfung der Feldbezeichnung
+ Schreiben der Datei
+ ⭐ Korrekte Erstellung im Zielformat

## 2023-08-16 Mittwoch, Dauer: 1:30 || 5:30
+ ⭐Iteration über Spalten
+ Iteration über Zeilen

## 2023-08-12 Samstag,  Dauer: 4:00 || 4:00
+ Projekt initialisiert
+ Lesen der Excel-Datei
+ Lesen aller Pflichtfelder
+ Schreiben der CSV-Datei
+ ⭐ Erstellung von Tests