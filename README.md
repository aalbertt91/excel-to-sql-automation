# Excel-to-SQL Trade ETL Automation

This repository contains a Python-based automation tool designed to streamline the ETL (Extract, Transform, Load) process for financial trade logs. It converts raw, unstructured Excel data into a structured SQLite database using a robust ORM mapping.

# 📌 Problem & Solution
Manual entry of trade data from Excel to databases is time-consuming and prone to human error, which can lead to inaccurate P&L reporting and financial risk.

This automation bot:

Eliminates manual data manipulation by automating the reshaping of Excel spreadsheets.

Enforces data integrity through automated type conversion (trade_id, quantity, price, trade_date).

Cleans the dataset by identifying and removing incomplete or null records.

Provides real-time execution feedback via structured logging.

# 🛠 Tech Stack
**Python:** Core logic and automation.

**Pandas:** Data manipulation and cleaning.

**SQLAlchemy (ORM):** Database schema management and secure data insertion.

**SQLite:** Lightweight relational database storage.

**Logging:** Monitoring execution flow and identifying data gaps.

# ⚙️ Core Automation Workflow
Ingestion: Reads raw trades.xlsx from the /data directory.

Transformation: Transposes and reshapes the DataFrame to match the database schema.

Validation: Checks for null values and enforces numeric/datetime formats.

Loading: Maps data to a Stock ORM model and commits it to a SQL database.

# 📊 Example Output
When the script is executed, it provides structured feedback on the ETL process:

```bash
INFO:root:Rows before cleanup: 2, after cleanup: 2
INFO:root:Data successfully written to the database.
INFO:root:2 rows successfully written to the database.
```

# 🚀 How to Run
1. Place your trade file in data/trades.xlsx.

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the automation:

```bash
python src/exceltosqlbot.py
```
