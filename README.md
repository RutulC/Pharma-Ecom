# PharmaEcom

**PharmaEcom** is a **Node.js** based web application built with Express.js to provide an e-commerce platform for pharmaceutical products. 

## Features

- User authentication (using Passport.js with Local Strategy)
- Sessions with `express-session` and MongoDB as the session store
- Template rendering with EJS
- RESTful routes with support for method overriding
- Database interaction using Mongoose for MongoDB
- Flash messages using `connect-flash`


## Installation

To get started with the project, follow these steps:

Clone the repository:
   ```bash 
   git clone https://github.com/RutulC/Pharma-Ecom.git 
   cd Pharma-Ecom 
   ```

Install the dependencies:
```bash 
npm install 
```

Run the Application:
```bash 
node app.js
```

## Dependencies

The following are the main dependencies used in this project:

- **[axios](https://www.npmjs.com/package/axios)**: Promise-based HTTP client for making requests to APIs.
- **[connect-flash](https://www.npmjs.com/package/connect-flash)**: Flash messages for displaying success or error notifications.
- **[connect-mongo](https://www.npmjs.com/package/connect-mongo)**: MongoDB session store for Express.
- **[ejs](https://www.npmjs.com/package/ejs)**: Embedded JavaScript templating engine.
- **[ejs-mate](https://www.npmjs.com/package/ejs-mate)**: Layout and partials support for EJS templates.
- **[express](https://www.npmjs.com/package/express)**: A web framework for Node.js to handle HTTP requests.
- **[express-session](https://www.npmjs.com/package/express-session)**: Session middleware for handling sessions in Express.
- **[method-override](https://www.npmjs.com/package/method-override)**: Middleware to override HTTP methods to support PUT and DELETE requests.
- **[mongoose](https://www.npmjs.com/package/mongoose)**: A MongoDB object modeling tool designed to work in an asynchronous environment.
- **[passport](https://www.npmjs.com/package/passport)**: Authentication middleware for Node.js to handle various authentication strategies.
- **[passport-local](https://www.npmjs.com/package/passport-local)**: Local authentication strategy for Passport, typically used for username and password-based authentication.
- **[passport-local-mongoose](https://www.npmjs.com/package/passport-local-mongoose)**: Mongoose plugin that simplifies the integration of Passport for local authentication.