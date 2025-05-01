import mysql.connector
import os

os.environ['DB_HOST'] = 'hopper.proxy.rlwy.net'
os.environ['DB_PORT'] = '55960'
os.environ['DB_USER'] = 'root'
os.environ['DB_PASS'] = ''
os.environ['DB_NAME'] = 'railway'

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS'),
        database=os.getenv('DB_NAME'),
        port=int(os.getenv('DB_PORT'))
    )