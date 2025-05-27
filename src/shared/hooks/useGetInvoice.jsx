import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getInvoices } from "../../services/api"; 

export const useGetInvoices = (role) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    if (!role) {
      toast.error("Rol no definido");
      return;
    }

    setLoading(true);
    try {
      const response = await getInvoices(role);

      if (response.success) {
        setInvoices(response.invoices || []);
      } else {
        toast.error("No se pudieron obtener las facturas.");
        setInvoices([]);
      }
    } catch (error) {
      console.error("ERROR FACTURAS:", error);
      const msg = error.response?.data?.message || "Error al cargar facturas";
      toast.error(msg);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [role]);

  return { invoices, loading, refetch: fetchInvoices };
};
