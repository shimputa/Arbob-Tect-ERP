import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { usePermission } from '../../contexts/PermissionContext';
import CreatePayslip from './CreatePayslip';
import PayslipList from './PayslipList';
import AdvanceList from './AdvanceList';

function Salary({ payslips, onDelete, onPrint, onSubmit, isLoading, error, setError, onRefresh }) {
  const location = useLocation();
  const { hasPermission } = usePermission();

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
      throw error;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Routes>
        {/* Only show create payslip route if user has salary:create permission */}
        {hasPermission('salary:create') && (
          <Route 
            path="create-payslip" 
            element={<CreatePayslip onSubmit={handleSubmit} />} 
          />
        )}
        
        {/* Only show payslip list route if user has salary:view permission */}
        {hasPermission('salary:view') && (
          <Route
            path="payslip-list"
            element={
              <PayslipList
                payslips={payslips}
                onDelete={hasPermission('salary:delete') ? onDelete : null}
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
        )}
        
        {/* Only show advance list route if user has advance:view permission */}
        {hasPermission('advance:view') && (
          <Route path="advance-list" element={<AdvanceList />} />
        )}
      </Routes>
    </div>
  );
}

export default Salary;
