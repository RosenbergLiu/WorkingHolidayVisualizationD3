import pandas as pd

#=================productivity-vs-annual-hours-worked.csv======================

df = pd.read_csv("original_data\productivity-vs-annual-hours-worked.csv")
df.dropna(subset=['Annual working hours per worker'], inplace=True)
df.dropna(subset=['Productivity: output per hour worked'], inplace=True)

entity_continent = {}
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
                        'Annual working hours per worker': 'awhpw',
                        'Productivity: output per hour worked': 'pophw',
                        'Population (historical estimates)': 'population',
                        'Continent': 'continent'
                        })


population = df['population']
population = population/1000000
df['population']=population


df = df.drop('Code', axis=1)



df.to_csv('cleaned_data\productivity-vs-annual-hours-worked.csv', index=None)


#============================================================================

#=================productivity-vs-annual-hours-worked.csv======================