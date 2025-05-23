import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createInvoice } from '../../services/api';

export const useCreateInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoice, setInvoice] = useState(null);

  const handleCreateInvoice = async (invoiceData) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user?.role?.toUpperCase();

    if (role !== 'CLIENT') {
      toast.error("Solo los clientes pueden generar facturas.");
      return;
    }

    setLoading(true);
    setError(null);
    setInvoice(null);

    try {
      const data = await createInvoice(invoiceData);
      setInvoice(data);
      toast.success("Factura generada correctamente");
    } catch (err) {
      console.error("Error desde el hook:", err);
      const message = err.response?.data?.message || err.message || 'Error al generar factura';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createInvoice: handleCreateInvoice,
    loading,
    error,
    invoice,
    clearMessages: () => {
      setError(null);
      setInvoice(null);
    }
  };
};
