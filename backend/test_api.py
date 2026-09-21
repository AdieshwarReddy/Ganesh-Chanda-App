import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_endpoints():
    print("Testing GET /campaign/current...")
    r = requests.get(f"{BASE_URL}/campaign/current")
    print(f"Status: {r.status_code}, Response: {r.json()}")
    assert r.status_code == 200

    print("\nTesting POST /donations...")
    donation_data = {
        "donor_name": "Ramesh Sharma",
        "donor_phone": "9876543210",
        "donor_email": "ramesh@example.com",
        "amount": 501.0,
        "payment_method": "UPI",
        "upi_reference_id": "UPI1234567890",
        "address": "Flat 402, Ganesh Nagar",
        "is_anonymous": False,
        "message": "Ganpati Bappa Morya!"
    }
    r = requests.post(f"{BASE_URL}/donations", json=donation_data)
    print(f"Status: {r.status_code}")
    res = r.json()
    print("Created Donation:", json.dumps(res, indent=2))
    assert r.status_code == 201
    assert "receipt_number" in res
    assert res["receipt_number"].startswith("GC-")
    print("Receipt Number generated successfully:", res["receipt_number"])

    print("\nTesting GET /donations/public...")
    r = requests.get(f"{BASE_URL}/donations/public")
    print(f"Status: {r.status_code}, Count: {len(r.json())}")
    assert r.status_code == 200

    print("\nAll Core API tests PASSED successfully!")

if __name__ == "__main__":
    test_endpoints()
