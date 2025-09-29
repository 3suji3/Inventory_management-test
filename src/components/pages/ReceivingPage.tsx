import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Truck, Package, Scan, Printer, CheckCircle, AlertTriangle, Calendar, MapPin } from 'lucide-react';

export function ReceivingPage() {
  const [scanMode, setScanMode] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  
  const [pendingReceipts, setPendingReceipts] = useState([
    {
      id: 'PO001',
      supplier: '프리미엄 육류',
      items: [
        { code: 'RAW001', name: '닭고기 (가슴살)', ordered: 100, received: 0, unit: 'kg' },
        { code: 'RAW002', name: '소고기 (등심)', ordered: 50, received: 0, unit: 'kg' }
      ],
      expectedDate: '2025-09-11',
      status: 'pending'
    },
    {
      id: 'PO002',
      supplier: '신선 농산',
      items: [
        { code: 'RAW003', name: '당근', ordered: 200, received: 150, unit: 'kg' },
        { code: 'RAW004', name: '감자', ordered: 100, received: 100, unit: 'kg' }
      ],
      expectedDate: '2025-09-11',
      status: 'partial'
    }
  ]);

  const [completedReceipts, setCompletedReceipts] = useState([
    {
      id: 'REC001',
      poNumber: 'PO003',
      supplier: '건조식품',
      receivedDate: '2025-09-10',
      items: [
        { code: 'RAW005', name: '현미', quantity: 500, unit: 'kg', lot: 'LOT20250910001' }
      ],
      inspector: '김검수',
      warehouse: 'P1-RM'
    }
  ]);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    partial: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800'
  };

  const statusLabels = {
    pending: '입고대기',
    partial: '부분입고',
    completed: '입고완료'
  };

  const startScanning = () => {
    setScanMode(true);
    // 시뮬레이션: 3초 후 바코드 스캔됨
    setTimeout(() => {
      setScannedBarcode('PO001-RAW001-20250911');
      setScanMode(false);
    }, 3000);
  };

  const processReceiving = (poId: string, itemCode: string, quantity: number) => {
    setPendingReceipts(prev => 
      prev.map(po => {
        if (po.id === poId) {
          const updatedItems = po.items.map(item => {
            if (item.code === itemCode) {
              return { ...item, received: quantity };
            }
            return item;
          });
          
          const allReceived = updatedItems.every(item => item.received >= item.ordered);
          const anyReceived = updatedItems.some(item => item.received > 0);
          
          return {
            ...po,
            items: updatedItems,
            status: allReceived ? 'completed' : anyReceived ? 'partial' : 'pending'
          };
        }
        return po;
      })
    );
  };

  const printLabel = (item: any) => {
    // 라벨 프린트 시뮬레이션
    alert(`라벨 프린트 요청:\n품목: ${item.name}\n수량: ${item.received}${item.unit}\n창고: P1-RM\n제조일: 2025-09-11\n유통기한: 2025-09-18`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#724323] flex items-center gap-2">
            <Truck className="w-6 h-6" />
            입고/검수 관리
          </h1>
          <p className="text-[#333333] mt-1">구매 입고 스캔 및 원재료 라벨 프린트</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={startScanning}
            className="bg-[#724323] hover:bg-[#5a3419] text-white"
            disabled={scanMode}
          >
            <Scan className="w-4 h-4 mr-2" />
            {scanMode ? '스캔 중...' : '바코드 스캔'}
          </Button>
        </div>
      </div>

      {/* Scanning Interface */}
      {scanMode && (
        <Card className="border-2 border-[#A3C478] bg-[#F5E9D5]">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#A3C478] rounded-full flex items-center justify-center mx-auto mb-4">
                <Scan className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-lg font-medium text-[#724323] mb-2">바코드 스캔 중...</h3>
              <p className="text-[#333333]">입고 품목의 바코드를 스캔해주세요</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scanned Result */}
      {scannedBarcode && (
        <Card className="border border-[#A3C478] bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">스캔 완료</h4>
                <p className="text-sm text-green-600">바코드: {scannedBarcode}</p>
              </div>
              <Button 
                size="sm" 
                className="ml-auto bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setScannedBarcode('')}
              >
                처리 완료
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Receipts */}
      <Card className="border border-[#F5E9D5]">
        <CardHeader>
          <CardTitle className="text-[#724323] flex items-center gap-2">
            <Package className="w-5 h-5" />
            입고 대기 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pendingReceipts.map((po) => (
              <div key={po.id} className="border border-[#F5E9D5] rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-medium text-[#724323]">{po.id}</h3>
                      <p className="text-sm text-[#333333]">{po.supplier}</p>
                    </div>
                    <Badge className={statusColors[po.status]}>
                      {statusLabels[po.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#333333]">
                    <Calendar className="w-4 h-4" />
                    예정일: {po.expectedDate}
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>품목코드</TableHead>
                      <TableHead>품목명</TableHead>
                      <TableHead>주문량</TableHead>
                      <TableHead>입고량</TableHead>
                      <TableHead>입고 처리</TableHead>
                      <TableHead>라벨 프린트</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {po.items.map((item) => (
                      <TableRow key={item.code}>
                        <TableCell className="font-medium">{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.ordered} {item.unit}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              defaultValue={item.received}
                              className="w-20"
                              max={item.ordered}
                            />
                            <span className="text-sm text-[#333333]">{item.unit}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => processReceiving(po.id, item.code, item.ordered)}
                            className="bg-[#A3C478] hover:bg-[#8fb865] text-white"
                            disabled={item.received >= item.ordered}
                          >
                            {item.received >= item.ordered ? '완료' : '입고'}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => printLabel(item)}
                            disabled={item.received === 0}
                            className="border-[#724323] text-[#724323] hover:bg-[#724323] hover:text-white"
                          >
                            <Printer className="w-4 h-4 mr-1" />
                            프린트
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Inspection */}
      <Card className="border border-[#F5E9D5]">
        <CardHeader>
          <CardTitle className="text-[#724323] flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            품질 검수
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="inspector">검수자</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="검수자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="김검수">김검수</SelectItem>
                    <SelectItem value="이품질">이품질</SelectItem>
                    <SelectItem value="박안전">박안전</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="temperature">온도 (°C)</Label>
                <Input id="temperature" type="number" placeholder="측정온도 입력" />
              </div>
              <div>
                <Label htmlFor="expiry">유통기한</Label>
                <Input id="expiry" type="date" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="warehouse">입고 창고</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="창고 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P1-RM">P1-RM (1공장 원재료)</SelectItem>
                    <SelectItem value="P2-RM">P2-RM (2공장 원재료)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="lot">로트번호</Label>
                <Input id="lot" value="LOT20250911001" readOnly />
              </div>
              <div>
                <Label htmlFor="notes">검수 메모</Label>
                <Input id="notes" placeholder="검수 결과 메모" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
              <AlertTriangle className="w-4 h-4 mr-2" />
              불합격
            </Button>
            <Button className="bg-[#A3C478] hover:bg-[#8fb865] text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              검수 합격
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Completed Receipts History */}
      <Card className="border border-[#F5E9D5]">
        <CardHeader>
          <CardTitle className="text-[#724323] flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            입고 완료 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>입고번호</TableHead>
                <TableHead>발주번호</TableHead>
                <TableHead>공급업체</TableHead>
                <TableHead>입고일</TableHead>
                <TableHead>품목</TableHead>
                <TableHead>검수자</TableHead>
                <TableHead>창고</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedReceipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">{receipt.id}</TableCell>
                  <TableCell>{receipt.poNumber}</TableCell>
                  <TableCell>{receipt.supplier}</TableCell>
                  <TableCell>{receipt.receivedDate}</TableCell>
                  <TableCell>
                    {receipt.items.map((item, index) => (
                      <div key={index} className="text-sm">
                        {item.name} ({item.quantity}{item.unit})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{receipt.inspector}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#724323]" />
                      {receipt.warehouse}
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