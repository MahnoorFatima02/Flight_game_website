import time
from flask import Flask, request, jsonify, render_template
import mysql.connector
from urllib.parse import unquote_plus
from geopy.distance import geodesic

app = Flask(__name__)

# Connect to the MySQL database
conn = mysql.connector.connect(
    host='127.0.0.1',
    port=3306,
    database='flight_game',
    user='travis',
    password='database123',
    autocommit=True
)
def distance(a,b):
    dist = geodesic(a, b).kilometers
    return dist
def get_coordinate_by_name(name):
    sql = "select longitude_deg, latitude_deg from airport"
    sql += " where airport.name = '" + name + "'"
    cursor = conn.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    if cursor.rowcount > 0:
        for row in result:
            coord = (row[1],row[0])
    return coord
def get_coordinate_by_ident(username):
    sql = "select longitude_deg, latitude_deg from airport"
    sql += " where airport.ident = (select location from game where username ='" + username + "')"
    cursor = conn.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    if cursor.rowcount > 0:
        for row in result:
            coord = (row[1],row[0])
    return coord
def select_five_random_airports(country_name):
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT name, people, fuel_price, probability, longitude_deg, latitude_deg FROM airport WHERE iso_country = (select iso_country from country where name = %s) ORDER BY RAND() LIMIT 5",
            (country_name,)
        )
        query_result = cursor.fetchall()
        airports = []
        for a in query_result:
            airport = {}
            airport["airport"] = a[0]
            airport["people"] = a[1]
            airport["fuel_price"] = a[2]
            airport["probability"] = a[3]
            airport["longitude"] = a[4]
            airport["latitude"] = a[5]
            airports.append(airport)
        return airports
    except mysql.connector.Error as err:
        print("Error: {}".format(err))
        return None
# @app.route('/status', methods=['GET'])
def get_status(username):
    try:
        cursor = conn.cursor()
        query = "SELECT money, fuel, people_saved, municipality_visited, fuel_efficiency, airport.name, fuel_price, country.name FROM game, airport, country WHERE location = ident and airport.iso_country=country.iso_country and username = %s"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        status = {}
        status["money"] = result[0]
        status["fuel"] = result[1]
        status["people_saved"] = result[2]
        status["municipality_visited"] = result[3]
        status["fuel_efficiency"] = result[4]
        status["fuel_price"] = result[6]
        return status
    except mysql.connector.Error as err:
        print("Error: {}".format(err))
        return None
def get_status_without_printing(username):
    try:
        cursor = conn.cursor()
        query = "SELECT money, fuel, people_saved, municipality_visited, fuel_efficiency, name, fuel_price FROM game, airport WHERE location = ident and username = %s"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        return result
    except mysql.connector.Error as err:
        print("Error: {}".format(err))
        return None
def select_three_random_countries():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM country ORDER BY RAND() LIMIT 3")
        countries = [row[0] for row in cursor.fetchall()]
        return countries
    except mysql.connector.Error as err:
        print("Error: {}".format(err))
        return None
@app.route('/')
def gamewebsite():
    return render_template('game_website.html')
@app.route('/loginpage')
def loginpage():
    return render_template('login.html')
@app.route('/story')
def story():
    return render_template('story.html')
@app.route('/mainpage')
def mainpage():
    return render_template('main_page.html')
