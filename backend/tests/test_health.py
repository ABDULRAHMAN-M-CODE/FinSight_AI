#get enviroment variables.,must always be in the top of the test file
from dotenv import load_dotenv

load_dotenv() 
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"