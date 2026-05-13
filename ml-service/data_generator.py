import random
import datetime
from pymongo import MongoClient
import numpy as np

# City bounds (simulated for New York area for example, or a generic grid)
CITY_BOUNDS = {
    "min_lat": 40.5,
    "max_lat": 40.9,
    "min_lng": -74.0,
    "max_lng": -73.7
}

class LogisticsDataGenerator:
    def __init__(self, mongo_uri="mongodb://localhost:27017/", db_name="delivery_optimization"):
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]

    def generate_random_location(self):
        lat = random.uniform(CITY_BOUNDS["min_lat"], CITY_BOUNDS["max_lat"])
        lng = random.uniform(CITY_BOUNDS["min_lng"], CITY_BOUNDS["max_lng"])
        return [lng, lat] # GeoJSON uses [lng, lat]

    def generate_historical_analytics(self, days=30):
        """Generates daily throughput analytics to simulate past month data"""
        self.db.analytics_history.drop() # Clear old data
        
        history = []
        base_date = datetime.datetime.now() - datetime.timedelta(days=days)
        
        for i in range(days):
            current_date = base_date + datetime.timedelta(days=i)
            
            # Simulate weekday vs weekend demand (higher on weekdays)
            is_weekend = current_date.weekday() >= 5
            base_demand = random.randint(800, 1200) if not is_weekend else random.randint(400, 700)
            
            # Inject anomaly (e.g. holiday or rain)
            is_anomaly = random.random() < 0.1
            if is_anomaly:
                base_demand = int(base_demand * 1.5)
                
            efficiency = random.uniform(75.0, 95.0) if not is_anomaly else random.uniform(60.0, 80.0)
            fuel_saved = random.uniform(100, 500)
            
            record = {
                "date": current_date,
                "total_parcels": base_demand,
                "efficiency_score": efficiency,
                "fuel_saved_liters": fuel_saved,
                "delayed_deliveries": int(base_demand * (1 - (efficiency/100))),
                "is_anomaly": is_anomaly
            }
            history.append(record)
            
        if history:
            self.db.analytics_history.insert_many(history)
        print(f"Generated {days} days of historical analytics.")

    def generate_active_parcels(self, count=200):
        """Generates live active parcels to be processed by the simulation engine"""
        self.db.parcels.delete_many({"status": {"$in": ["pending", "assigned"]}})
        
        parcels = []
        for i in range(count):
            origin = self.generate_random_location()
            destination = self.generate_random_location()
            
            parcels.append({
                "trackingId": f"TRK-{random.randint(10000, 99999)}",
                "customerName": f"Customer {i}",
                "origin": { "type": "Point", "coordinates": origin },
                "destination": { "type": "Point", "coordinates": destination },
                "weight": random.uniform(0.5, 15.0),
                "volume": random.uniform(1.0, 10.0),
                "status": "pending",
                "createdAt": datetime.datetime.now()
            })
            
        if parcels:
            self.db.parcels.insert_many(parcels)
        print(f"Generated {count} pending parcels.")

    def seed_agents(self, count=20):
        """Generates active delivery agents"""
        self.db.deliveryagents.delete_many({}) # Clear old agents
        
        agents = []
        for i in range(count):
            location = self.generate_random_location()
            agents.append({
                "userRef": None, # Null for simulation bots
                "name": f"AI_Agent_{100+i}",
                "vehicleType": random.choice(['bike', 'van', 'truck', 'drone']),
                "capacity": random.uniform(50.0, 200.0),
                "currentLocation": { "type": "Point", "coordinates": location },
                "status": "available",
                "performanceScore": random.uniform(80.0, 100.0),
                "historicalEfficiency": random.uniform(85.0, 99.0),
                "routeCompletionRate": random.uniform(90.0, 100.0),
                "createdAt": datetime.datetime.now()
            })
            
        if agents:
            self.db.deliveryagents.insert_many(agents)
        print(f"Generated {count} delivery agents.")

if __name__ == "__main__":
    generator = LogisticsDataGenerator()
    print("Starting synthetic data generation...")
    generator.generate_historical_analytics(days=30)
    generator.seed_agents(count=30)
    generator.generate_active_parcels(count=250)
    print("Data generation complete.")
