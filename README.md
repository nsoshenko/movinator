<h1>Movinator v0.1</h1>
It's an app for guessing, which movie/TV-show you want to check out this time.

<h2>How to run</h2>
<h3>Prerequisites:</h3>
To test the app you have to be familliar with Terminal and have the following software installed:
1. Node JS - https://nodejs.org/en/download/ (both LTS and current should do the job).
2. Git - https://git-scm.com/downloads

<h3>Installation:</h3>
1. Create some directory on your local machine.
2. Open the directory in Terminal and run "git clone https://github.com/nsoshenko/movinator.git".
3. The directory should be populated with 2 directories: "/backend", "/frontend", - and some files.
4. Switch directory in Terminal to "/backend" with help of command "cd backend".
5. Run "npm install".
6. Switch directory in Terminal to "/frontend" with help of command "cd ../frontend".
7. Run "npm install" once again.
8. (This step is for Windows users only) Open "package.json" file from the "/frontend" directory with any text editor.
   Look for a section called "scripts" and change "start": "react-scripts start" to "start": "react-scripts --openssl-legacy-provider start".

<h3>How to run API server:</h3>
1. Open the directory "/backend" in a separate Terminal window and run "npm start".
2. You should see: "Server is running on port 3002"
   This terminal will contain all the backend logs in it.

<h3>How to run client app:</h3>
1. Open the directory "/frontend" in a separate Terminal window and run "npm start".
2. You should see something like:

"Compiled successfully!
You can now view movinator in the browser.

Local: http://localhost:3000
On Your Network: http://192.168.0.100:3000"
