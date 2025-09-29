import React from 'react';
import { Button } from './ui/button';
import { Settings, Factory, BarChart3, Tags, ShoppingCart, Truck, Bell, User } from 'lucide-react';
import { Page } from '../App';

interface TopNavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  page: Page;
}

export function TopNavigation({ currentPage, onNavigate }: TopNavigationProps) {
  const tabs: TabItem[] = [
    { id: 'basicInfo', label: '기초정보', icon: <Settings className="w-4 h-4" />, page: 'basicInfo' },
    { id: 'manufacturing', label: '제조', icon: <Factory className="w-4 h-4" />, page: 'plant1Processing' },
    { id: 'quality', label: '품질', icon: <BarChart3 className="w-4 h-4" />, page: 'inventoryHistory' },
    { id: 'label', label: '라벨', icon: <Tags className="w-4 h-4" />, page: 'labelManagement' },
    { id: 'order', label: '주문', icon: <ShoppingCart className="w-4 h-4" />, page: 'receiving' },
    { id: 'shipping', label: '출고', icon: <Truck className="w-4 h-4" />, page: 'shipping' }
  ];

  return (
    <div className="bg-white border-b border-[#F5E9D5] px-6 py-2">
      <div className="flex items-center justify-between">
        {/* Tab Navigation */}
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={`px-4 py-2 h-auto rounded-lg transition-all ${
                tab.page === currentPage || 
                (currentPage === 'plant2Manufacturing' && tab.id === 'manufacturing') ||
                (currentPage === 'interPlantTransfer' && tab.id === 'manufacturing') ||
                (currentPage === 'userManagement' && tab.id === 'basicInfo')
                  ? 'bg-[#724323] text-[#FAF6F2] hover:bg-[#724323] hover:text-[#FAF6F2]'
                  : 'text-[#333333] hover:bg-[#F5E9D5]'
              }`}
              onClick={() => onNavigate(tab.page)}
            >
              <div className="flex items-center gap-2">
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2 h-auto hover:bg-[#F5E9D5]">
            <Bell className="w-4 h-4 text-[#333333]" />
          </Button>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#F5E9D5] rounded-lg">
            <User className="w-4 h-4 text-[#724323]" />
            <span className="text-sm text-[#724323] font-medium">관리자</span>
            <div className="w-2 h-2 bg-[#A3C478] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}