# Placement_Cell
This web application allows employees to manage student interviews and results. It also includes a feature to fetch external job listings and export interview data to CSV.


Copy code
git clone [(https://github.com/DeekshaTiwari5/Placement_Cell.git]
cd your-repo
Install Dependencies

bash

npm install
Set Environment Variables

Create a .env file in the root directory with the following:

plaintext
Copy code
PORT=8000
MONGODB_URI=your_mongodb_uri
SECRET_KEY=your_secret_key_for_sessions
Database Setup

Ensure MongoDB is installed and running.
Update MONGODB_URI in .env with your MongoDB connection string.
Running the App

bash

npm start
The app will be running at http://localhost:8000.

Folder Structure
models/: Contains database models (students, interviews, results).
controllers/: Handles application logic.
routes/: Defines API endpoints and their corresponding controllers.
views/: Contains EJS/HBS files for rendering HTML.
public/: Stores static assets like CSS, JS, images.
Features
Authentication: Sign up and sign in functionality for employees.
Student Management: Add, view, and allocate students for interviews.
Interviews: Create, manage, and mark results for interviews.
External Jobs List (Bonus Feature): Fetch and display real-time job listings.
CSV Export
Access the /export-csv route to download interview data in CSV format.
Columns: Student ID, Name, College, Status, Scores, Interview Date, Company, Result.
Dependencies
Express.js
Mongoose (or other database library)
Passport.js (for authentication)
CSV-writer (or similar CSV library)
