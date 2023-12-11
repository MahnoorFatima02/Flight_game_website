import time

from flask import Flask, jsonify, request
from flaskext.mysql import MySQL
from geopy.distance import geodesic
from flask_cors import CORS
from urllib.parse import unquote_plus

app = Flask(__name__)
mysql = MySQL(app)
cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'flightgameuser'
app.config['MYSQL_DATABASE_PASSWORD'] = '123Maa123'
app.config['MYSQL_DATABASE_DB'] = 'flight_game'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'


def distance(a,b):
    dist = geodesic(a, b).kilometers
    return dist
#
def get_coordinate_by_name(name):
    sql = "select longitude_deg, latitude_deg from airport"
    sql += " where airport.name = '" + name + "'"
    cursor = mysql.get_db().cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    if cursor.rowcount > 0:
        for row in result:
            coord = (row[1],row[0])
    return coord
#
def get_coordinate_by_ident(username):
    sql = "select longitude_deg, latitude_deg from airport"
    sql += " where airport.ident = (select location from game where username ='" + username + "')"
    cursor = mysql.get_db().cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    if cursor.rowcount > 0:
        for row in result:
            coord = (row[1],row[0])
    return coord
#
# def register_new_user(connection,username,password):
#
#     try:
#         cursor = connection.cursor()
#         insert_query = "INSERT INTO game (username, password, money, fuel, people_saved, municipality_visited, fuel_efficiency, location) VALUES (%s, %s, 3000, 1000, 0, 0, 0.8, 'EFHK')"
#         cursor.execute(insert_query, (username, password))
#         connection.commit()
#         cursor.close()
#         print("New user registered successfully!")
#     except mysql.connector.Error as err:
#         print("Error: {}".format(err))
#
# def login_existing_user(connection,username,password):
#     try:
#         cursor = connection.cursor()
#         select_query = "SELECT * FROM game WHERE username = %s AND password = %s"
#         cursor.execute(select_query, (username, password))
#         if cursor.fetchone() is not None:
#             print("Login successful! Welcome, existing user.")
#             return True
#         else:
#             print("Login failed. Username or password is incorrect.")
#             return False
#         cursor.close()
#     except mysql.connector.Error as err:
#         print("Error: {}".format(err))
#
def select_five_random_airports(country_name):
    try:
        cursor = mysql.get_db().cursor()
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
    except Exception as err:
        print("Error: {}".format(err))
        return None

# @app.route('/status', methods=['GET'])
def get_status(username):
    try:
        cursor = mysql.get_db().cursor()
        query = "SELECT money, fuel, people_saved, municipality_visited, fuel_efficiency, airport.name, fuel_price, country.name FROM game, airport, country WHERE location = ident and airport.iso_country=country.iso_country and username = %s"
        cursor.execute(query, (username))
        result = cursor.fetchone()
        status = {}
        status["money"] = result[0]
        status["fuel"] = result[1]
        status["people_saved"] = result[2]
        status["municipality_visited"] = result[3]
        status["fuel_efficiency"] = result[4]
        status["fuel_price"] = result[5]
        return status
    except Exception as err:
        print("Error: {}".format(err))
        return None

def get_status_without_printing(username):
    try:
        cursor = mysql.get_db().cursor()
        query = "SELECT money, fuel, people_saved, municipality_visited, fuel_efficiency, name, fuel_price FROM game, airport WHERE location = ident and username = %s"
        cursor.execute(query, (username))
        result = cursor.fetchone()
        return result
    except Exception as err:
        print("Error: {}".format(err))
        return None


@app.route('/airportStatus/<airport>', methods=['GET'])
def get_airport_status_without_printing(airport):
    try:
        cursor = mysql.get_db().cursor()
        airport_name = unquote_plus(airport)
        print(airport_name)
        query = ("SELECT name, people, fuel_price, probability FROM airport WHERE name = %s")
        cursor.execute(query, (airport_name))
        result = cursor.fetchone()
        status = {}
        status["name"] = result[0]
        status["people"] = result[1]
        status["fuel_price"] = result[2]
        status["probability"] = result[3]
        return status

    except Exception as err:
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
        cursor = mysql.get_db().cursor()
        update_query = "UPDATE game SET money = %s, fuel = %s WHERE username = %s"
        cursor.execute(update_query, (money, fuel, username))
        mysql.get_db().commit()
        return get_status(username)
    except Exception as err:
        print("Error: {}".format(err))
        return None


@app.route('/status', methods=['GET'])
def game_status():
    username = request.headers['username']
    try:
        return get_status(username)
    except Exception as err:
        print("Error: {}".format(err))
        return None


@app.route('/start-over', methods=['GET'])
def start_over():
    username = request.headers['username']
    try:
        cursor = mysql.get_db().cursor()
        update_query = "Update game set fuel = 1000, money = 3000, people_saved=0, municipality_visited=0, location='EFHK' where username = %s"
        cursor.execute(update_query, (username))
        mysql.get_db().commit()
        return get_status(username)
    except Exception as err:
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
        cursor = mysql.get_db().cursor()
        update_query = "UPDATE game SET fuel = %s, location = (select distinct ident from airport where name = %s), people_saved = people_saved + (select distinct people from airport where name = %s), municipality_visited = municipality_visited + 1 WHERE username = %s"
        cursor.execute(update_query, (fuel_left, airport_name, airport_name, username))
        mysql.get_db().commit()
        return get_status(username)
    except Exception as err:
        print("Error: {}".format(err))
        return None


