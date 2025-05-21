import { useEffect, useState } from "react";
import { getUsers } from "../../services/api";

export const useGetUsers = (stateFilter = undefined) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getUsers(stateFilter);
      setUsers(data);
    } catch (err) {
      setError("Error al cargar los usuarios.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [stateFilter]);

  return {
    users,
    isLoading,
    error,
    refresh: fetchUsers,
  };
};
