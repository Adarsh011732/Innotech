import httpx

def test_endpoints():
    client = httpx.Client(base_url="http://127.0.0.1:8000")

    print("Testing /api/health ...")
    r = client.get("/api/health")
    assert r.status_code == 200, f"Health failed: {r.text}"
    print("->", r.json())

    print("Testing /api/accounts/summary ...")
    r = client.get("/api/accounts/summary")
    assert r.status_code == 200, f"Summary failed: {r.text}"
    print("->", r.json())

    print("Testing /api/forecast/cashflow ...")
    r = client.get("/api/forecast/cashflow?horizon_days=30")
    assert r.status_code == 200, f"Forecast failed: {r.text}"
    f_data = r.json()
    print("-> Points count:", len(f_data["trajectory"]), "Coverage:", f_data["coverage_level"])

    print("Testing /api/risk/stress ...")
    r = client.get("/api/risk/stress")
    assert r.status_code == 200, f"Stress failed: {r.text}"
    s_data = r.json()
    print("-> Solvency score:", s_data["solvency_score"], "Risk level:", s_data["risk_level"])

    print("Testing /api/goals ...")
    r = client.get("/api/goals")
    assert r.status_code == 200
    goals = r.json()
    print("-> Goals count:", len(goals))
    goal_id = goals[0]["id"]

    print(f"Testing /api/goals/{goal_id}/evaluate ...")
    r = client.get(f"/api/goals/{goal_id}/evaluate")
    assert r.status_code == 200
    g_eval = r.json()
    print("-> Feasibility:", g_eval["probabilistic_feasibility"], "Recourse profiles count:", len(g_eval["recourse_profiles"]))

    print("Testing /api/xai/stability-test ...")
    r = client.post("/api/xai/stability-test?noise_pct=5.0")
    assert r.status_code == 200
    stab = r.json()
    print("-> TreeSHAP Kendall tau:", stab["metrics"][0]["kendall_tau_rank_correlation"])

    print("\nALL BACKEND API TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    test_endpoints()
