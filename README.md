<h1>Movinator v0.1</h1>
It's an app for guessing, which movie/TV-show you want to check out this time.

<h2>How to run</h2>
<h3>Prerequisites:</h3>
To test the app you have to be familliar with Terminal and have the following software installed:
<ol>
  <li>Node JS - https://nodejs.org/en/download/ (both LTS and current should do the job).</li>
  <li>Git - https://git-scm.com/downloads</li>
</ol>

<h3>Installation:</h3>
<ol>
  <li>Create some directory on your local machine.</li>
  <li>Open the directory in Terminal and run "git clone https://github.com/nsoshenko/movinator.git".</li>
  <li>The directory should be populated with 2 directories: "/backend", "/frontend", - and some files.</li>
  <li>Switch directory in Terminal to "/backend" with help of command "cd backend".</li>
  <li>Run "npm install".</li>
  <li>Switch directory in Terminal to "/frontend" with help of command "cd ../frontend".</li>
  <li>Run "npm install" once again.</li>
  <li>(This step is for Windows users only) Open "package.json" file from the "/frontend" directory with any text editor.
   Look for a section called "scripts" and change "start": "react-scripts start" to "start": "react-scripts --openssl-legacy-provider start".</li>
</ol>

<h3>How to run API server:</h3>
<ol>
  <li>Open the directory "/backend" in a separate Terminal window and run "npm start".</li>
  <li>You should see: "Server is running on port 3002"
  This terminal will contain all the backend logs in it.</li>
</ol>

<h3>How to run client app:</h3>
<ol>
  <li>Open the directory "/frontend" in a separate Terminal window and run "npm start".</li>
  <li>You should see something like:

  "Compiled successfully!
  You can now view movinator in the browser.
  Local: http://localhost:3000
  On Your Network: http://192.168.0.100:3000"</li>
</ol>
