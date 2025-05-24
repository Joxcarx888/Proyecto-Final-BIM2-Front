import { useState } from 'react';
import toast from 'react-hot-toast';
import { createInvoice, createInvoiceEvent } from '../../services/api';

export const useCreateInvoiceUnified = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoice, setInvoice] = useState(null);

  const handleCreateInvoice = async ({ type, data }) => {
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
      let response;

      if (type === 'reservation') {
        response = await createInvoice(data); 
        setInvoice(response.invoice);
      } else if (type === 'event') {
        response = await createInvoiceEvent(data); 
        setInvoice(response.invoiceEvent);
      } else {
        throw new Error("Tipo de factura inválido. Usa 'reservation' o 'event'.");
      }

      toast.success("Factura generada correctamente");
    } catch (err) {
      console.error("Error desde el hook unificado:", err);
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
