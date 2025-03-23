import React, { useEffect } from 'react';
import { Route, Routes ,useLocation} from 'react-router-dom';

import CreatePayslip from './CreatePayslip';
import PayslipList from './PayslipList';
import AdvanceList from './AdvanceList';

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
      console.error("Error in Salary component:", error);
      // Don't transform the error, just pass it through
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
        <Route path="advance-list" element={<AdvanceList />} />
      </Routes>
    </div>
  );
}

export default Salary;
