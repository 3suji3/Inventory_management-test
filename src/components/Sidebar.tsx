import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon, Package, Truck, Factory, ArrowRightLeft, Settings, Users, Tags, BarChart3, Home, Send, FileText, CheckCircle, Calendar, FolderOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Page } from '../App';
import logoImage from 'figma:asset/1857cfd3ecb0bb78cefbe3423e800ebdb44713a5.png';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  page?: Page;
  children?: MenuItem[];
}

export function Sidebar({ currentPage, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['basic', 'manufacturing', 'inventory', 'production', 'approval']);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: '대시보드',
      icon: <Home className="w-4 h-4" />,
      page: 'dashboard'
    },
    {
      id: 'basic',
      label: '기초정보',
      icon: <Settings className="w-4 h-4" />,
      children: [
        { id: 'basicInfo', label: '품목등록', icon: <Package className="w-3 h-3" />, page: 'basicInfo' },
        { id: 'factoryInfo', label: '공장정보', icon: <Factory className="w-3 h-3" />, page: 'basicInfo' },
        { id: 'barcodeTemplate', label: '바코드 템플릿', icon: <Tags className="w-3 h-3" />, page: 'labelManagement' }
      ]
    },
    {
      id: 'receiving',
      label: '입고관리',
      icon: <Truck className="w-4 h-4" />,
      children: [
        { id: 'purchaseReceiving', label: '구매입고', icon: <Package className="w-3 h-3" />, page: 'receiving' },
        { id: 'inspection', label: '검수처리', icon: <BarChart3 className="w-3 h-3" />, page: 'receiving' }
      ]
    },
    {
      id: 'manufacturing',
      label: '제조관리',
      icon: <Factory className="w-4 h-4" />,
      children: [
        { id: 'plant1', label: '1공장 전처리', icon: <Factory className="w-3 h-3" />, page: 'plant1Processing' },
        { id: 'transfer', label: '공장간 이동', icon: <ArrowRightLeft className="w-3 h-3" />, page: 'interPlantTransfer' },
        { id: 'plant2', label: '2공장 제조', icon: <Factory className="w-3 h-3" />, page: 'plant2Manufacturing' }
      ]
    },
    {
      id: 'inventory',
      label: '재고관리',
      icon: <Package className="w-4 h-4" />,
      children: [
        { id: 'inventoryLookup', label: '재고조회', icon: <BarChart3 className="w-3 h-3" />, page: 'inventoryHistory' },
        { id: 'historyTrace', label: '이력추적', icon: <ArrowRightLeft className="w-3 h-3" />, page: 'inventoryHistory' }
      ]
    },
    {
      id: 'shipping',
      label: '출고관리',
      icon: <Truck className="w-4 h-4" />,
      children: [
        { id: 'b2bShipping', label: 'B2B 출고', icon: <Truck className="w-3 h-3" />, page: 'shipping' },
        { id: 'b2cShipping', label: 'B2C 출고', icon: <Package className="w-3 h-3" />, page: 'shipping' },
        { id: 'quickDispatch', label: '출고 간편등록', icon: <Send className="w-3 h-3" />, page: 'quickDispatch' }
      ]
    },
    {
      id: 'production',
      label: '생산관리',
      icon: <Factory className="w-4 h-4" />,
      children: [
        { id: 'productionOrders', label: '생산지시서 관리', icon: <FileText className="w-3 h-3" />, page: 'productionOrders' },
        { id: 'productionCalendar', label: '제조이력 캘린더', icon: <Calendar className="w-3 h-3" />, page: 'productionCalendar' }
      ]
    },
    {
      id: 'approval',
      label: '전자결재',
      icon: <CheckCircle className="w-4 h-4" />,
      children: [
        { id: 'documentApproval', label: '결재시스템', icon: <CheckCircle className="w-3 h-3" />, page: 'documentApproval' },
        { id: 'documentRepository', label: '문서보관함', icon: <FolderOpen className="w-3 h-3" />, page: 'documentRepository' }
      ]
    },
    {
      id: 'labelMgmt',
      label: '라벨관리',
      icon: <Tags className="w-4 h-4" />,
      page: 'labelManagement'
    },
    {
      id: 'userMgmt',
      label: '사용자관리',
      icon: <Users className="w-4 h-4" />,
      page: 'userManagement'
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.page === currentPage;

    return (
      <div key={item.id}>
        <Button
          variant="ghost"
          className={`w-full justify-start px-2 py-1.5 h-auto ${
            level > 0 ? 'ml-4' : ''
          } ${
            isActive 
              ? 'bg-[#724323] text-[#FAF6F2] hover:bg-[#724323] hover:text-[#FAF6F2]' 
              : 'text-[#333333] hover:bg-[#F5E9D5]'
          }`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.page) {
              onNavigate(item.page);
            }
          }}
        >
          <div className="flex items-center gap-2 flex-1">
            {item.icon}
            {!collapsed && (
              <>
                <span className="text-sm">{item.label}</span>
                {hasChildren && (
                  <div className="ml-auto">
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </div>
                )}
              </>
            )}
          </div>
        </Button>
        
        {hasChildren && isExpanded && !collapsed && (
          <div className="ml-2">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border-r border-[#F5E9D5] flex flex-col transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-[#F5E9D5] flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="애니콩 로고" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="font-medium text-[#724323]">애니콩</h2>
              <p className="text-xs text-[#333333]">펫 베이커리</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-1 h-auto hover:bg-[#F5E9D5]"
        >
          {collapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-[#F5E9D5]">
        {!collapsed && (
          <div className="text-xs text-[#333333] text-center">
            <p>ver 2.1.0</p>
            <p className="text-[#A3C478]">● 연결됨</p>
          </div>
        )}
      </div>
    </div>
  );
}