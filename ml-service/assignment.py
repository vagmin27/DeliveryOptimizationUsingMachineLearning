import numpy as np

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = np.radians(lat2 - lat1)
    dlon = np.radians(lon2 - lon1)
    a = np.sin(dlat/2) * np.sin(dlat/2) + np.cos(np.radians(lat1)) \
        * np.cos(np.radians(lat2)) * np.sin(dlon/2) * np.sin(dlon/2)
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))
    return R * c

def assign_agents(clusters, agents):
    """
    Greedy assignment of agents to clusters based on a scoring function
    Score = (W1 * Distance) - (W2 * Efficiency) + Penalty(Capacity Exceeded)
    Lower score is better.
    """
    assignments = []
    
    # Track available agents and their remaining capacity
    available_agents = agents.copy()

    for cluster in clusters:
        cluster_lat = cluster['centroid']['lat']
        cluster_lng = cluster['centroid']['lng']
        cluster_weight = cluster['total_weight']

        best_agent = None
        best_score = float('inf')
        best_agent_idx = -1

        for idx, agent in enumerate(available_agents):
            dist = haversine_distance(cluster_lat, cluster_lng, agent['lat'], agent['lng'])
            
            # Simple heuristic scoring
            score = dist - (agent['efficiency'] * 0.1)
            
            if agent['capacity'] < cluster_weight:
                score += 1000 # Heavy penalty for exceeding capacity
                
            if score < best_score:
                best_score = score
                best_agent = agent
                best_agent_idx = idx
                
        if best_agent:
            assignments.append({
                "cluster_id": cluster['cluster_id'],
                "agent_id": best_agent['id'],
                "score": float(best_score),
                "distance_km": float(haversine_distance(cluster_lat, cluster_lng, best_agent['lat'], best_agent['lng']))
            })
            # Remove agent from available pool (assume 1 agent per cluster for simplicity)
            # In a more advanced VRP, an agent could take multiple clusters if capacity allows.
            available_agents.pop(best_agent_idx)
            
    return assignments
