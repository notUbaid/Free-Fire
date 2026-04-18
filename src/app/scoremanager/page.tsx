"use client";

import { useState } from "react";

interface Team {
  id: string;
  team_name: string;
  kills: number;
  placement_points: number;
  total_points: number;
  rounds_played: number;
  eliminated: boolean;
}

function ScoreManagerPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  const checkPassword = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/scores-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams);
        setAuthenticated(true);
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  const updateScore = async (id: string, field: string, value: any) => {
    const res = await fetch("/api/scores-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, field, value, password }),
    });

    if (res.ok) {
      setTeams(teams.map(t => {
        if (t.id !== id) return t;
        const updated = { ...t, [field]: value };
        // Recalculate total
        updated.total_points = updated.kills + updated.placement_points;
        return updated;
      }));
    }
  };

  const addTeamToScores = async (teamName: string) => {
    const res = await fetch("/api/scores-add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setTeams([...teams, data.team]);
    }
  };

  const removeFromScores = async (teamName: string) => {
    if (!confirm(`Remove ${teamName} from scoreboard?`)) return;
    
    const res = await fetch("/api/scores-remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName, password }),
    });

    if (res.ok) {
      setTeams(teams.filter(t => t.team_name !== teamName));
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">🎯 Score Manager</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkPassword()}
            placeholder="Enter admin password"
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            onClick={checkPassword}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">🎯 Score Manager</h1>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-3 text-gray-400 font-medium">Team</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Kills</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Placement</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Total</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Rounds</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id} className="border-t border-gray-700">
                    <td className="p-3">
                      <input
                        type="text"
                        defaultValue={team.team_name}
                        onBlur={(e) => updateScore(team.id, "team_name", e.target.value)}
                        className="bg-gray-700 text-orange-500 font-bold px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        defaultValue={team.kills}
                        onBlur={(e) => updateScore(team.id, "kills", parseInt(e.target.value) || 0)}
                        className="w-16 bg-gray-700 text-white px-2 py-1 rounded"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        defaultValue={team.placement_points}
                        onBlur={(e) => updateScore(team.id, "placement_points", parseInt(e.target.value) || 0)}
                        className="w-16 bg-gray-700 text-white px-2 py-1 rounded"
                      />
                    </td>
                    <td className="p-3 text-green-500 font-bold">
                      {team.kills + team.placement_points}
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        defaultValue={team.rounds_played}
                        onBlur={(e) => updateScore(team.id, "rounds_played", parseInt(e.target.value) || 0)}
                        className="w-16 bg-gray-700 text-white px-2 py-1 rounded"
                      />
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => updateScore(team.id, "eliminated", !team.eliminated)}
                        className={`px-2 py-1 rounded text-xs ${
                          team.eliminated 
                            ? "bg-red-600 text-white" 
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {team.eliminated ? "Eliminated" : "Active"}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => removeFromScores(team.team_name)}
                        className="text-red-500 hover:text-red-400 text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreManagerPage;