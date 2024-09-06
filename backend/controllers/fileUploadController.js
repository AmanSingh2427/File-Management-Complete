const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const { Sequelize } = require("sequelize");
const ExcelData = require("../models/ExcelData"); // Import the model
const sequelize = require('../config/db'); // Assuming sequelize instance is in config/database.js

const upload = multer({ dest: "uploads/" });

// Define the expected column names
const expectedColumns = ["name", "email", "contact_no", "gender", "address"];

// Regular expression to validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handleFileUpload = async (req, res) => {
  const file = req.file;
  const uploadUsersId = req.body.upload_users_id;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();
  
  try {
    let data = [];
    let columnNames = [];

    // Check if the uploaded file is a .txt file
    if (file.mimetype === "text/plain") {
      const fileContent = fs.readFileSync(file.path, "utf8");
      const lines = fileContent.split("\n").filter(line => line.trim() !== "");

      if (lines.length === 0) {
        fs.unlinkSync(file.path); // Clean up uploaded file
        await transaction.rollback(); // Rollback the transaction
        return res.status(400).json({ message: "The file is empty" });
      }

      // Extract the column names from the first line
      columnNames = lines[0].split(" ").map(col => col.trim());

      // Check if the column names match the expected columns
      if (!validateColumns(columnNames, expectedColumns)) {
        fs.unlinkSync(file.path); // Clean up uploaded file
        await transaction.rollback(); // Rollback the transaction
        return res.status(400).json({ message: "Column names do not match expected format." });
      }

      // Parse the rest of the lines
      data = lines.slice(1).map((line) => {
        const values = line.split(" ");
        const row = {};

        // Map values to their respective column names
        columnNames.forEach((col, index) => {
          row[col] = values[index]?.trim() || "";
        });

        return row;
      });

    } else {
      // Assume it's an Excel file
      const workbook = xlsx.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

      // Check if the parsed data is empty
      if (data.length === 0) {
        fs.unlinkSync(file.path); // Clean up uploaded file
        await transaction.rollback(); // Rollback the transaction
        return res.status(400).json({ message: "The file is empty" });
      }

      // Extract column names from the first row
      columnNames = Object.keys(data[0]);

      // Check if the column names match the expected columns
      if (!validateColumns(columnNames, expectedColumns)) {
        fs.unlinkSync(file.path); // Clean up uploaded file\
        await transaction.rollback(); // Rollback the transaction
        return res.status(400).json({ message: "Column names do not match expected format." });
      }
    }

    // Check for duplicate emails within the file
    const emailSet = new Set();
    for (const row of data) {
      if (emailSet.has(row.email)) {
        fs.unlinkSync(file.path); // Clean up uploaded file
        await transaction.rollback(); // Rollback the transaction
        return res.status(400).json({ message: "The file contains duplicate email addresses." });
      }
      emailSet.add(row.email);
    }

    // Additional check: Verify if there's actual data beyond column names
    if (data.every(row => Object.values(row).every(value => value === ""))) {
      fs.unlinkSync(file.path); // Clean up uploaded file
      await transaction.rollback(); // Rollback the transaction
      return res.status(400).json({ message: "The file contains only column headers, no data found." });
    }

    // Validation check for all rows before inserting any data
    for (const row of data) {
      // Check if email is missing
      if (!row.email) {
        fs.unlinkSync(file.path); // Clean up uploaded file
        await transaction.rollback(); // Rollback the transaction
        return res.status(400).json({ message: "Please enter email for all rows." });
      }

      // Validate email format
      if (!emailRegex.test(row.email)) {
        fs.unlinkSync(file.path); // Clean up uploaded file
        await transaction.rollback(); // Rollback the transaction
        return res.status(400).json({ message: `Invalid email format for ${row.email}.` });
      }

      // Check if the email already exists in the database
      const existingRecord = await ExcelData.findOne({
        where: { email: row.email },
        transaction,
      });
      if (existingRecord) {
        fs.unlinkSync(file.path); // Clean up uploaded file
        await transaction.rollback(); // Rollback the transaction
        return res.status(400).json({
          message: `The email ${row.email} already exists in the database.`,
        });
      }

      // Check if the contact number is empty
      if (!row.contact_no) {
        fs.unlinkSync(file.path); // Clean up uploaded file
        await transaction.rollback(); // Rollback the transaction
        return res.status(400).json({ message: "Please enter your contact no for all rows." });
      }

      // Validate contact number length (must be 10 digits)
      if (!/^\d{10}$/.test(row.contact_no)) {
        fs.unlinkSync(file.path); // Clean up uploaded file
        await transaction.rollback(); // Rollback the transaction
        return res.status(400).json({ message: `Invalid contact number ${row.contact_no}. It must be exactly 10 digits.` });
      }
    }

    // Insert data into PostgreSQL after all validations pass
    for (const row of data) {
      await ExcelData.create({
        name: row.name,
        email: row.email,
        contact_no: row.contact_no,
        gender: row.gender,
        address: row.address,
        upload_users_id: uploadUsersId,
      }, { transaction });
    }

    // Commit the transaction
    await transaction.commit();

    // Clean up uploaded file
    fs.unlinkSync(file.path);

    res.json({ message: "File data successfully uploaded" });
  } catch (error) {
    // Rollback the transaction in case of error
    if (transaction) await transaction.rollback();
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to validate if columns match expected columns
const validateColumns = (columns, expectedColumns) => {
  if (columns.length !== expectedColumns.length) return false;
  return expectedColumns.every((col) => columns.includes(col));
};

module.exports = { upload, handleFileUpload };