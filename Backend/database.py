from pymongo import MongoClient

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)
db = client["hrms_db"]

employees_col = db["employees"]
attendance_col = db["attendance"]

employees_col.create_index("emp_id", unique=True)
attendance_col.create_index([("emp_id", 1), ("date", 1)], unique=True)
