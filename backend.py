import mysql.connector
from geopy.distance import geodesic

# Connect to the MySQL database
conn = mysql.connector.connect(
    host='127.0.0.1',
    port=3306,
    database='flight_game',
    user='travis',
    password='database123',
    autocommit=True
)

import mysql.connector

class Player:
    def __init__(self, username):
        self.username = username
        self.details = self.player_details()
        self.money = self.details[0]
        self.fuel = self.details[1]
        self.people_saved = self.details[2]
        self.countries_visited = self.details[3]
        self.fuel_efficiency = self.details[4]
        self.current_airport = self.details[5]
        self.current_fuel_price = self.details[6]
        self.current_country = self.details[7]
        self.current_ident = self.details[8]
        self.current_coordinate = (self.details[9],self.details[10])

    def player_details(self):
        try:

            cursor = conn.cursor()
            query = "SELECT money, fuel, people_saved, municipality_visited, fuel_efficiency, airport.name, fuel_price, country.name, location, latitude_deg, longitude_deg FROM game, airport, country WHERE location = ident and airport.iso_country=country.iso_country and username = %s"
            cursor.execute(query, (self.username, ))
            player_details = cursor.fetchone()
            cursor.close()

            return player_details

        except Exception as e:
            print(f"Error: {e}")
            return None
#in class Player, you can get all data from table game in database, plus current player country, airport, coordinates
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
    except Exception as err:
        print("Error: {}".format(err))
        return None

# @app.route('/status', methods=['GET'])
def get_status(username):
    try:
        cursor = conn.cursor()
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
        cursor = conn.cursor()
        query = "SELECT money, fuel, people_saved, municipality_visited, fuel_efficiency, name, fuel_price FROM game, airport WHERE location = ident and username = %s"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        return result
    except Exception as err:
        print("Error: {}".format(err))
        return None
def select_three_random_countries():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM country ORDER BY RAND() LIMIT 3")
        countries = [row[0] for row in cursor.fetchall()]
        return countries
    except Exception as err:
        print("Error: {}".format(err))
        return None