@app.route('/loginpage/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    try:
        cursor = conn.cursor()
        select_query = "SELECT * FROM game WHERE username = %s AND password = %s"
        cursor.execute(select_query, (username, password))
        if cursor.fetchone() is not None:
            response = jsonify({'success': True})
            return response
        else:
            response = jsonify({'success': False})
            return response
        cursor.close()
    except mysql.connector.Error as err:
        response = jsonify({'success': False})
        return response
@app.route('/loginpage/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    try:
        cursor = conn.cursor()
        select_query = "SELECT * FROM game WHERE username = %s"
        cursor.execute(select_query, (username,))
        if cursor.fetchone() is not None:
            response = jsonify({'success': False})
            return response
        else:
            try:
                cursor = conn.cursor()
                insert_query = "INSERT INTO game (username, password, money, fuel, people_saved, municipality_visited, fuel_efficiency, location) VALUES (%s, %s, 3000, 1000, 0, 0, 0.8, 'EFHK')"
                cursor.execute(insert_query, (username, password))
                conn.commit()
                cursor.close()
                response = jsonify({'success': True})
                return response
            except mysql.connector.Error as err:
                response = jsonify({'success': False})
                return response
    except mysql.connector.Error as err:
        response = jsonify({'success': False})
        return response
@app.route('/airportStatus/<airport>', methods=['GET'])
def get_airport_status_without_printing(airport):
    try:
        cursor = conn.cursor()
        airport_name = unquote_plus(airport)
        query = ("SELECT name, people, fuel_price, probability FROM airport WHERE name = %s")
        cursor.execute(query, (airport_name,))
        result = cursor.fetchone()
        status = {}
        status["name"] = result[0]
        status["people"] = result[1]
        status["fuel_price"] = result[2]
        status["probability"] = result[3]
        return status

    except mysql.connector.Error as err:
        print("Error: {}".format(err))
        return None
@app.route('/buyfuel/<amount>', methods=['GET'])
def buy_fuel(amount):
    username = request.headers['username']
    result = get_status_without_printing(username)
    money = result[0]
    fuel = result[1]
    fuel_price = result[6]
    spending = int(amount)
    if money >= spending:
        fuel += spending * fuel_price
        money -= spending
        print(f"Your total fuel now is {fuel}, and you have {money} money left.")
    else:
        print("You don't have enough money to buy fuel.")
    try:
        cursor = conn.cursor()
        update_query = "UPDATE game SET money = %s, fuel = %s WHERE username = %s"
        cursor.execute(update_query, (money, fuel, username))
        conn.commit()
        result = get_status(username)
        return result
    except mysql.connector.Error as err:
        print("Error: {}".format(err))
        return None
@app.route('/status', methods=['GET'])
def game_status():
    username = request.headers['username']
    result = get_status(username)
    return result

@app.route('/start-over', methods=['GET'])
def start_over():
    username = request.headers['username']
    try:
        cursor = conn.cursor()
        update_query = "Update game set fuel = 1000, money = 3000, people_saved=0, municipality_visited=0, location='EFHK' where username = %s"
        cursor.execute(update_query, (username,))
        conn.commit()
        result = get_status(username)
        return result
    except mysql.connector.Error as err:
        print("Error: {}".format(err))
        return None
@app.route('/travel/<airport>', methods=['GET'])
def travel(airport):
    username = request.headers['username']
    airport_name = unquote_plus(airport)
    destination = get_coordinate_by_name(airport_name)
    departure = get_coordinate_by_ident(username)
    dist = int(distance(destination,departure))
    status = get_status_without_printing(username)
    efficiency = status[4]
    current_fuel = status[1]
    fuel_needed = dist/efficiency
    fuel_left = current_fuel - fuel_needed
    try:
        cursor = conn.cursor()
        update_query = "UPDATE game SET fuel = %s, location = (select distinct ident from airport where name = %s), people_saved = people_saved + (select distinct people from airport where name = %s), municipality_visited = municipality_visited + 1 WHERE username = %s"
        cursor.execute(update_query, (fuel_left, airport_name, airport_name, username))
        conn.commit()
        result = get_status(username)
        return result
    except mysql.connector.Error as err:
        print("Error: {}".format(err))
        return None
@app.route('/countries', methods=['GET'])
def get_countries():
    while True:
        countries = select_three_random_countries()
        return jsonify({'countries': countries})
@app.route('/country-airports/<country>', methods=['GET'])
def user_choose_airport(country):
    c = country
    response = select_five_random_airports(c)
    return jsonify({'airports': response})


if __name__ == '__main__':
    app.run(debug=True)