import pandas as pd
from pandas._libs.parsers import TextReader
from sqlalchemy import create_engine, Column, Integer, Float, String, Date
from sqlalchemy.orm import declarative_base, sessionmaker

df = pd.read_excel("data/trades.xlsx", header=None)

df = df.set_index(0)

df = df.transpose()

df["trade_id"] = df["trade_id"].astype(int)
df["quantity"] = df["quantity"].astype(int)

df["price"] = df["price"].astype(float)

df["trade_date"] = pd.to_datetime(df["trade_date"])

print(df.dtypes)

print(df.iloc[:, :8])

engine = create_engine('sqlite:///trades.db', echo=True)
Base = declarative_base()


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


Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

objects = [
    Stock(trade_id=row[0],
          symbol=row[1],
          trade_date=row[2],
          side=row[3],
          quantity=row[4],
          price=row[5],
          trader=row[6],
          strategy=row[7]) for row in df.values
]

session.add_all(objects)

try:
  session.commit()
  logging.info("Data successfully written to the database.")
except Exception as e:
  logging.error(f"An error occurred during data transfer: {e}")



