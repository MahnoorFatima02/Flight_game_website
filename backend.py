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
    def __init__(self, username, password):
        self.username = username
        self.password = password
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
            query = "SELECT money, fuel, people_saved, municipality_visited, fuel_efficiency, airport.name, fuel_price, country.name, location, latitude_deg, longitude_deg FROM game, airport, country WHERE location = ident and airport.iso_country=country.iso_country and username = %s AND password = %s"
            cursor.execute(query, (self.username, self.password))
            player_details = cursor.fetchone()
            cursor.close()

            return player_details

        except Exception as e:
            print(f"Error: {e}")
            return None
#in class Player, you can get all data from table game in database, plus current player country, airport, coordinates
def select_three_random_countries():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM country ORDER BY RAND() LIMIT 3")
        countries = [row[0] for row in cursor.fetchall()]
        cursor.close()
        return countries
    except mysql.connector.Error as err:
        print("Error: {}".format(err))
        return None
#this returns a list of 3 random countries
class Airport:
    def __init__(self, chosen_country):
        self.chosen_country = chosen_country
        self.details = self.airports_details()
        self.a1name = self.details[0][0]
        self.a1people = self.details[0][1]
        self.a1fuel_price= self.details[0][2]
        self.a1probability = self.details[0][3]
        self.a1coordinate = (self.details[0][4],self.details[0][5])
        self.a2name = self.details[1][0]
        self.a2people = self.details[1][1]
        self.a2fuel_price= self.details[1][2]
        self.a2probability = self.details[1][3]
        self.a2coordinate = (self.details[1][4], self.details[1][5])
        self.a3name = self.details[2][0]
        self.a3people = self.details[2][1]
        self.a3fuel_price = self.details[2][2]
        self.a3probability = self.details[2][3]
        self.a3coordinate = (self.details[2][4], self.details[2][5])
        self.a4name = self.details[3][0]
        self.a4people = self.details[3][1]
        self.a4fuel_price = self.details[3][2]
        self.a4probability = self.details[3][3]
        self.a4coordinate = (self.details[3][4], self.details[3][5])
        self.a5name = self.details[4][0]
        self.a5people = self.details[4][1]
        self.a5fuel_price = self.details[4][2]
        self.a5probability = self.details[4][3]
        self.a5coordinate = (self.details[4][4], self.details[4][5])


    def airports_details(self):
        try:
            cursor = conn.cursor()
            query = "SELECT name, people, fuel_price, probability, latitude_deg, longitude_deg FROM airport WHERE iso_country = (select iso_country from country where name = %s) ORDER BY RAND() LIMIT 5"
            cursor.execute(query, (self.chosen_country,))
            airports = cursor.fetchall()
            cursor.close()
            return airports
        except mysql.connector.Error as err:
            print("Error: {}".format(err))
            return None
#in class Airport you can get all datas of 5 random airports from a country plus the airports coordinates
def distance(a,b):
    dist=geodesic(a,b).kilometers
    return dist
#get distant of 2 locations

#example
u = "t"
p = "t"
player =Player(u,p)
countries = select_three_random_countries()
list = Airport(countries[0])
distant = distance(player.current_coordinate, list.a1coordinate)
print(distant)

