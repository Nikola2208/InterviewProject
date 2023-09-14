# Interview project

## Description
The application represents an automated system designed to handle customer orders and also generates invoices in PDF format for staff and administration.

## Getting Started

### Backend application dependencies

Prerequisites:
* [python@3.11](https://www.python.org/downloads)
* IDE for programming in Python (recommended [PyCharm](https://www.jetbrains.com/pycharm/download))
* pip
* virtual environment using venv
  
Using following command you can install pip if it doesn't already exist(although venv comes with pip):
```
python3 -m ensurepip
```
After setting environment, through terminal run following command to install needed packages and libraries:
```
pip install -r requirements.txt
```

### Setting database

Before executing application, database needs to be set. If there isn't migrations folder already existed then first you need to run following commands to generate it and set initial version:
```
flask db init
```
```
flask db migrate
```
If there is migrations folder and database already has existing version, then run following command:
```
flask db upgrade
```

### Run backend application

After successful initialization of database, you are able to run application using command:
```
flask run
```

### Frontend application dependencies

Prerequisites:
* [Node.js](https://nodejs.org/en)
* Code editor (recommended [Visual Studio Code](https://code.visualstudio.com/download))
* Angular CLI
  
Using following command you can install Angular CLI globally:
```
npm install -g @angular/cli
```
After setting environment, through terminal position yourself in the directory where the project is and run following command to install needed packages and libraries:
```
npm install
```

### Run frontend application

After successful installation of needed packages, you are able to run application using command:
```
ng serve
```


### Using application

For using applicaton and testing its functionality, you can enter following URL path in your browser:
```
http://localhost:4200
```

## Authors

Contributors:

* Nikola Holjevac - [n.holjevac@codeflex.it](mailto:n.holjevac@codeflex.it)
