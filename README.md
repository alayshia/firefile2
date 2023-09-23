# **Firefile Download Manager**

A Download Manager using Angular and a MongoDB Backend.

The Firefile Download Manager will be able to do the following features:

- **Feature I:** Download, List and Delete files to **local** or **MongoDB** storage
  - Uses the filename as the unique identifier. Checks in both places (The UI will flag)
  - Tests MongoDB Connection. If the DB conntect does not exists, it cannot be selected
- **Feature II:** Download Progress Bar
  - Tells the user the % of download completed using a green bar
  - Bar disappears once the download is complete
- **Feature III:** QRCode Generator
  - Generates a QRCode within the UI which shares the download location
- **Feature IV:** Dynamic Download Display
  - Dynamically Displays each download, its byte size, location and an action (delete or QRCode)
  - The download can be deleted or a QRCode generated from the display