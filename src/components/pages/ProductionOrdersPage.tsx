import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileText, Plus, Eye, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ProductionOrder {
  id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string;
  specialNotes: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export function ProductionOrdersPage() {
  const [orders, setOrders] = useState<ProductionOrder[]>([
    {
      id: '1',
      orderNumber: 'PO-2024-0001',
      productName: '닭고기 동결건조 간식',
      quantity: 500,
      dueDate: '2024-01-15',
      priority: 'high',
      status: 'in_progress',
      assignedTo: '김생산',
      specialNotes: '알레르기 성분 주의',
      createdAt: '2024-01-10',
      startedAt: '2024-01-12'
    },
    {
      id: '2',
      orderNumber: 'PO-2024-0002',
      productName: '참치 캔 습식사료',
      quantity: 800,
      dueDate: '2024-01-18',
      priority: 'medium',
      status: 'pending',
      assignedTo: '이제조',
      specialNotes: '수분함량 16% 이하 유지',
      createdAt: '2024-01-11'
    },
    {
      id: '3',
      orderNumber: 'PO-2024-0003',
      productName: '연어 트릿 스낵',
      quantity: 300,
      dueDate: '2024-01-20',
      priority: 'low',
      status: 'completed',
      assignedTo: '박품질',
      specialNotes: '',
      createdAt: '2024-01-08',
      startedAt: '2024-01-09',
      completedAt: '2024-01-13'
    }
  ]);

  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    productName: '',
    quantity: '',
    dueDate: '',
    priority: 'medium' as const,
    assignedTo: '',
    specialNotes: ''
  });

  const getStatusIcon = (status: ProductionOrder['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-[#F9B679]" />;
      case 'in_progress':
        return <Play className="w-4 h-4 text-[#A3C478]" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-[#A3C478]" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ProductionOrder['status']) => {
    const statusMap = {
      pending: { label: '대기중', class: 'bg-[#F9B679] text-white' },
      in_progress: { label: '작업중', class: 'bg-[#A3C478] text-white' },
      completed: { label: '완료', class: 'bg-[#724323] text-white' },
      cancelled: { label: '취소', class: 'bg-red-500 text-white' }
    };
    
    const statusInfo = statusMap[status];
    return (
      <Badge className={statusInfo.class}>
        {getStatusIcon(status)}
        <span className="ml-1">{statusInfo.label}</span>
      </Badge>
    );
  };

  const getPriorityBadge = (priority: ProductionOrder['priority']) => {
    const priorityMap = {
      high: { label: '높음', class: 'bg-red-500 text-white' },
      medium: { label: '보통', class: 'bg-[#F9B679] text-white' },
      low: { label: '낮음', class: 'bg-gray-500 text-white' }
    };
    
    const priorityInfo = priorityMap[priority];
    return <Badge className={priorityInfo.class}>{priorityInfo.label}</Badge>;
  };

  const handleStartProduction = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'in_progress', startedAt: new Date().toISOString().split('T')[0] }
        : order
    ));
  };

  const handleCompleteProduction = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'completed', completedAt: new Date().toISOString().split('T')[0] }
        : order
    ));
  };

  const handleCreateOrder = () => {
    if (newOrder.productName && newOrder.quantity && newOrder.dueDate && newOrder.assignedTo) {
      const order: ProductionOrder = {
        id: Date.now().toString(),
        orderNumber: `PO-2024-${String(orders.length + 1).padStart(4, '0')}`,
        productName: newOrder.productName,
        quantity: parseInt(newOrder.quantity),
        dueDate: newOrder.dueDate,
        priority: newOrder.priority,
        status: 'pending',
        assignedTo: newOrder.assignedTo,
        specialNotes: newOrder.specialNotes,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setOrders([...orders, order]);
      setNewOrder({
        productName: '',
        quantity: '',
        dueDate: '',
        priority: 'medium',
        assignedTo: '',
        specialNotes: ''
      });
      setIsNewOrderDialogOpen(false);
    }
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      inProgress: orders.filter(o => o.status === 'in_progress').length,
      completed: orders.filter(o => o.status === 'completed').length,
    };
  };

  const stats = getOrderStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#724323] mb-2">생산 지시서 관리</h1>
          <p className="text-[#333333]">생산 주문을 생성하고 진행 상황을 추적합니다</p>
        </div>
        <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#724323] hover:bg-[#5a341c] text-white">
              <Plus className="w-4 h-4 mr-2" />
              신규 지시서 생성
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-[#724323]">신규 생산 지시서</DialogTitle>
              <DialogDescription>
                새로운 생산 지시서를 생성합니다
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">제품명</Label>
                <Input
                  id="product-name"
                  value={newOrder.productName}
                  onChange={(e) => setNewOrder({...newOrder, productName: e.target.value})}
                  placeholder="제품명을 입력하세요"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">생산 수량</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder({...newOrder, quantity: e.target.value})}
                    placeholder="수량"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">납기일</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={newOrder.dueDate}
                    onChange={(e) => setNewOrder({...newOrder, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">우선순위</Label>
                  <Select value={newOrder.priority} onValueChange={(value: any) => setNewOrder({...newOrder, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">높음</SelectItem>
                      <SelectItem value="medium">보통</SelectItem>
                      <SelectItem value="low">낮음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assigned-to">담당자</Label>
                  <Select value={newOrder.assignedTo} onValueChange={(value) => setNewOrder({...newOrder, assignedTo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="담당자 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="김생산">김생산</SelectItem>
                      <SelectItem value="이제조">이제조</SelectItem>
                      <SelectItem value="박품질">박품질</SelectItem>
                      <SelectItem value="최작업">최작업</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">특수 사항</Label>
                <Textarea
                  id="notes"
                  value={newOrder.specialNotes}
                  onChange={(e) => setNewOrder({...newOrder, specialNotes: e.target.value})}
                  placeholder="특수 사항이나 주의사항을 입력하세요"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewOrderDialogOpen(false)}>
                취소
              </Button>
              <Button 
                onClick={handleCreateOrder}
                className="bg-[#724323] hover:bg-[#5a341c] text-white"
              >
                지시서 생성
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">전체 지시서</p>
                <p className="text-2xl text-[#724323]">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-[#724323]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">대기중</p>
                <p className="text-2xl text-[#F9B679]">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-[#F9B679]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">작업중</p>
                <p className="text-2xl text-[#A3C478]">{stats.inProgress}</p>
              </div>
              <Play className="w-8 h-8 text-[#A3C478]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">완료</p>
                <p className="text-2xl text-[#724323]">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-[#724323]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Orders Table */}
      <Card className="border-[#F5E9D5]">
        <CardHeader className="bg-[#F5E9D5] rounded-t-lg">
          <CardTitle className="text-[#724323]">생산 지시서 목록</CardTitle>
          <CardDescription>
            생성된 생산 지시서 목록과 진행 상황을 확인합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAF6F2]">
                <TableHead>지시서 번호</TableHead>
                <TableHead>제품명</TableHead>
                <TableHead className="text-center">수량</TableHead>
                <TableHead className="text-center">납기일</TableHead>
                <TableHead className="text-center">우선순위</TableHead>
                <TableHead className="text-center">상태</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>특수사항</TableHead>
                <TableHead className="text-center">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-[#FAF6F2]">
                  <TableCell className="font-medium text-[#724323]">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell className="text-center">{order.quantity.toLocaleString()}</TableCell>
                  <TableCell className="text-center">{order.dueDate}</TableCell>
                  <TableCell className="text-center">
                    {getPriorityBadge(order.priority)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell>{order.assignedTo}</TableCell>
                  <TableCell>
                    <span className="text-sm text-[#666] truncate max-w-32 block">
                      {order.specialNotes || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStartProduction(order.id)}
                          className="bg-[#A3C478] hover:bg-[#8fb968] text-white"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          시작
                        </Button>
                      )}
                      {order.status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteProduction(order.id)}
                          className="bg-[#724323] hover:bg-[#5a341c] text-white"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          완료
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#F5E9D5]"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}