def select_three_random_countries():
    try:
        cursor = mysql.get_db().cursor()
        cursor.execute("SELECT name FROM country ORDER BY RAND() LIMIT 3")
        countries = [row[0] for row in cursor.fetchall()]
        return countries
    except Exception as err:
        print("Error: {}".format(err))
        return None
#
@app.route('/countries', methods=['GET'])
def get_countries():
    while True:
        countries = select_three_random_countries()
        return jsonify({'countries': countries})


# @app.before_request
# def isValidUser():
#     if request.method != 'OPTIONS':
#         try:
#             username = request.headers['username']
#             select_query = "SELECT * FROM game WHERE username = %s"
#             cursor = mysql.get_db().cursor()
#             cursor.execute(select_query, (username))
#             if cursor.fetchone() is not None:
#                 print("Login successful! Welcome, existing user.")
#             else:
#                 print("Login failed. Username or password is incorrect.")
#                 return "Unauthorized", 401  # Return a 401 Unauthorized response
#         except Exception as e:
#             return jsonify({'error': str("Error occured")})
    # else:
    #     return "Bad Request", 400  # Return a 401 Unauthorized response

@app.route('/country-airports/<country>', methods=['GET'])
def user_choose_airport(country):
    response = select_five_random_airports(country)
    return jsonify({'airports': response})


# def rob(connection, airport_name, username):
#     airport_status = get_airport_status_without_printing(connection, airport_name)
#     probability = airport_status[3]
#
#     if probability == 1 or probability == 10:
#         print("You've entered an evil airport. You are about to be robbed!")
#         time.sleep(1)
#
#         while True:
#             print("Choose a debuff:")
#             time.sleep(1)
#             print("1. Lose half of your money")
#             time.sleep(1)
#             print("2. Decrease fuel efficiency by 0.2")
#             time.sleep(1)
#
#             choice = input("Enter 1 or 2: ")
#
#             if choice == "1":
#                 player_status = get_status_without_printing(connection, username)
#                 money = player_status[0]
#                 money /= 2
#                 print(f"You've lost half of your money. Your new money value is {money}")
#                 time.sleep(1)
#                 try:
#                     cursor = connection.cursor()
#                     update_query = "UPDATE game SET money = %s WHERE username = %s"
#                     cursor.execute(update_query, (money, username))
#                     connection.commit()
#                     cursor.close()
#                 except mysql.connector.Error as err:
#                     print("Error: {}".format(err))
#                 get_status(connection, username)
#
#                 break
#
#             elif choice == "2":
#                 player_status = get_status_without_printing(connection, username)
#                 fuel_efficiency = player_status[4]
#                 fuel_efficiency -= 0.2
#                 print(f"Your fuel efficiency has decreased by 0.2. It's now {fuel_efficiency:.1f}")
#                 time.sleep(1)
#                 try:
#                     cursor = connection.cursor()
#                     update_query = "UPDATE game SET fuel_efficiency = %s WHERE username = %s"
#                     cursor.execute(update_query, (fuel_efficiency, username))
#                     connection.commit()
#                     cursor.close()
#                 except mysql.connector.Error as err:
#                     print("Error: {}".format(err))
#                 get_status(connection, username)
#                 break
#
#             else:
#                 print("Invalid choice. Please enter 1 or 2.")

@app.route('/bless-airport/<airport>', methods=['GET'])
def reward(airport):
    airport_name = unquote_plus(airport)
    airport_status = get_airport_status_without_printing(airport_name)
    probability = airport_status[3]
    return probability

@app.route('/handlefunction-1', methods=['GET'])
def handlefunction1():
    username = request.headers['username']
    player_status = get_status_without_printing(username)
    money = player_status[0]
    money += 2000
    print(f"You've gained 2000 money. Your new money value is {money}")
    try:
        cursor = mysql.get_db().cursor()
        update_query = "UPDATE game SET money = %s WHERE username = %s"
        cursor.execute(update_query, (money, username))
        mysql.get_db().commit()
        return get_status(username)
    except Exception as err:
        print("Error: {}".format(err))
        return None


@app.route('/handlefunction-2', methods=['GET'])
def handlefunction2():
    username = request.headers['username']
    player_status = get_status_without_printing(username)
    fuel_efficiency = player_status[4]
    fuel_efficiency += 0.2
    print(f"Your fuel efficiency has increased by 0.2. It's now {fuel_efficiency}")

    try:
        cursor = mysql.get_db().cursor()
        update_query = "UPDATE game SET fuel_efficiency = %s WHERE username = %s"
        cursor.execute(update_query, (fuel_efficiency, username))
        mysql.get_db().commit()
        return get_status(username)
    except Exception as err:
        print("Error: {}".format(err))
        return None




