# **Firefile Download Manager**

A Download Manager using Angular and a MongoDB Backend.

The Firefile Download Manager will be able to do the following features:

- [X] Download a file locally or to the remote MongoDB Database
- [X] Delete the file depending on location
- [X] Tests for unsecure files prior to downloading
- [X] Dynamically display all downloads, no matter the location
- [ ] A Progress Bar to understand the download's duration
- [ ] Generate a shareable link or QR Code if asked
- [ ] e2e Testing

## **Releases**

### Release 1

There are multiple feature releases. As of feature release 1, the following tasks/features have been implemented:

- Initial Backend with APIs (logic and acceptence handling) for:
  - Downloading
  - Listing
  - Deleting
- Backend API Health Check

- Frontend Using Angular with the following features:'
- Inputs for url, destination, and filename
- Http unsecure link warning.
- Spec tests
- Service and Components for initial downloading service
- CSS color palate
- Dynamic file downloading table

The backend has been fully tested and the frontend, I have begun testing but need to do more to ensure it works.

### Release 2

As of feature release 2, the following tasks/features have been implemented:

- Added Progress Bar Component with % and color indicator
- Checks if file exists prior to downloading
- Fixed issues deleting filenames
- Modified the unique identifier to be the filename

### Release 3

## Testing

I am testing through a few avenues:

- I have `Docker` to create both the frontend and backend application as well as a MongoDB server for full testing.
- I use `curl` to test the backend apis and exception handling logic
