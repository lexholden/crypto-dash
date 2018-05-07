# MyCryptoDash - track the currencies you care about

## Features

- List widgets of all saved coins a user cares about
- Add coins by their tag with USD price
- Error message popup for various error states
- Remove coins by clicking the X card widget
- Reset back to default ['BTC', 'ETH'] with a button
- Case insensitive Autocomplete for popular coin names
- Click the "More Info" button to see some additional info on each coin
- A "Crypto in the News" section with a few articles
- Redux based optimistic UI
  - Interactions show in the UI before the API call has finished where possible
  - I would normally not use redux for such a simple UI like this, but stretch features [improvements to error notifications, ability to filter/sort coins in the list] would have benefitted from redux.

# Next features

The next feature priorities would be:

- Making autocomplete dynamic (load top cryptos from the api)
- Making autocomplete more than just the Symbol (full name, other info)
- Adding some testcafe tests of basic flows
- Linting of JS and Sass (+ moving to sass)
- Added page for looking at an individual coin
- Added the Loader component before coins render
- Added a small d3 sparkline graph for the price of a currency this week/month

# Known UX issues

There are a few things to QA out in an MVP2:

- BTC and ETH have a delete button, but cannot be deleted
- You can add coins that don't exist and there is no error for validation
- Article contents from the API are not unescaped
- It's pretty ugly, not a huge amount of focus on design so far