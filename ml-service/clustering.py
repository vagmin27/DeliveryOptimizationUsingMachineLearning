import numpy as np
import pandas as pd
from sklearn.cluster import KMeans

def determine_optimal_clusters(locations):
    """
    In a real scenario, use elbow method or silhouette score.
    For simplicity, 1 cluster per 10 locations.
    """
    n = len(locations)
    if n == 0:
        return 0
    return max(1, min(n // 10, 10))

def perform_clustering(locations, num_clusters=None):
    if not locations:
        return []

    df = pd.DataFrame(locations)
    coords = df[['lat', 'lng']].values

    if num_clusters is None or num_clusters <= 0:
        num_clusters = determine_optimal_clusters(locations)
        # Ensure we don't request more clusters than samples
        num_clusters = min(num_clusters, len(locations))

    if len(locations) < num_clusters:
        num_clusters = len(locations)

    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(coords)

    centroids = kmeans.cluster_centers_

    clusters_output = []
    for i in range(num_clusters):
        cluster_data = df[df['cluster'] == i]
        clusters_output.append({
            "cluster_id": str(i),
            "centroid": {"lat": float(centroids[i][0]), "lng": float(centroids[i][1])},
            "parcel_ids": cluster_data['id'].tolist(),
            "total_weight": float(cluster_data['weight'].sum()),
            "parcel_count": len(cluster_data)
        })

    return clusters_output
