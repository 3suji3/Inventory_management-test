import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Package, Plus, Edit, Trash2, Save, Factory, Barcode, Clock, Thermometer } from 'lucide-react';

export function BasicInfoPage() {
  const [items, setItems] = useState([
    { id: 'RAW001', name: '닭고기 (가슴살)', category: '원재료', plant: '1공장', storage: '냉장', shelfLife: 7, unit: 'kg' },
    { id: 'RAW002', name: '당근', category: '원재료', plant: '1공장', storage: '상온', shelfLife: 14, unit: 'kg' },
    { id: 'WIP001', name: '전처리 믹스', category: 'WIP', plant: '2공장', storage: '냉장', shelfLife: 3, unit: 'kg' },
    { id: 'FG001', name: '애니콩 펫베이커리 A', category: '완제품', plant: '2공장', storage: '냉동', shelfLife: 30, unit: 'ea' }
  ]);

  const [newItem, setNewItem] = useState({
    id: '',
    name: '',
    category: '',
    plant: '',
    storage: '',
    shelfLife: '',
    unit: ''
  });

  const storageOptions = {
    '상온': { icon: '🌡️', color: 'bg-yellow-100 text-yellow-800' },
    '냉장': { icon: '❄️', color: 'bg-blue-100 text-blue-800' },
    '냉동': { icon: '🧊', color: 'bg-purple-100 text-purple-800' }
  };

  const categoryColors = {
    '원재료': 'bg-[#A3C478] text-white',
    'WIP': 'bg-[#F9B679] text-white',
    '완제품': 'bg-[#724323] text-white'
  };

  const addItem = () => {
    if (newItem.id && newItem.name) {
      setItems([...items, { ...newItem, shelfLife: parseInt(newItem.shelfLife) }]);
      setNewItem({ id: '', name: '', category: '', plant: '', storage: '', shelfLife: '', unit: '' });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#724323] flex items-center gap-2">
            <Package className="w-6 h-6" />
            기초정보 설정
          </h1>
          <p className="text-[#333333] mt-1">품목 등록, 공장 정보, 바코드 템플릿 관리</p>
        </div>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="items">품목 등록</TabsTrigger>
          <TabsTrigger value="factories">공장 정보</TabsTrigger>
          <TabsTrigger value="bom">BOM 관리</TabsTrigger>
          <TabsTrigger value="storage">보관 조건</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          {/* Add New Item Form */}
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Plus className="w-5 h-5" />
                신규 품목 등록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="itemId">품목코드</Label>
                  <Input
                    id="itemId"
                    value={newItem.id}
                    onChange={(e) => setNewItem({...newItem, id: e.target.value})}
                    placeholder="RAW001"
                  />
                </div>
                <div>
                  <Label htmlFor="itemName">품목명</Label>
                  <Input
                    id="itemName"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="품목명 입력"
                  />
                </div>
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="원재료">원재료</SelectItem>
                      <SelectItem value="WIP">WIP (반제품)</SelectItem>
                      <SelectItem value="완제품">완제품</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="plant">담당 공장</Label>
                  <Select value={newItem.plant} onValueChange={(value) => setNewItem({...newItem, plant: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="공장 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1공장">1공장 (전처리)</SelectItem>
                      <SelectItem value="2공장">2공장 (제조)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="storage">보관조건</Label>
                  <Select value={newItem.storage} onValueChange={(value) => setNewItem({...newItem, storage: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="보관조건" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="상온">상온 (15-25°C)</SelectItem>
                      <SelectItem value="냉장">냉장 (0-4°C)</SelectItem>
                      <SelectItem value="냉동">냉동 (-18°C)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shelfLife">유통기한 (일)</Label>
                  <Input
                    id="shelfLife"
                    type="number"
                    value={newItem.shelfLife}
                    onChange={(e) => setNewItem({...newItem, shelfLife: e.target.value})}
                    placeholder="7"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">단위</Label>
                  <Select value={newItem.unit} onValueChange={(value) => setNewItem({...newItem, unit: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="단위" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="ea">ea</SelectItem>
                      <SelectItem value="box">box</SelectItem>
                      <SelectItem value="pallet">pallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={addItem} className="w-full bg-[#724323] hover:bg-[#5a3419] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    등록
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items List */}
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Package className="w-5 h-5" />
                등록된 품목 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>품목코드</TableHead>
                    <TableHead>품목명</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>담당공장</TableHead>
                    <TableHead>보관조건</TableHead>
                    <TableHead>유통기한</TableHead>
                    <TableHead>단위</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Badge className={categoryColors[item.category]}>
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Factory className="w-4 h-4 text-[#724323]" />
                          {item.plant}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={storageOptions[item.storage].color}>
                          {storageOptions[item.storage].icon} {item.storage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#333333]" />
                          {item.shelfLife}일
                        </div>
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="p-1 h-auto">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="p-1 h-auto text-red-600 hover:text-red-700"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-[#F5E9D5]">
              <CardHeader>
                <CardTitle className="text-[#724323] flex items-center gap-2">
                  <Factory className="w-5 h-5" />
                  1공장 (전처리)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>공장명</Label>
                  <Input value="애니콩 1공장 전처리센터" readOnly />
                </div>
                <div>
                  <Label>주소</Label>
                  <Input value="경기도 화성시 ..." readOnly />
                </div>
                <div>
                  <Label>담당 공정</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className="bg-[#A3C478] text-white">원재료 입고</Badge>
                    <Badge className="bg-[#A3C478] text-white">절단/세척</Badge>
                    <Badge className="bg-[#A3C478] text-white">전처리</Badge>
                  </div>
                </div>
                <div>
                  <Label>창고코드</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input value="P1-RM" placeholder="원재료창고" readOnly />
                    <Input value="P1-WIP" placeholder="반제품창고" readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardHeader>
                <CardTitle className="text-[#724323] flex items-center gap-2">
                  <Factory className="w-5 h-5" />
                  2공장 (제조)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>공장명</Label>
                  <Input value="애니콩 2공장 제조센터" readOnly />
                </div>
                <div>
                  <Label>주소</Label>
                  <Input value="경기도 평택시 ..." readOnly />
                </div>
                <div>
                  <Label>담당 공정</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className="bg-[#F9B679] text-white">혼합/배합</Badge>
                    <Badge className="bg-[#F9B679] text-white">조리/베이킹</Badge>
                    <Badge className="bg-[#F9B679] text-white">포장</Badge>
                    <Badge className="bg-[#F9B679] text-white">냉동보관</Badge>
                  </div>
                </div>
                <div>
                  <Label>창고코드</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Input value="P2-RM" placeholder="원재료창고" readOnly />
                    <Input value="P2-WIP" placeholder="반제품창고" readOnly />
                    <Input value="P2-FG" placeholder="완제품창고" readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bom" className="space-y-4">
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Package className="w-5 h-5" />
                BOM (Bill of Materials) 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>완제품 선택</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="BOM을 설정할 완제품 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FG001">애니몽 밀키트 A</SelectItem>
                      <SelectItem value="FG002">애니몽 밀키트 B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>원재료 코드</TableHead>
                      <TableHead>원재료명</TableHead>
                      <TableHead>필요량 (g)</TableHead>
                      <TableHead>단위당 소요량</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>RAW001</TableCell>
                      <TableCell>닭고기 (가슴살)</TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="150" className="w-20" />
                      </TableCell>
                      <TableCell>150g/ea</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>RAW002</TableCell>
                      <TableCell>당근</TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="50" className="w-20" />
                      </TableCell>
                      <TableCell>50g/ea</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Button className="bg-[#724323] hover:bg-[#5a3419] text-white">
                  <Save className="w-4 h-4 mr-2" />
                  BOM 저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-[#F5E9D5]">
              <CardHeader>
                <CardTitle className="text-[#724323] flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  상온 보관
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>온도 범위</Label>
                  <Input value="15°C - 25°C" readOnly />
                </div>
                <div>
                  <Label>습도 범위</Label>
                  <Input value="40% - 60%" readOnly />
                </div>
                <div>
                  <Label>적용 품목</Label>
                  <div className="space-y-1 mt-2">
                    <Badge variant="outline">건조 사료</Badge>
                    <Badge variant="outline">포장재</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardHeader>
                <CardTitle className="text-[#724323] flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  냉장 보관
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>온도 범위</Label>
                  <Input value="0°C - 4°C" readOnly />
                </div>
                <div>
                  <Label>습도 범위</Label>
                  <Input value="85% - 95%" readOnly />
                </div>
                <div>
                  <Label>적용 품목</Label>
                  <div className="space-y-1 mt-2">
                    <Badge variant="outline">신선 육류</Badge>
                    <Badge variant="outline">야채류</Badge>
                    <Badge variant="outline">반제품</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardHeader>
                <CardTitle className="text-[#724323] flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  냉동 보관
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>온도 범위</Label>
                  <Input value="-18°C 이하" readOnly />
                </div>
                <div>
                  <Label>습도 범위</Label>
                  <Input value="N/A" readOnly />
                </div>
                <div>
                  <Label>적용 품목</Label>
                  <div className="space-y-1 mt-2">
                    <Badge variant="outline">완제품</Badge>
                    <Badge variant="outline">냉동 육류</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}