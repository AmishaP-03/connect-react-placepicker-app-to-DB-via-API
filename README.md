# connect-react-placepicker-app-to-DB-via-API
A full stack placepicker application which gets rendered using the data fetched from DB via the HTTP requests to the API endpoint.

Frontend is written is React while backend in Node.js.

UI makes use of the APIs exposed by backend to:
1. fetch available places/user-selected places
2. set/remove the user-selected places when a user selects/deletes a place. 

The data is managed by files stored in the backend.

To run the application:
npm install
npm run dev

To run the server:
cd backend
node app.js
