from bs4 import BeautifulSoup
import requests
import csv, time, json, sqlite3

url = 'https://www.imdb.com/search/title/?title_type=feature&primary_language=hi'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'}
response = requests.get(url, headers=headers)
# with open('movies.html') as response:
soup = BeautifulSoup(response.content, 'html.parser')
movies = soup.find_all('li', class_='ipc-metadata-list-summary-item')
sqliteconnection = sqlite3.connect('db.sqlite3')
cursor = sqliteconnection.cursor()
count = 1
for movie in movies:
    url = 'https://imdb.com' + movie.find('a', {'class': 'ipc-title-link-wrapper'})['href']
    res = requests.get(url, headers=headers)
    s = BeautifulSoup(res.content, 'html.parser')
    srcipt= s.find('script', {'type': 'application/ld+json'}).text
    js = dict(json.loads(srcipt))
    genre = ''
    for g in js['genre']:
        genre += g + ','
    platforms = "Amazon Prime"
    sql_query = f"""INSERT OR IGNORE INTO core_movie VALUES (
        \'{js['url'].split('/')[-2]}\',
        \'{js['name']}\',
        \'{js['image']}\',
        \'{js['description']}\',
        {js['aggregateRating']['ratingValue']},
        'Amazon Prime',
        \'{js.get('datePublished', 'NaN')}\',
        \'{js.get('contentRating')}\',
        \'{js['trailer']['embedUrl']}\',
        \'{js['duration']}\',
        \'{js.get('keywords')}\',
        \'{js.get("inLanguage", "Hindi")}\',
        \'{genre}\'
    );"""
    try:
        sqliteconnection.execute(sql_query)
    except Exception as e:
        print(e)
        continue
    print(count)
    count+=1
    sqliteconnection.commit()

sqliteconnection.close()
