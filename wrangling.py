import pandas as pd

# =================productivity-vs-annual-hours-worked.csv======================

df = pd.read_csv('original_data/productivity-vs-annual-hours-worked.csv')
df.dropna(subset=['Annual working hours per worker'], inplace=True)
df.dropna(subset=['Productivity: output per hour worked'], inplace=True)

entity_continent = {}
code = []
for index, row in df.iterrows():
    if not pd.isna(row['Continent']):
        continent = row['Continent']
        entity = row['Entity']
        entity_continent[entity] = continent

continent = df['Continent']
missing_continent = []
for index, row in df.iterrows():
    entity = row['Entity']
    try:
        continent[index] = entity_continent[entity]
    except KeyError:
        if entity not in missing_continent:
            missing_continent.append(entity)

print(missing_continent)
entity_continent['Jamaica'] = 'North America'
entity_continent['South Africa'] = 'Africa'
entity_continent['Trinidad and Tobago'] = 'South America'
entity_continent['Venezuela'] = 'South America'

missing_continent = []
for index, row in df.iterrows():
    entity = row['Entity']
    continent[index] = entity_continent[entity]

df['Continent'] = continent

df = df.rename(columns={'Entity': 'entity',
                        'Year': 'year',
                        'Code': 'code',
                        'Annual working hours per worker': 'working_hours',
                        'Productivity: output per hour worked': 'pophw',
                        'Population (historical estimates)': 'population',
                        'Continent': 'continent'
                        })

population = df['population']
population = population / 1000000
df['population'] = population

cleaned_df = df
# ================================================================================


# =================health expenditure rate=========================================
df = pd.read_csv('original_data/World Development Indicators.csv')
df = df.rename(columns={'Time': 'year',
                        'Country Code': 'code',
                        'Adjusted net national income per capita (current US$) [NY.ADJ.NNTY.PC.CD]': 'income',
                        'Current health expenditure per capita (current US$) [SH.XPD.CHEX.PC.CD]': 'health'
                        })

df = df.drop(columns=['Time Code', 'Country Name'])

df['year'] = df['year'].astype(str)
df['code'] = df['code'].astype(str)

# Convert 'year' and 'code' columns in df2 to string
cleaned_df['year'] = cleaned_df['year'].astype(str)
cleaned_df['code'] = cleaned_df['code'].astype(str)
cleaned_df = pd.merge(cleaned_df, df, on=['year', 'code'])

cleaned_df = cleaned_df.replace('..', pd.NA)
cleaned_df = cleaned_df.dropna()

cleaned_df['health'] = cleaned_df['health'].astype(float)
cleaned_df['income'] = cleaned_df['income'].astype(float)
cleaned_df['income_p_hour'] = cleaned_df['income']/cleaned_df['working_hours']
cleaned_df['health_share'] = cleaned_df['health']/cleaned_df['income']
cleaned_df.to_csv('data_years.csv', index=None)
# ================================================================================


# =================food expenditure rate=========================================
df = pd.read_csv('original_data/food-expenditure-share-gdp.csv')
df = df.rename(columns={'Code': 'code',
                        'Year': 'year',
                        'share_expenditure_food': 'food_share'
                        })
df = df.drop(columns=['Entity', 'consumer_expenditure', 'Continent'])
cleaned_df['year'] = cleaned_df['year'].astype(str)
cleaned_df['code'] = cleaned_df['code'].astype(str)
df['year'] = df['year'].astype(str)
df['code'] = df['code'].astype(str)
cleaned_df = pd.merge(cleaned_df,df,on=['code','year'])
print(cleaned_df.columns)


