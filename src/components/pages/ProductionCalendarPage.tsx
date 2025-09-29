import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Thermometer, Clock, Package, Scale } from 'lucide-react';

interface ProductionRecord {
  id: string;
  date: string;
  productName: string;
  quantity: number;
  temperature: number;
  duration: number; // in minutes
  defectQuantity: number;
  blendRatio: string;
  totalWeight: number;
  remarks: string;
  batchNumber: string;
}

export function ProductionCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProductionRecord | null>(null);

  const [productionRecords, setProductionRecords] = useState<ProductionRecord[]>([
    {
      id: '1',
      date: '2024-01-15',
      productName: '닭고기 동결건조 간식',
      quantity: 500,
      temperature: 65,
      duration: 480,
      defectQuantity: 5,
      blendRatio: '닭고기:쌀:비타민 = 70:25:5',
      totalWeight: 125.5,
      remarks: '품질 양호',
      batchNumber: 'B240115001'
    },
    {
      id: '2',
      date: '2024-01-15',
      productName: '참치 캔 습식사료',
      quantity: 200,
      temperature: 85,
      duration: 240,
      defectQuantity: 2,
      blendRatio: '참치:젤라틴:물 = 60:30:10',
      totalWeight: 98.2,
      remarks: '수분함량 확인 완료',
      batchNumber: 'B240115002'
    },
    {
      id: '3',
      date: '2024-01-16',
      productName: '연어 트릿 스낵',
      quantity: 800,
      temperature: 70,
      duration: 360,
      defectQuantity: 8,
      blendRatio: '연어:감자:오일 = 65:30:5',
      totalWeight: 200.8,
      remarks: '색상 균일함',
      batchNumber: 'B240116001'
    }
  ]);

  const [newRecord, setNewRecord] = useState({
    productName: '',
    quantity: '',
    temperature: '',
    duration: '',
    defectQuantity: '',
    blendRatio: '',
    totalWeight: '',
    remarks: ''
  });

  // Calendar utilities
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getRecordsForDate = (dateStr: string) => {
    return productionRecords.filter(record => record.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleAddRecord = () => {
    if (selectedDate && newRecord.productName && newRecord.quantity) {
      const record: ProductionRecord = {
        id: Date.now().toString(),
        date: selectedDate,
        productName: newRecord.productName,
        quantity: parseInt(newRecord.quantity),
        temperature: parseInt(newRecord.temperature) || 0,
        duration: parseInt(newRecord.duration) || 0,
        defectQuantity: parseInt(newRecord.defectQuantity) || 0,
        blendRatio: newRecord.blendRatio,
        totalWeight: parseFloat(newRecord.totalWeight) || 0,
        remarks: newRecord.remarks,
        batchNumber: `B${selectedDate.replace(/-/g, '')}${String(getRecordsForDate(selectedDate).length + 1).padStart(3, '0')}`
      };

      setProductionRecords([...productionRecords, record]);
      setNewRecord({
        productName: '',
        quantity: '',
        temperature: '',
        duration: '',
        defectQuantity: '',
        blendRatio: '',
        totalWeight: '',
        remarks: ''
      });
      setIsRecordDialogOpen(false);
    }
  };

  const handleEditRecord = (record: ProductionRecord) => {
    setEditingRecord(record);
    setNewRecord({
      productName: record.productName,
      quantity: record.quantity.toString(),
      temperature: record.temperature.toString(),
      duration: record.duration.toString(),
      defectQuantity: record.defectQuantity.toString(),
      blendRatio: record.blendRatio,
      totalWeight: record.totalWeight.toString(),
      remarks: record.remarks
    });
    setIsRecordDialogOpen(true);
  };

  const handleUpdateRecord = () => {
    if (editingRecord && newRecord.productName && newRecord.quantity) {
      setProductionRecords(records => 
        records.map(record => 
          record.id === editingRecord.id 
            ? {
                ...record,
                productName: newRecord.productName,
                quantity: parseInt(newRecord.quantity),
                temperature: parseInt(newRecord.temperature) || 0,
                duration: parseInt(newRecord.duration) || 0,
                defectQuantity: parseInt(newRecord.defectQuantity) || 0,
                blendRatio: newRecord.blendRatio,
                totalWeight: parseFloat(newRecord.totalWeight) || 0,
                remarks: newRecord.remarks
              }
            : record
        )
      );
      
      setNewRecord({
        productName: '',
        quantity: '',
        temperature: '',
        duration: '',
        defectQuantity: '',
        blendRatio: '',
        totalWeight: '',
        remarks: ''
      });
      setEditingRecord(null);
      setIsRecordDialogOpen(false);
    }
  };

  const handleDeleteRecord = (recordId: string) => {
    setProductionRecords(records => records.filter(record => record.id !== recordId));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    
    const calendarDays = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-24 border border-[#F5E9D5]"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayRecords = getRecordsForDate(dateStr);
      const isSelected = selectedDate === dateStr;
      
      calendarDays.push(
        <div 
          key={day}
          className={`h-24 border border-[#F5E9D5] p-1 cursor-pointer hover:bg-[#FAF6F2] ${
            isSelected ? 'bg-[#F5E9D5]' : ''
          }`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div className="text-sm mb-1">{day}</div>
          <div className="space-y-1">
            {dayRecords.slice(0, 2).map((record, index) => (
              <div 
                key={index}
                className="text-xs bg-[#724323] text-white px-1 py-0.5 rounded truncate"
                title={`${record.productName} (${record.quantity}개)`}
              >
                {record.productName}
              </div>
            ))}
            {dayRecords.length > 2 && (
              <div className="text-xs text-[#666]">+{dayRecords.length - 2}개 더</div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-7 gap-0 border border-[#F5E9D5]">
        {days.map(day => (
          <div key={day} className="h-8 bg-[#724323] text-white flex items-center justify-center">
            {day}
          </div>
        ))}
        {calendarDays}
      </div>
    );
  };

  const selectedDateRecords = selectedDate ? getRecordsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#724323] mb-2">제조 이력 캘린더</h1>
          <p className="text-[#333333]">일별 제조 이력을 캘린더 형태로 관리합니다</p>
        </div>
        <Badge variant="outline" className="text-[#724323] border-[#724323]">
          <CalendarIcon className="w-4 h-4 mr-1" />
          생산 일지
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <Card className="border-[#F5E9D5]">
            <CardHeader className="bg-[#F5E9D5] rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#724323] flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="border-[#724323] text-[#724323]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="border-[#724323] text-[#724323]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {renderCalendar()}
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-4">
          <Card className="border-[#F5E9D5]">
            <CardHeader className="bg-[#F5E9D5] rounded-t-lg">
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Package className="w-5 h-5" />
                {selectedDate ? `${selectedDate} 제조 기록` : '날짜를 선택하세요'}
              </CardTitle>
              {selectedDate && (
                <CardDescription>
                  총 {selectedDateRecords.length}건의 제조 기록
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-4">
              {selectedDate ? (
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      setEditingRecord(null);
                      setIsRecordDialogOpen(true);
                    }}
                    className="w-full bg-[#724323] hover:bg-[#5a341c] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    새 제조 기록 추가
                  </Button>
                  
                  {selectedDateRecords.length === 0 ? (
                    <div className="text-center py-8 text-[#666]">
                      이 날짜에는 제조 기록이 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateRecords.map((record) => (
                        <Card key={record.id} className="border-[#F9B679]">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-[#724323]">{record.productName}</h4>
                                <p className="text-xs text-[#666]">배치번호: {record.batchNumber}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {record.quantity}개
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs text-[#666] mb-2">
                              <div className="flex items-center gap-1">
                                <Thermometer className="w-3 h-3" />
                                {record.temperature}°C
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {Math.floor(record.duration / 60)}h {record.duration % 60}m
                              </div>
                              <div className="flex items-center gap-1">
                                <Scale className="w-3 h-3" />
                                {record.totalWeight}kg
                              </div>
                              <div>불량: {record.defectQuantity}개</div>
                            </div>
                            
                            {record.remarks && (
                              <p className="text-xs text-[#333] mb-2">{record.remarks}</p>
                            )}
                            
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditRecord(record)}
                                className="text-xs"
                              >
                                수정
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteRecord(record.id)}
                                className="text-xs text-red-500 border-red-200 hover:bg-red-50"
                              >
                                삭제
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-[#666]">
                  캘린더에서 날짜를 선택하여 제조 기록을 확인하세요.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Production Summary */}
          {selectedDate && selectedDateRecords.length > 0 && (
            <Card className="border-[#F5E9D5]">
              <CardHeader className="bg-[#A3C478] rounded-t-lg">
                <CardTitle className="text-white">일일 생산 요약</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>총 생산량:</span>
                    <span className="font-medium">
                      {selectedDateRecords.reduce((sum, record) => sum + record.quantity, 0)}개
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>총 중량:</span>
                    <span className="font-medium">
                      {selectedDateRecords.reduce((sum, record) => sum + record.totalWeight, 0).toFixed(1)}kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>총 불량:</span>
                    <span className="font-medium text-red-500">
                      {selectedDateRecords.reduce((sum, record) => sum + record.defectQuantity, 0)}개
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>품목 수:</span>
                    <span className="font-medium">{selectedDateRecords.length}종</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add/Edit Record Dialog */}
      <Dialog open={isRecordDialogOpen} onOpenChange={(open) => {
        setIsRecordDialogOpen(open);
        if (!open) {
          setEditingRecord(null);
          setNewRecord({
            productName: '',
            quantity: '',
            temperature: '',
            duration: '',
            defectQuantity: '',
            blendRatio: '',
            totalWeight: '',
            remarks: ''
          });
        }
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#724323]">
              {editingRecord ? '제조 기록 수정' : '새 제조 기록 추가'}
            </DialogTitle>
            <DialogDescription>
              {selectedDate}의 제조 기록을 {editingRecord ? '수정' : '입력'}합니다
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">제품명</Label>
              <Input
                id="product-name"
                value={newRecord.productName}
                onChange={(e) => setNewRecord({...newRecord, productName: e.target.value})}
                placeholder="제품명을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">생산 수량</Label>
              <Input
                id="quantity"
                type="number"
                value={newRecord.quantity}
                onChange={(e) => setNewRecord({...newRecord, quantity: e.target.value})}
                placeholder="수량"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">온도 (°C)</Label>
              <Input
                id="temperature"
                type="number"
                value={newRecord.temperature}
                onChange={(e) => setNewRecord({...newRecord, temperature: e.target.value})}
                placeholder="제조 온도"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">소요시간 (분)</Label>
              <Input
                id="duration"
                type="number"
                value={newRecord.duration}
                onChange={(e) => setNewRecord({...newRecord, duration: e.target.value})}
                placeholder="제조 시간"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defect-quantity">불량 수량</Label>
              <Input
                id="defect-quantity"
                type="number"
                value={newRecord.defectQuantity}
                onChange={(e) => setNewRecord({...newRecord, defectQuantity: e.target.value})}
                placeholder="불량 수량"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total-weight">총 중량 (kg)</Label>
              <Input
                id="total-weight"
                type="number"
                step="0.1"
                value={newRecord.totalWeight}
                onChange={(e) => setNewRecord({...newRecord, totalWeight: e.target.value})}
                placeholder="총 중량"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="blend-ratio">배합 비율</Label>
              <Input
                id="blend-ratio"
                value={newRecord.blendRatio}
                onChange={(e) => setNewRecord({...newRecord, blendRatio: e.target.value})}
                placeholder="예: 닭고기:쌀:비타민 = 70:25:5"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="remarks">비고</Label>
              <Textarea
                id="remarks"
                value={newRecord.remarks}
                onChange={(e) => setNewRecord({...newRecord, remarks: e.target.value})}
                placeholder="특이사항이나 품질 상태를 입력하세요"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
              취소
            </Button>
            <Button 
              onClick={editingRecord ? handleUpdateRecord : handleAddRecord}
              className="bg-[#724323] hover:bg-[#5a341c] text-white"
            >
              {editingRecord ? '수정 완료' : '기록 추가'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}