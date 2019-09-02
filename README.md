# Postbox

_Postbox_ is a simple Node.js server to log incoming HTTP requests.



## Overview

The same way _Postman_ is a tool to **make** requests, _Postbox_ is a tool to **receive** requests (and response back).

**Main use case**
It's difficult to find open free APIs where to make POST, PUT... requests, and inspect/monitor the request details (headers, raw body, etc.). This tool aims to solve this problem by bringing up a local server, which will log in your command line all the received requests.

## Quick start

In your terminal:

1. Navigate to the repo folder.
2. Install: Node.js and NPM required.
    ```
    npm install
    ```
3. Run:
    ```
    npm start
    ```

## Configuration

### Available endpoints

| Route  | Supported methods | Response |
| :----- | :---------------: | :------: |
| `/`    |  GET, POST, PUT   |   JSON   |
| `/xml` |  GET, POST, PUT   |   XML    |

### Port

The value of the port is specified in `./config.js`.