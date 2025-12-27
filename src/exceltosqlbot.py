# Import required libraries for data processing, ORM mapping, and logging
import pandas as pd
from sqlalchemy import create_engine, Column, Integer, Float, String, Date
from sqlalchemy.orm import declarative_base, sessionmaker
import logging

# Configure basic logging to track execution flow and important events
logging.basicConfig(level=logging.INFO)

# Load raw trade data from Excel file
df = pd.read_excel("data/trades.xlsx", header=None)

# Reshape the DataFrame so that each row represents a single trade record
df = df.set_index(0)
df = df.transpose()

emptycell = df.isnull().sum().sum()

if emptycell > 0:
  logging.warning(f"There are {emptycell} empty cells in the dataframe")
else:
  pass

#print(df)

#print(df.isnull())

newdf = df.dropna().copy()

#print(newdf)

before = len(df)
after = len(newdf)
logging.info(f"Rows before cleanup: {before}, after cleanup: {after}")

# Convert DataFrame columns to appropriate data types before database insertion
newdf["trade_id"] = newdf["trade_id"].astype(int)
newdf["quantity"] = newdf["quantity"].astype(int)

newdf["price"] = newdf["price"].astype(float)

newdf["trade_date"] = pd.to_datetime(newdf["trade_date"])

# Debug output to verify data types and column order
#print(newdf.dtypes)
#  print(newdf.iloc[:, :8])

# Create database engine and declarative base for ORM mapping
engine = create_engine('sqlite:///trades.db', echo=False)
Base = declarative_base()


# ORM model representing the trades table
class Stock(Base):
  __tablename__ = 'trades'
  id = Column(Integer, primary_key=True)
  trade_id = Column(Integer)
  symbol = Column(String)
  trade_date = Column(Date)
  side = Column(String)
  quantity = Column(Integer)
  price = Column(Float)
  trader = Column(String)
  strategy = Column(String)


# Create database tables if they do not already exist
Base.metadata.create_all(engine)

# Initialize database session
Session = sessionmaker(bind=engine)
session = Session()

# Convert DataFrame rows into ORM Stock objects
objects = [
    Stock(trade_id=row[0],
          symbol=row[1],
          trade_date=row[2],
          side=row[3],
          quantity=row[4],
          price=row[5],
          trader=row[6],
          strategy=row[7]) for row in newdf.values
]

# Stage all ORM objects for database insertion
session.add_all(objects)

# Commit transaction and log success or failure
try:
  session.commit()
  logging.info("Data successfully written to the database.")
  logging.info(f"{len(objects)} rows successfully written to the database.")
except Exception as e:
  logging.error(f"An error occurred during data transfer: {e}")
