import pandas as pd

def read_csv_file(filepath):
    df = pd.read_csv(filepath)
    return df

def get_columns(df):
    return list(df.columns)

def get_preview_data(df, rows=10):
    return df.head(rows).to_dict(orient="records")