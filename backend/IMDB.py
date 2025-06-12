from bs4 import BeautifulSoup
import requests
import json, sqlite3

#url = 'https://www.imdb.com/chart/moviemeter/'
#url = 'https://www.imdb.com/chart/top/'
url = 'https://www.imdb.com/india/top-rated-indian-movies/'
headers =  {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'}
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, 'html.parser')
movies = soup.find_all('div', class_='ipc-metadata-list-summary-item sc-3f724978-0 enKyEL cli-parent')
# movies = soup.find_all('li', class_='ipc-metadata-list-summary-item')
# movies = soup.find_all('li', class_='ipc-metadata-list__item ipc-metadata-list__item--inline ipc-metadata-list-item--link')
sqliteconnection = sqlite3.connect('db.sqlite3')
cursor = sqliteconnection.cursor()
count = 1
for movie in movies[35:]:
    try:
        url = 'https://imdb.com' + movie.find('a', {'class': 'ipc-title-link-wrapper'})['href']
        # url = 'https://imdb.com' + movie.find('a', {'class': 'ipc-metadata-list-item__icon-link'})['href']
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        script= soup.find('script', {'type': 'application/ld+json'}).text
        ldjs = json.loads(script)
        script= soup.find('script', {'type': 'application/json'}).text
        js = json.loads(script)
        id = js['props']['pageProps']['aboveTheFoldData']['id']
        genres = ''
        for g in ldjs['genre']:
            genres += g + ','
        release_date = f"{js['props']['pageProps']['mainColumnData']['releaseDate']['year']}-{js['props']['pageProps']['mainColumnData']['releaseDate']['month']}-{js['props']['pageProps']['mainColumnData']['releaseDate']['day']}"
        url = 'https://imdb.com/title/' + id + '/plotsummary/'
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        description = soup.find('ul', class_='ipc-metadata-list ipc-metadata-list--dividers-between sc-c1dc6938-0 ekAPnh meta-data-list-full ipc-metadata-list--base').text
        platforms = "Amazon Prime"
        duration = js['props']['pageProps']['aboveTheFoldData']['runtime']['displayableProperty']['value']['plainText']
        languages = ''
        for lng in js['props']['pageProps']['mainColumnData']['spokenLanguages']['spokenLanguages']:
            languages = languages + lng['text'] + ','
        country = js['props']['pageProps']['mainColumnData']['releaseDate']['country']['text']
        sql_query = """INSERT INTO core_movie VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"""
        try:
            cursor.execute(sql_query, (
                id,
                ldjs.get('name'),
                ldjs.get('image'),
                description,
                ldjs['aggregateRating']['ratingValue'],
                platforms,
                release_date,
                ldjs['contentRating'],
                ldjs['trailer']['embedUrl'],
                duration,
                ldjs.get('keywords'),
                languages,
                genres
            ))
        except Exception as e:
            print(e)
            continue
        url = 'https://imdb.com/title/' + id + '/reviews/'
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        reviews = soup.find_all('div', class_="review-container")
        for review in reviews:
            title = review.find('a').text
            try:
                rating = review.find('div', class_='ipl-ratings-bar').text.strip()
            except:
                rating = '7/10'
            date = review.find('span', class_='review-date').text
            body = review.find('div', class_="text show-more__control").text
            sql_query = f"""INSERT INTO core_review(title, body, date, rating, movie_id) VALUES (?, ?, ?, ?, ?);"""
            try:
                cursor.execute(sql_query, (
                    title, body, date, rating, id
                ))
            except Exception as e:
                print(e)
                continue
        sqliteconnection.commit()
    except Exception as e:
        print(e)
    print(count)
    count+=1
sqliteconnection.close()