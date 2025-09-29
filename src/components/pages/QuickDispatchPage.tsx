import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Calendar, Plus, Trash2, Send, Printer } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface DispatchItem {
  id: string;
  productName: string;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  printLabel: boolean;
  total: number;
}

export function QuickDispatchPage() {
  const [selectedWeek, setSelectedWeek] = useState<string>('2024-01-01');
  const [dispatchItems, setDispatchItems] = useState<DispatchItem[]>([
    {
      id: '1',
      productName: '닭고기 동결건조 간식',
      monday: 50,
      tuesday: 30,
      wednesday: 45,
      thursday: 60,
      friday: 40,
      saturday: 25,
      sunday: 20,
      printLabel: true,
      total: 270
    },
    {
      id: '2',
      productName: '참치 캔 습식사료',
      monday: 80,
      tuesday: 70,
      wednesday: 65,
      thursday: 75,
      friday: 90,
      saturday: 55,
      sunday: 45,
      printLabel: false,
      total: 480
    }
  ]);

  const getWeekDates = (weekStart: string) => {
    const startDate = new Date(weekStart);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }));
    }
    return dates;
  };

  const weekDates = getWeekDates(selectedWeek);
  const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

  const updateQuantity = (id: string, day: keyof DispatchItem, value: number) => {
    setDispatchItems(items => 
      items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [day]: value };
          updated.total = updated.monday + updated.tuesday + updated.wednesday + 
                          updated.thursday + updated.friday + updated.saturday + updated.sunday;
          return updated;
        }
        return item;
      })
    );
  };

  const togglePrintLabel = (id: string) => {
    setDispatchItems(items =>
      items.map(item =>
        item.id === id ? { ...item, printLabel: !item.printLabel } : item
      )
    );
  };

  const addNewItem = () => {
    const newItem: DispatchItem = {
      id: Date.now().toString(),
      productName: '',
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
      printLabel: false,
      total: 0
    };
    setDispatchItems([...dispatchItems, newItem]);
  };

  const removeItem = (id: string) => {
    setDispatchItems(items => items.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    console.log('Submitting dispatch items:', dispatchItems);
    // Handle form submission
  };

  const getTotalForDay = (day: keyof DispatchItem) => {
    return dispatchItems.reduce((sum, item) => sum + (item[day] as number), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#724323] mb-2">출고 간편등록</h1>
          <p className="text-[#333333]">주간 단위로 출고 수량을 일괄 등록합니다</p>
        </div>
        <Badge variant="outline" className="text-[#724323] border-[#724323]">
          빠른 등록 모드
        </Badge>
      </div>

      {/* Week Selection */}
      <Card className="border-[#F5E9D5]">
        <CardHeader className="bg-[#F5E9D5] rounded-t-lg">
          <CardTitle className="text-[#724323] flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            주차 선택
          </CardTitle>
          <CardDescription>
            출고할 주차를 선택하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Label htmlFor="week-select">출고 주차:</Label>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="주차를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01-01">2024년 1월 1주차</SelectItem>
                <SelectItem value="2024-01-08">2024년 1월 2주차</SelectItem>
                <SelectItem value="2024-01-15">2024년 1월 3주차</SelectItem>
                <SelectItem value="2024-01-22">2024년 1월 4주차</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dispatch Items Table */}
      <Card className="border-[#F5E9D5]">
        <CardHeader className="bg-[#F5E9D5] rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#724323]">출고 품목 등록</CardTitle>
              <CardDescription>
                각 요일별 출고 수량을 입력하세요
              </CardDescription>
            </div>
            <Button 
              onClick={addNewItem}
              className="bg-[#724323] hover:bg-[#5a341c] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              품목 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAF6F2]">
                  <TableHead className="w-64">제품명</TableHead>
                  {dayNames.map((day, index) => (
                    <TableHead key={day} className="text-center min-w-24">
                      <div className="flex flex-col items-center">
                        <span className="text-[#724323]">{day}요일</span>
                        <span className="text-xs text-[#666] mt-1">{weekDates[index]}</span>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center w-20">합계</TableHead>
                  <TableHead className="text-center w-24">라벨출력</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dispatchItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-[#FAF6F2]">
                    <TableCell>
                      <Input
                        value={item.productName}
                        onChange={(e) => {
                          setDispatchItems(items =>
                            items.map(i => i.id === item.id ? { ...i, productName: e.target.value } : i)
                          );
                        }}
                        placeholder="제품명을 입력하세요"
                        className="border-[#F5E9D5]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.monday}
                        onChange={(e) => updateQuantity(item.id, 'monday', parseInt(e.target.value) || 0)}
                        className="text-center border-[#F5E9D5]"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.tuesday}
                        onChange={(e) => updateQuantity(item.id, 'tuesday', parseInt(e.target.value) || 0)}
                        className="text-center border-[#F5E9D5]"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.wednesday}
                        onChange={(e) => updateQuantity(item.id, 'wednesday', parseInt(e.target.value) || 0)}
                        className="text-center border-[#F5E9D5]"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.thursday}
                        onChange={(e) => updateQuantity(item.id, 'thursday', parseInt(e.target.value) || 0)}
                        className="text-center border-[#F5E9D5]"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.friday}
                        onChange={(e) => updateQuantity(item.id, 'friday', parseInt(e.target.value) || 0)}
                        className="text-center border-[#F5E9D5]"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.saturday}
                        onChange={(e) => updateQuantity(item.id, 'saturday', parseInt(e.target.value) || 0)}
                        className="text-center border-[#F5E9D5]"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.sunday}
                        onChange={(e) => updateQuantity(item.id, 'sunday', parseInt(e.target.value) || 0)}
                        className="text-center border-[#F5E9D5]"
                        min="0"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-[#A3C478] text-white">
                        {item.total}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={item.printLabel}
                        onCheckedChange={() => togglePrintLabel(item.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals Row */}
                <TableRow className="bg-[#F5E9D5] font-medium">
                  <TableCell className="text-[#724323]">일일 합계</TableCell>
                  <TableCell className="text-center text-[#724323]">{getTotalForDay('monday')}</TableCell>
                  <TableCell className="text-center text-[#724323]">{getTotalForDay('tuesday')}</TableCell>
                  <TableCell className="text-center text-[#724323]">{getTotalForDay('wednesday')}</TableCell>
                  <TableCell className="text-center text-[#724323]">{getTotalForDay('thursday')}</TableCell>
                  <TableCell className="text-center text-[#724323]">{getTotalForDay('friday')}</TableCell>
                  <TableCell className="text-center text-[#724323]">{getTotalForDay('saturday')}</TableCell>
                  <TableCell className="text-center text-[#724323]">{getTotalForDay('sunday')}</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-[#724323] text-white">
                      {dispatchItems.reduce((sum, item) => sum + item.total, 0)}
                    </Badge>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-[#666]">
          총 {dispatchItems.length}개 품목 | 총 {dispatchItems.reduce((sum, item) => sum + item.total, 0)}개 출고 예정
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#F9B679] text-[#F9B679] hover:bg-[#F9B679] hover:text-white">
            <Printer className="w-4 h-4 mr-2" />
            라벨 일괄출력
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-[#724323] hover:bg-[#5a341c] text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            출고 등록 완료
          </Button>
        </div>
      </div>
    </div>
  );
}