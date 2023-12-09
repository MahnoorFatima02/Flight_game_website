from flask import Flask, request, jsonify, render_template
import mysql.connector
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

if __name__ == '__main__':
    app.run(debug=True)
