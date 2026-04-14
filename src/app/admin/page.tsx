"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Registration {
  id: string;
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  leader_school: string;
  player2_name: string;
  player2_phone: string;
  player2_school: string;
  player3_name: string;
  player3_phone: string;
  player3_school: string;
  player4_name: string | null;
  player4_phone: string | null;
  player4_school: string | null;
  created_at: string;
}

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [error, setError] = useState("");

  const checkPassword = async () => {
    setLoading(true);
    if (password === "Admin@CSGC#") {
      setAuthenticated(true);
      fetchRegistrations();
    } else {
      setError("Invalid password");
    }
    setLoading(false);
  };

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setRegistrations(data);
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm("Delete this registration?")) return;
    
    const { error } = await supabase.from("registrations").delete().eq("id", id);
    if (!error) {
      fetchRegistrations();
    }
  };

  const updateRegistration = async (id: string, field: string, value: string) => {
    const { error } = await supabase
      .from("registrations")
      .update({ [field]: value })
      .eq("id", id);

    if (!error) {
      fetchRegistrations();
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">🔐 Admin Login</h1>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">📊 Admin Panel</h1>
          <button
            onClick={fetchRegistrations}
            className="text-orange-500 text-sm hover:underline"
          >
            Refresh
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-3 text-gray-400 font-medium">Team</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Leader</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Email</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Phone</th>
                  <th className="text-left p-3 text-gray-400 font-medium">School</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Players</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-t border-gray-700">
                    <td className="p-3 text-orange-500 font-bold">{reg.team_name}</td>
                    <td className="p-3 text-white">{reg.leader_name}</td>
                    <td className="p-3 text-gray-300">{reg.leader_email}</td>
                    <td className="p-3 text-gray-300">{reg.leader_phone}</td>
                    <td className="p-3 text-gray-300">{reg.leader_school}</td>
                    <td className="p-3 text-gray-300">
                      <div className="space-y-1">
                        <div>P2: {reg.player2_name}</div>
                        <div>P3: {reg.player3_name}</div>
                        {reg.player4_name && <div>P4: {reg.player4_name}</div>}
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteRegistration(reg.id)}
                        className="text-red-500 hover:text-red-400 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-gray-500 text-sm">
          Total: {registrations.length} teams
        </div>
      </div>
    </div>
  );
}

export default AdminPage;