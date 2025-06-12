from bs4 import BeautifulSoup
import requests
import json, sqlite3

headers =  {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'}
count = 1
sqliteconnection = sqlite3.connect('db.sqlite3')
cursor = sqliteconnection.cursor()
sql_query = 'SELECT name FROM core_movie;'
cursor.execute(sql_query)
movies = cursor.fetchall()
for movie in movies:
    try:
        url = 'https://www.rottentomatoes.com/search?search=' + movie[0]
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        result = soup.find('search-page-media-row')
        url = result.find('a')['href']
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        description = soup.find('p', {'data-qa':"movie-info-synopsis"}).text
        wtwm = soup.find_all('where-to-watch-meta')
        platforms = ''
        for _ in wtwm:
            platforms += str.title(_['affiliate'].replace('-', ' ').replace('us', '').strip()) + ','
        sql_query = f"UPDATE core_movie SET platforms = ?, description = ? WHERE name = ?;"
        cursor.execute(sql_query, (platforms, description, movie[0]))
    except Exception as e:
        print(e)
    sqliteconnection.commit()
    print(count)
    count+=1
sqliteconnection.close()