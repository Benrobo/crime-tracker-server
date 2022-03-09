
## Getting Started

### Tech Stacks.

This project is created using the below technologies:

- Frontend

  - [React](https://reactjs.org/) :- A single page application library meant for creating reusable UI components.
  - [Notyf](https://carlosroso.com/notyf/) :- A smooth toast notification library.
  - [React-Router](https://reactrouter.com/) :- A react dynamic routing library.
  
- Backend
  - [Node.js](https://nodejs.org/en/) :- A javascript runtime environment made for building realtime , data intensive applications.
  - [Express.js](https://expressjs.com/) :- is a back end web application framework for Node.js, released as free and open-source software under the MIT License. It is designed for building web applications and APIs
  - [Postgresql](https://www.postgresql.org/) :- open-source relational database management system emphasizing extensibility and SQL compliance

### Running Frontend Locally.

Running this project locally it is required you have the above tools pre-installed on your pc, if not, follow the instructions below.

1. Download or Clone The Project.

Download the project from github either by using `curls` or `ssh`

  `CURL`
    ```
        C:/users/benrobo> curl https://github.com/Benrobo/crime-tracker-server.git
    ```
  `GIT SSH`
    ```
        C:/users/benrobo/desktop> git clone https://github.com/Benrobo/crime-tracker-server.git
    ```
    This would download this project in `desktop` directory having the name `crime-tracker-server` if that where youre executing this command from.


2. Open the folder where it was downloaded on the terminal, in my case it would be

```
   // windows

   C:/user/Desktop/crime-tracker-client>

   // linux
   benrobo@benrobo:~/Desktop/crime-tracker-client$
```

3. Install all Dependencies.
   Before making use of the command stated below make sure you have the latest version of nodejs installed, if not here is a video on how to download and setup nodejs on your pc.

- windows
  - [https://www.youtube.com/watch?v=GjfYHwlFI-c](https://www.youtube.com/watch?v=GjfYHwlFI-c)
- Mac
  - [https://www.youtube.com/watch?v=0i-gstqgjuE](https://www.youtube.com/watch?v=0i-gstqgjuE)
- Linux
  - [https://www.youtube.com/watch?v=OMhMnj7SBRQ](https://www.youtube.com/watch?v=OMhMnj7SBRQ)

After doing that, make sure to check if it installed correctly on your pc. To verify, simply use the below command

```
 node --version
 //and
 npm --version
```

The above command would print each version of the node.js and npm package if installed correctly.

Now let install all dependencies in our client application which was downloaded previously using the command below.

```
   C:/user/Desktop/crime-tracker-client> npm install
```

If everything installed sucessfully with no error, congratulation your're all setup for the client application to be view on the browser.
But holdon a bit, we cant just run this fullstack application without the need of a `backend`. Now let setup our backend

### Setting up the backend and database logic.

1. Download or clone the backend api logic using the instructions below

   - [x] Download the project from here [crime-tracker-server](https://github.com/Benrobo/crime-tracker-server.git)

2. After downloading the project into your pc, move into the directory where you downloded it, in my case it

```
   // windows

   C:/user/Desktop/crime-tracker-server>

   // linux
   benrobo@benrobo:~/Desktop/crime-tracker-server$
```

3. Now installed all the dependencies present in the project `package.json` file using

```
   // windows
   C:/user/Desktop/crime-tracker-server> npm install

   // linux
   benrobo@benrobo:~/Desktop/crime-tracker-server$ npm install
```

Doing this would install all the dependencies which was used in this project.

Before running the backend api server, our backend logic depends on a `Postgresql` database which is used to store user info, to setup `postgresql` database on your system, Please watch the below videos to download, install and setup postgresql database on your pc.

- [x] Postgresql Installation
  - [windows: https://www.youtube.com/watch?v=e1MwsT5FJRQ](https://www.youtube.com/watch?v=e1MwsT5FJRQ)
  - [Mac: https://www.youtube.com/watch?v=5AOkxqFaYEE]
    -(https://www.youtube.com/watch?v=5AOkxqFaYEE)
  - [Linux: https://www.youtube.com/watch?v=-LwI4HMR_Eg&t=160s](https://www.youtube.com/watch?v=-LwI4HMR_Eg&t=160s)

After installation was successfull, kindly check if postgresql is enabled globally on your pc using the below command

```
//windows
C:/> psql -U postgres // the name which was set when installing it.
// Linux
benrobo@benrobo:~/$ sudo -i -u postgres psql
```

Doing this would show the below image if everything works successfully.

- [x] windows
      <img src="https://linuxhint.com/wp-content/uploads/2021/09/image12-4.png">
- [x] Linux
      <img src="https://sqlserverguides.com/wp-content/uploads/2021/06/PostgreSQL-connect-to-postgres-database.png">
- [x] Mac
      <img src="https://www.sqlshack.com/wp-content/uploads/2021/04/creating-new-user-in-postgres.png">

If all went well, continue with the following steps

4. Create necessary database and tables in postgresql

Within the `crime-tracker` there exist a file called `.sql`, this file contains the queries you need to make to create both the tables and database of the server. Simply copy each statement one after the other and paste into the postgresql terminal after loggin in. Starting from

```sql
1. -- Database

CREATE DATABASE "crime-tracker";

```

3. Connect the database created using the command below

```js
    postgres=# \c "crime-tracker"
```

after doing that, the postgresql terminal directory should change into the one below having the database name

```js
 crime-tracker=#
```

4. Copy and Paste all queries line after line into the postgresql database terminal

```sql

1. -- users table

CREATE TABLE "users"(
    id TEXT NOT NULL unique primary key,
    "userId" TEXT NOT NULL unique,
    "userName" TEXT NOT NULL,
    "mail" TEXT NOT NULL unique,
    "phoneNumber" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "userRank" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "userStatus" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "joined" TEXT NOT NULL -- Date from moment
);

2. -- cases table

CREATE TABLE "cases"(
    id TEXT NOT NULL,
    "caseName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "created_at" TEXT NOT NULL
);

3. -- suspects table

CREATE TABLE "suspects"(
    id TEXT NOT NULL unique primary key,
    "userId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "suspectName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "suspectImg" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "created_at" TEXT NOT NULL
);


4. -- evidence table

CREATE TABLE "evidence"(
    id TEXT NOT NULL unique primary key,
    "userId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "evidence" TEXT NOT NULL,
    "suspectName" TEXT NOT NULL,
    "suspectId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "created_at" TEXT NOT NULL
);

```

After doing that, verify if all tables were correctly created using the command below

```js
 crime-tracker=# \d
```

this should print all tables present in that database.

If not, then you inserted the queries wrongly, else congratulation you've just setup your backend database server.

### Run the backend api server and client

After applying all necessary instructions correctly, it time to put all this to the test using the below command.

Navigate to where the `crime-tracker` and `crime-tracker-server` was downloaded and run the command below

```js

    ... Running the client app

    // crime-tracker client
    C:/users/benrobo/Desktop/crime-tracker-client> npm start

    // this should spin up the local react server in your browser. with the url of http://localhost:3000

    ... Running the backend api server
        // crime-tracker client
    C:/users/benrobo/Desktop/crime-tracker-server> npm start

    // this should spin up the local nodejs server in your terminal.

```

you should be presented with this screen

<img src="https://raw.githubusercontent.com/Benrobo/crime-tracker-client/main/readmeImg/login.png">

Now you're ready to navigate through the site.

🎊🎊🎊🎊🎊 Congratulation 🎊🎊🎊🎊🎊

If any issue was met during this process simply create an issue on the issues github tab

- [x] [crime-tracker-client: issue tab](https://github.com/Benrobo/crime-tracker-client/issues)
- [x] [babcock-api: issue tab](https://github.com/Benrobo/crime-tracker-client/issues)
