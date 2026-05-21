from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from clustering import perform_clustering
from assignment import assign_agents
import uvicorn

app = FastAPI(title="NexRoute ML Microservice", version="2.0.0")

class LocationPoint(BaseModel):
    id: str
    lat: float
    lng: float
    weight: float = 1.0

class ClusteringRequest(BaseModel):
    locations: List[LocationPoint]
    num_clusters: int = None # If None, will determine automatically

class AgentPoint(BaseModel):
    id: str
    lat: float
    lng: float
    capacity: float
    efficiency: float

class AssignmentRequest(BaseModel):
    clusters: List[Dict[str, Any]] # Output from clustering
    agents: List[AgentPoint]

@app.get("/")
def health_check():
    return {"status": "operational", "engine": "scikit-learn"}

@app.post("/ml/clustering")
def calculate_clusters(request: ClusteringRequest):
    """
    Groups delivery locations into optimized regions using K-Means clustering.
    """
    locations_dict = [loc.dict() for loc in request.locations]
    clusters = perform_clustering(locations_dict, request.num_clusters)
    return {"status": "success", "clusters": clusters}

@app.post("/ml/assignment")
def calculate_assignment(request: AssignmentRequest):
    """
    Assigns agents to clusters based on capacity, distance, and historical efficiency.
    """
    agents_dict = [agent.dict() for agent in request.agents]
    assignments = assign_agents(request.clusters, agents_dict)
    return {"status": "success", "assignments": assignments}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
