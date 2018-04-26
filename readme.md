Note: I added an additional layer of "why" to the assignment by way of wrapping it in a use case for such an application.

# EtherFam
An application to monitor ethereum addresses you care about. Watch over others in your EtherFam.

## Core functionality
1. Create your fam by adding Ethereum addresses to monitor
2. View and filter transactions for any of your saved Ethereum addresses
3. View stored balances + metadata for any of your saved Ethereum addresses

## Additional functionality
* basic charts to provide you with oversight for your fam
* "update" button to manually update information stored in DB for each address
* "last updated" timestamp to show user the last time data was updated
* make sure backend never exceeds the rate limit of etherscan.io


### /
* add new address with nickname
* list all addresses
* show 2 charts
  * horizontal lines for # of transactions
  * vertical bar chart comparing current balance
* last updated X, with button to update all
  * progress bar indicating status of update?
  * for visual indicator, trigger them synchronously and update charts as they come in

### /:address
* nickname w/address
* current balance details
* transaction list with front-end only filters (consider size of data set to be < 1000 transactions)
* ability to delete address from fam

### /api/address
* POST (address: string, name: string), return 200

### /api/address/:id
* DELETE (address), return 200
* GET, return all transactions and current balance
* &refresh=1 goes and fetches new data, return transactions and current balance