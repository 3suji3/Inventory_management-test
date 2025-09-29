import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Package, Truck, Factory, ArrowRightLeft, Settings, Users, Tags, BarChart3, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Page } from '../App';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

interface ModuleButton {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  page: Page;
  color: string;
  count?: number;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const moduleButtons: ModuleButton[] = [
    {
      id: 'basicInfo',
      title: '기초정보 설정',
      description: '품목등록, 공장정보, 바코드 템플릿',
      icon: <Settings className="w-8 h-8" />,
      page: 'basicInfo',
      color: 'bg-[#724323]'
    },
    {
      id: 'receiving',
      title: '입고/검수',
      description: '구매입고 스캔, 원재료 라벨프린트',
      icon: <Truck className="w-8 h-8" />,
      page: 'receiving',
      color: 'bg-[#A3C478]',
      count: 12
    },
    {
      id: 'plant1',
      title: '1공장 전처리',
      description: '공정시작 스캔, 전처리 산출',
      icon: <Factory className="w-8 h-8" />,
      page: 'plant1Processing',
      color: 'bg-[#F9B679]',
      count: 8
    },
    {
      id: 'transfer',
      title: '공장간 이동',
      description: '1공장 출고 → 2공장 입고',
      icon: <ArrowRightLeft className="w-8 h-8" />,
      page: 'interPlantTransfer',
      color: 'bg-[#724323]',
      count: 3
    },
    {
      id: 'plant2',
      title: '2공장 베이킹/포장',
      description: 'MO발행, 베이킹 공정, 포장',
      icon: <Factory className="w-8 h-8" />,
      page: 'plant2Manufacturing',
      color: 'bg-[#A3C478]',
      count: 15
    },
    {
      id: 'shipping',
      title: '출고관리',
      description: 'B2B/B2C 피킹, FEFO 우선',
      icon: <Truck className="w-8 h-8" />,
      page: 'shipping',
      color: 'bg-[#F9B679]',
      count: 6
    },
    {
      id: 'label',
      title: '라벨 프린트',
      description: 'ZPL 템플릿, 브라우저 출력',
      icon: <Tags className="w-8 h-8" />,
      page: 'labelManagement',
      color: 'bg-[#724323]'
    },
    {
      id: 'inventory',
      title: '재고/이력 조회',
      description: '로트별 추적, 유통기한 관리',
      icon: <BarChart3 className="w-8 h-8" />,
      page: 'inventoryHistory',
      color: 'bg-[#A3C478]'
    },
    {
      id: 'users',
      title: '사용자/권한',
      description: 'RBAC 기반 접근제어',
      icon: <Users className="w-8 h-8" />,
      page: 'userManagement',
      color: 'bg-[#F9B679]'
    }
  ];

  const todayStats = [
    { label: '오늘 입고', value: '24건', icon: <Truck className="w-5 h-5 text-[#A3C478]" />, trend: '+12%' },
    { label: '제조 진행', value: '15건', icon: <Factory className="w-5 h-5 text-[#F9B679]" />, trend: '+8%' },
    { label: '출고 완료', value: '18건', icon: <Package className="w-5 h-5 text-[#724323]" />, trend: '+5%' },
    { label: '재고 알람', value: '3건', icon: <AlertTriangle className="w-5 h-5 text-red-500" />, trend: '-2건' }
  ];

  const urgentTasks = [
    { title: '유통기한 임박 품목', count: 8, priority: 'high', icon: <Clock className="w-4 h-4 text-red-500" /> },
    { title: '재고 부족 원재료', count: 3, priority: 'medium', icon: <Package className="w-4 h-4 text-orange-500" /> },
    { title: '승인 대기 라벨', count: 2, priority: 'medium', icon: <Tags className="w-4 h-4 text-orange-500" /> },
    { title: '품질검사 완료', count: 12, priority: 'low', icon: <CheckCircle className="w-4 h-4 text-[#A3C478]" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#724323]">애니콩 펫베이커리 제조관리 시스템</h1>
          <p className="text-[#333333] mt-1">2025년 9월 11일 목요일 • 듀얼 플랜트 운영 중</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#A3C478] rounded-lg">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-white font-medium">시스템 정상 운영</span>
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {todayStats.map((stat, index) => (
          <Card key={index} className="border border-[#F5E9D5]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#333333] mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-[#724323]">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-[#A3C478]" />
                    <span className="text-xs text-[#A3C478]">{stat.trend}</span>
                  </div>
                </div>
                <div className="p-3 bg-[#F5E9D5] rounded-lg">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Module Dashboard */}
      <Card className="border border-[#F5E9D5]">
        <CardHeader>
          <CardTitle className="text-[#724323] flex items-center gap-2">
            <Package className="w-5 h-5" />
            주요 모듈
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {moduleButtons.map((module) => (
              <Button
                key={module.id}
                variant="ghost"
                className="h-auto p-6 hover:bg-[#F5E9D5] border border-[#F5E9D5] rounded-xl"
                onClick={() => onNavigate(module.page)}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`p-4 ${module.color} rounded-xl text-white relative`}>
                    {module.icon}
                    {module.count && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {module.count}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-[#724323] mb-1">{module.title}</h3>
                    <p className="text-sm text-[#333333]">{module.description}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Urgent Tasks & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-[#F5E9D5]">
          <CardHeader>
            <CardTitle className="text-[#724323] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              긴급 처리 사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#F5E9D5] rounded-lg">
                  <div className="flex items-center gap-3">
                    {task.icon}
                    <div>
                      <p className="font-medium text-[#724323]">{task.title}</p>
                      <p className="text-sm text-[#333333]">{task.count}건 대기</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-[#724323] hover:bg-white">
                    처리
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#F5E9D5]">
          <CardHeader>
            <CardTitle className="text-[#724323] flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              생산 현황 (오늘)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#333333]">1공장 전처리</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-[#F5E9D5] rounded-full">
                    <div className="w-3/4 h-full bg-[#A3C478] rounded-full"></div>
                  </div>
                  <span className="text-sm text-[#724323] font-medium">75%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#333333]">2공장 제조</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-[#F5E9D5] rounded-full">
                    <div className="w-4/5 h-full bg-[#F9B679] rounded-full"></div>
                  </div>
                  <span className="text-sm text-[#724323] font-medium">80%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#333333]">포장/출고</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-[#F5E9D5] rounded-full">
                    <div className="w-3/5 h-full bg-[#724323] rounded-full"></div>
                  </div>
                  <span className="text-sm text-[#724323] font-medium">60%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}