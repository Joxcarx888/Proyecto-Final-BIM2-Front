import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getInvoicesByClient } from "../../services/api";

export const useGetInvoicesByClient = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await getInvoicesByClient();
      if (response.success) {
        setInvoices(response.invoices || []);
      } else {
        toast.error("No se pudieron obtener las facturas.");
        setInvoices([]);
      }
    } catch (error) {
      console.log("ERROR FACTURAS:", error);
      const msg = error.response?.data?.message || "Error al cargar facturas";
      toast.error(msg);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return { invoices, loading, refetch: fetchInvoices };
};
