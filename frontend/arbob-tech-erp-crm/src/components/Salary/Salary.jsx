import React, { useEffect } from 'react';
import { Route, Routes ,useLocation} from 'react-router-dom';

import CreatePayslip from './CreatePayslip';
import PayslipList from './PayslipList';

function Salary({ payslips, onDelete, onPrint, onSubmit, isLoading, error, setError, onRefresh }) {
  const location = useLocation();

  // Reset error when route changes
  useEffect(() => {
    if (error && location.pathname === '/salary/payslip-list') {
      setError(null);
    }
  }, [location.pathname, setError, error]);
  const handleSubmit = async (payslipData) => {
    try {
      const response = await onSubmit(payslipData);
      if (onRefresh) {
        onRefresh(); // Refresh the payslips list after successful creation
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Routes>
      <Route path="create-payslip" element={<CreatePayslip onSubmit={handleSubmit} />} />
      <Route
        path="payslip-list"
        element={
          <PayslipList
           payslips={payslips}
            onDelete={onDelete}
            onPrint={onPrint}
            isLoading={isLoading}
            error={error}
            onRefresh={() => {
              setError(null);
              onRefresh();
            }}
          />
        }
      />
    </Routes>
  </div>
  );
}

export default Salary;
