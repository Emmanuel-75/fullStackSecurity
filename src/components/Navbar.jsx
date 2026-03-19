import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, handleLogout } = useAuth();

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-3 flex justify-between items-center">
      <h2 className="text-white font-bold font-mono">Task Manager</h2>

      <div className="flex items-center gap-4">
        {/* show user name when logged in */}
        {user && (
          <span className="text-zinc-400 text-sm font-mono">
            {user.firstName} {user.lastName}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-sm bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded font-mono cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}