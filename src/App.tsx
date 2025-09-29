import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNavigation } from './components/TopNavigation';
import { Dashboard } from './components/Dashboard';
import { BasicInfoPage } from './components/pages/BasicInfoPage';
import { ReceivingPage } from './components/pages/ReceivingPage';
import { Plant1ProcessingPage } from './components/pages/Plant1ProcessingPage';
import { InterPlantTransferPage } from './components/pages/InterPlantTransferPage';
import { Plant2ManufacturingPage } from './components/pages/Plant2ManufacturingPage';
import { ShippingPage } from './components/pages/ShippingPage';
import { LabelManagementPage } from './components/pages/LabelManagementPage';
import { InventoryHistoryPage } from './components/pages/InventoryHistoryPage';
import { UserManagementPage } from './components/pages/UserManagementPage';
import { QuickDispatchPage } from './components/pages/QuickDispatchPage';
import { ProductionOrdersPage } from './components/pages/ProductionOrdersPage';
import { DocumentApprovalPage } from './components/pages/DocumentApprovalPage';
import { ProductionCalendarPage } from './components/pages/ProductionCalendarPage';
import { DocumentRepositoryPage } from './components/pages/DocumentRepositoryPage';

export type Page = 
  | 'dashboard'
  | 'basicInfo'
  | 'receiving'
  | 'plant1Processing'
  | 'interPlantTransfer'
  | 'plant2Manufacturing'
  | 'shipping'
  | 'labelManagement'
  | 'inventoryHistory'
  | 'userManagement'
  | 'quickDispatch'
  | 'productionOrders'
  | 'documentApproval'
  | 'productionCalendar'
  | 'documentRepository';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'basicInfo':
        return <BasicInfoPage />;
      case 'receiving':
        return <ReceivingPage />;
      case 'plant1Processing':
        return <Plant1ProcessingPage />;
      case 'interPlantTransfer':
        return <InterPlantTransferPage />;
      case 'plant2Manufacturing':
        return <Plant2ManufacturingPage />;
      case 'shipping':
        return <ShippingPage />;
      case 'labelManagement':
        return <LabelManagementPage />;
      case 'inventoryHistory':
        return <InventoryHistoryPage />;
      case 'userManagement':
        return <UserManagementPage />;
      case 'quickDispatch':
        return <QuickDispatchPage />;
      case 'productionOrders':
        return <ProductionOrdersPage />;
      case 'documentApproval':
        return <DocumentApprovalPage />;
      case 'productionCalendar':
        return <ProductionCalendarPage />;
      case 'documentRepository':
        return <DocumentRepositoryPage />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="h-screen flex bg-[#FAF6F2]" style={{ fontFamily: 'Noto Sans, Inter, sans-serif' }}>
      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <TopNavigation 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
        
        {/* Activity Log / User Shortcuts */}
        <div className="h-8 bg-[#724323] flex items-center justify-end px-4">
          <span className="text-[#FAF6F2] text-sm">
            애니콩 펫베이커리 관리시스템 v2.1 | 현재 사용자: 관리자 | 오늘 처리된 작업: 24건
          </span>
        </div>
      </div>
    </div>
  );
}