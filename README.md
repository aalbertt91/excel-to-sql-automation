# Excel to SQL Automation Bot

## Project Objective

This project automates the extraction, transformation, and loading (ETL) of trade data from Excel files into a SQLite database. It ensures data consistency, removes incomplete records, and converts columns to appropriate data types for downstream analysis or reporting.

## Technologies Used

**Python:** Core programming language for data processing.

**Pandas:** For data cleaning, manipulation, and type conversion.

**SQLAlchemy:** For ORM-based database interaction.

**SQLite:** Lightweight database to store trade records.

**Logging:** To track data processing steps and potential issues.

## How to Run

1. Place your trade Excel file in the data/ folder.

2. Ensure the required Python libraries are installed:

pip install -r requirements.txt


3. Run the script:

python src/exceltosqlbot.py


4. Check the trades.db SQLite database for successfully inserted trade records.

## Why This Is Valuable for a Hedge Fund

- Ensures accurate and clean trade records for analysis.

- Provides a reliable ETL pipeline to automate repetitive data tasks.

- Enables fast querying and data validation before further financial modeling.

- Reduces human error in data entry and processing.