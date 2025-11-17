import { useAuth } from "@/hooks/useAuth";

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-4">
      <h1>Welcome, {user?.email}</h1>

      <button
        onClick={() => logout.mutate()}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
