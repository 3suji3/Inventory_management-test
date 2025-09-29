import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BarChart3, Search, Package, MapPin, Clock, AlertTriangle, TrendingUp, Filter } from 'lucide-react';

export function InventoryHistoryPage() {
  const [inventoryData, setInventoryData] = useState([
    {
      id: 'INV001',
      code: 'RAW001',
      name: '닭고기 (가슴살)',
      category: '원재료',
      warehouse: 'P1-RM',
      location: 'A1-01',
      quantity: 250,
      unit: 'kg',
      lot: 'LOT20250909001',
      mfgDate: '2025-09-09',
      expiry: '2025-09-16',
      supplier: '프리미엄 육류',
      status: 'available'
    },
    {
      id: 'INV002',
      code: 'WIP001',
      name: '전처리 믹스 A',
      category: 'WIP',
      warehouse: 'P2-WIP',
      location: 'B2-05',
      quantity: 150,
      unit: 'kg',
      lot: 'LOT20250910002',
      mfgDate: '2025-09-10',
      expiry: '2025-09-13',
      supplier: '1공장 전처리',
      status: 'expiring_soon'
    },
    {
      id: 'INV003',
      code: 'FG001',
      name: '애니콩 펫베이커리 A',
      category: '완제품',
      warehouse: 'P2-FG',
      location: 'C3-12',
      quantity: 850,
      unit: 'ea',
      lot: 'LOT20250908003',
      mfgDate: '2025-09-08',
      expiry: '2025-10-08',
      supplier: '2공장 제조',
      status: 'available'
    },
    {
      id: 'INV004',
      code: 'RAW002',
      name: '당근',
      category: '원재료',
      warehouse: 'P1-RM',
      location: 'A2-08',
      quantity: 50,
      unit: 'kg',
      lot: 'LOT20250907004',
      mfgDate: '2025-09-07',
      expiry: '2025-09-21',
      supplier: '신선 농산',
      status: 'low_stock'
    }
  ]);

  const [historyData, setHistoryData] = useState([
    {
      id: 'HIS001',
      type: 'receiving',
      code: 'RAW001',
      name: '닭고기 (가슴살)',
      lot: 'LOT20250909001',
      quantity: 300,
      unit: 'kg',
      from: '프리미엄 육류',
      to: 'P1-RM',
      timestamp: '2025-09-09 08:30',
      user: '김검수',
      notes: '입고검수 완료'
    },
    {
      id: 'HIS002',
      type: 'consumption',
      code: 'RAW001',
      name: '닭고기 (가슴살)',
      lot: 'LOT20250909001',
      quantity: -50,
      unit: 'kg',
      from: 'P1-RM',
      to: 'WO001',
      timestamp: '2025-09-10 14:15',
      user: '이전처리',
      notes: '전처리 공정 투입'
    },
    {
      id: 'HIS003',
      type: 'production',
      code: 'WIP001',
      name: '전처리 믹스 A',
      lot: 'LOT20250910002',
      quantity: 150,
      unit: 'kg',
      from: 'WO001',
      to: 'P2-WIP',
      timestamp: '2025-09-10 16:45',
      user: '이전처리',
      notes: '전처리 완료 산출'
    },
    {
      id: 'HIS004',
      type: 'transfer',
      code: 'WIP001',
      name: '전처리 믹스 A',
      lot: 'LOT20250910002',
      quantity: -150,
      unit: 'kg',
      from: 'P2-WIP',
      to: 'MO001',
      timestamp: '2025-09-11 09:20',
      user: '최제조',
      notes: '제조공정 투입'
    },
    {
      id: 'HIS005',
      type: 'production',
      code: 'FG001',
      name: '애니콩 펫베이커리 A',
      lot: 'LOT20250911005',
      quantity: 650,
      unit: 'ea',
      from: 'MO001',
      to: 'P2-FG',
      timestamp: '2025-09-11 15:30',
      user: '최제조',
      notes: '제조 완료'
    }
  ]);

  const [filters, setFilters] = useState({
    category: 'all',
    warehouse: 'all',
    status: 'all',
    searchTerm: ''
  });

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    low_stock: 'bg-yellow-100 text-yellow-800',
    expiring_soon: 'bg-orange-100 text-orange-800',
    expired: 'bg-red-100 text-red-800',
    out_of_stock: 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    available: '정상',
    low_stock: '부족',
    expiring_soon: '유통기한임박',
    expired: '만료',
    out_of_stock: '품절'
  };

  const historyTypeColors = {
    receiving: 'bg-blue-100 text-blue-800',
    consumption: 'bg-red-100 text-red-800',
    production: 'bg-green-100 text-green-800',
    transfer: 'bg-yellow-100 text-yellow-800',
    adjustment: 'bg-purple-100 text-purple-800'
  };

  const historyTypeLabels = {
    receiving: '입고',
    consumption: '소모',
    production: '생산',
    transfer: '이동',
    adjustment: '조정'
  };

  const filteredInventory = inventoryData.filter(item => {
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.warehouse !== 'all' && item.warehouse !== filters.warehouse) return false;
    if (filters.status !== 'all' && item.status !== filters.status) return false;
    if (filters.searchTerm && !item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !item.code.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    return true;
  });

  const drillDownHistory = (lot: string) => {
    const lotHistory = historyData
      .filter(h => h.lot === lot)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const historyText = lotHistory.map(h => 
      `${h.timestamp} | ${historyTypeLabels[h.type]} | ${h.quantity > 0 ? '+' : ''}${h.quantity}${h.unit} | ${h.from} → ${h.to} | ${h.user}`
    ).join('\n');

    alert(`로트 이력 조회: ${lot}\n\n${historyText}`);
  };

  const exportInventory = () => {
    const csvData = filteredInventory.map(item => 
      [item.code, item.name, item.quantity, item.unit, item.warehouse, item.lot, item.expiry, item.status].join(',')
    );
    const csvContent = ['품목코드,품목명,수량,단위,창고,로트,유통기한,상태', ...csvData].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#724323] flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            재고/이력 조회
          </h1>
          <p className="text-[#333333] mt-1">공장, 창고, 로트, 유통기한 필터 및 바코드 히스토리</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={exportInventory}
            variant="outline"
            className="border-[#724323] text-[#724323] hover:bg-[#F5E9D5]"
          >
            데이터 내보내기
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">재고 현황</TabsTrigger>
          <TabsTrigger value="history">이력 추적</TabsTrigger>
          <TabsTrigger value="analytics">분석 대시보드</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Filter className="w-5 h-5" />
                필터 및 검색
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label>카테고리</Label>
                  <Select 
                    value={filters.category}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="원재료">원재료</SelectItem>
                      <SelectItem value="WIP">WIP</SelectItem>
                      <SelectItem value="완제품">완제품</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>창고</Label>
                  <Select 
                    value={filters.warehouse}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, warehouse: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="P1-RM">P1-RM</SelectItem>
                      <SelectItem value="P2-WIP">P2-WIP</SelectItem>
                      <SelectItem value="P2-FG">P2-FG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>상태</Label>
                  <Select 
                    value={filters.status}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="available">정상</SelectItem>
                      <SelectItem value="low_stock">부족</SelectItem>
                      <SelectItem value="expiring_soon">유통기한임박</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>검색</Label>
                  <Input
                    placeholder="품목명 또는 코드"
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => setFilters({ category: 'all', warehouse: 'all', status: 'all', searchTerm: '' })}
                    variant="outline"
                    className="w-full"
                  >
                    초기화
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border border-[#F5E9D5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333] mb-1">총 품목수</p>
                    <p className="text-2xl font-bold text-[#724323]">{filteredInventory.length}</p>
                  </div>
                  <div className="p-3 bg-[#724323] rounded-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333] mb-1">부족 재고</p>
                    <p className="text-2xl font-bold text-[#724323]">
                      {filteredInventory.filter(i => i.status === 'low_stock').length}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333] mb-1">유통기한 임박</p>
                    <p className="text-2xl font-bold text-[#724323]">
                      {filteredInventory.filter(i => i.status === 'expiring_soon').length}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333] mb-1">창고 수</p>
                    <p className="text-2xl font-bold text-[#724323]">
                      {new Set(filteredInventory.map(i => i.warehouse)).size}
                    </p>
                  </div>
                  <div className="p-3 bg-[#A3C478] rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Table */}
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Package className="w-5 h-5" />
                재고 현황 ({filteredInventory.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>품목코드</TableHead>
                    <TableHead>품목명</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>재고량</TableHead>
                    <TableHead>창고/위치</TableHead>
                    <TableHead>로트번호</TableHead>
                    <TableHead>유통기한</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>이력</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const daysToExpiry = Math.ceil((new Date(item.expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-[#724323]" />
                            <span>{item.warehouse}</span>
                            <span className="text-xs text-[#333333]">({item.location})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.lot}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-[#333333]" />
                            <span>{item.expiry}</span>
                            <span className="text-xs text-[#333333]">({daysToExpiry}일)</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[item.status]}>
                            {statusLabels[item.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => drillDownHistory(item.lot)}
                            className="p-1 h-auto text-[#724323] hover:bg-[#F5E9D5]"
                          >
                            <Search className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Clock className="w-5 h-5" />
                재고 이동 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>시간</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>품목</TableHead>
                    <TableHead>로트번호</TableHead>
                    <TableHead>수량</TableHead>
                    <TableHead>출발지</TableHead>
                    <TableHead>도착지</TableHead>
                    <TableHead>담당자</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell className="font-medium">{history.timestamp}</TableCell>
                      <TableCell>
                        <Badge className={historyTypeColors[history.type]}>
                          {historyTypeLabels[history.type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{history.name}</span>
                          <div className="text-xs text-[#333333]">{history.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{history.lot}</Badge>
                      </TableCell>
                      <TableCell className={`font-medium ${history.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {history.quantity > 0 ? '+' : ''}{history.quantity} {history.unit}
                      </TableCell>
                      <TableCell>{history.from}</TableCell>
                      <TableCell>{history.to}</TableCell>
                      <TableCell>{history.user}</TableCell>
                      <TableCell className="text-sm text-[#333333]">{history.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-[#F5E9D5]">
              <CardHeader>
                <CardTitle className="text-[#724323] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  카테고리별 재고 분포
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['원재료', 'WIP', '완제품'].map(category => {
                    const categoryItems = inventoryData.filter(item => item.category === category);
                    const percentage = Math.round((categoryItems.length / inventoryData.length) * 100);
                    
                    return (
                      <div key={category}>
                        <div className="flex justify-between mb-2">
                          <span className="text-[#333333]">{category}</span>
                          <span className="font-medium text-[#724323]">{categoryItems.length}개 ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-[#F5E9D5] rounded-full h-2">
                          <div 
                            className="bg-[#724323] h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardHeader>
                <CardTitle className="text-[#724323] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  주의사항 요약
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-800">유통기한 임박</span>
                    </div>
                    <p className="text-sm text-red-600">
                      {inventoryData.filter(i => i.status === 'expiring_soon').length}개 품목이 3일 내 유통기한 만료
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">재고 부족</span>
                    </div>
                    <p className="text-sm text-yellow-600">
                      {inventoryData.filter(i => i.status === 'low_stock').length}개 품목이 안전재고 미만
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">재고 회전</span>
                    </div>
                    <p className="text-sm text-green-600">
                      평균 재고회전일: 15일
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Warehouse Utilization */}
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                창고별 이용률
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['P1-RM', 'P2-WIP', 'P2-FG'].map(warehouse => {
                  const warehouseItems = inventoryData.filter(item => item.warehouse === warehouse);
                  const utilization = Math.random() * 40 + 60; // 시뮬레이션
                  
                  return (
                    <div key={warehouse} className="border border-[#F5E9D5] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-[#724323]">{warehouse}</h4>
                        <Badge className={utilization > 80 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                          {Math.round(utilization)}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#333333]">보관 품목</span>
                          <span className="font-medium">{warehouseItems.length}개</span>
                        </div>
                        <div className="w-full bg-[#F5E9D5] rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${utilization > 80 ? 'bg-red-500' : 'bg-[#A3C478]'}`}
                            style={{ width: `${utilization}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-[#333333]">
                          {utilization > 80 ? '창고 포화 주의' : '여유 공간 충분'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}