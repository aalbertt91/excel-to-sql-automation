import pandas as pd

df = pd.read_excel("data/trades.xlsx")

print(df.iloc[:, :6])
