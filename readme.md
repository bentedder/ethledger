Note: I added an additional layer of "why" to the assignment by way of wrapping it in a use case for such an application.

# Eth Ledger
An application to monitor ethereum addresses you care about.

Check out the live version here: https://ethledger.herokuapp.com/ (free tier server goes to sleep, so first access may be slow while it starts up).

![alt text](https://images-production.global.ssl.fastly.net/uploads/images/file/12793/heath-ledger.jpg?auto=compress&fit=crop&h=300&q=55&w=300)

## Tech
This is a node server, connecting to a MongoDB, hosting a React app. The whole thing is self-contained, provided you set the correct keys in the .env file(s).

## Installation
Run `yarn` or `npm install` from the root directory.
Then run `npm run build`. This will build the front-end and drop it up a directory so that the server can access it. Then run 
Finally, run `foreman start`

### Considerations
For the sake of this demo I've checked in my .env files. Obviously this isn't something I recommend in prod.