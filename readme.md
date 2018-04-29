# Eth Ledger
An application to monitor ethereum addresses you care about.

Check out the live version here: https://ethledger.herokuapp.com/

(Heroku's free tier server goes to sleep, so the first load may be slow while it starts up).

![alt text](https://images-production.global.ssl.fastly.net/uploads/images/file/12793/heath-ledger.jpg?auto=compress&fit=crop&h=300&q=55&w=300)

## Tech
This is a node server, connecting to a MongoDB, hosting a React app. The whole thing is self-contained, provided you set the correct keys in the .env file(s).

## Local Dev
* Run `yarn` or `npm install` from the root directory
* Then run `npm run build`. This will build the front-end and drop it up a directory so that the server can access it.
* Finally, run `foreman start`.

## Live App
https://ethledger.herokuapp.com/

### Considerations
For the sake of this demo I've checked in my .env files. Obviously this isn't something I recommend in prod.

Adding in redux was a little overkill for this project, but it kept the components fairly clean, and everything fit in one reducer. Any larger and it would need to be split up into a few reducers.

### Nuances and improvements
* Balance auto-updates on every refresh of the home page. Unexpected results would occur if you have saved more than 20 Ethereum addresses. The api allows for batches of 20, but I didn't get around to paginating the list. Future improvement.
* For the sake of load times I have limited the transaction list to the top 1000. Although for some more active accounts even those requests time out.
* The entire application should be fairly response / mobile friendly
* There is a DELETE endpoint for an account, but I didn't finish hooking it up on the front-end
* My initial build also integrated the websocket EtherScan has for addresses, but it ended up not being very useful or relevant to the challenge at hand