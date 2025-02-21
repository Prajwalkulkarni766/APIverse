# Postman Clone Backend

This is the backend for a Postman Clone application built using Node.js, Express, and MongoDB. The backend allows users to create and manage collections, execute requests, log history, share collections with others, and more.

---

## Features

- **User Authentication**: JWT-based authentication for user login.
- **Collections Management**: Create, update, delete, export, import, and duplicate collections.
- **Request Execution**: Send API requests (GET, POST, etc.) and log their history.
- **Collaborative Collections**: Share collections with other users.
- **Search & Filter Collections**: Search by collection name and filter by shared status or date.
- **Import/Export Collections**: Import and export collections as JSON files.
- **Request Logging**: Log the execution history of requests for future reference.

---

## Tech Stack

- **Node.js**: JavaScript runtime for building scalable applications.
- **Express**: Web framework for Node.js to handle routing and HTTP requests.
- **MongoDB**: NoSQL database to store user data, collections, and request histories.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Multer**: Middleware for handling file uploads.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/postman-clone-backend.git
cd postman-clone-backend
```

## Installation
```bash
npm install
```

## Set Up Environment Variables
Create a .env file in the root of the project and add the following:
```bash
PORT=
MONGODB_URI=
JWT_SECRET=
```

## Start the Server
```bash
npm startw
```