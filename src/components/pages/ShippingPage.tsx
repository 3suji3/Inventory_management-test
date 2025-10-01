import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Truck,
  Package,
  Scan,
  FileText,
  Calendar,
  Building,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

export function ShippingPage() {
  const [orders, setOrders] = useState([
    {
      id: "SO001",
      type: "B2B",
      customer: "펫마트 강남점",
      products: [
        {
          code: "FG001",
          name: "애니콩 펫베이커리 A",
          ordered: 100,
          allocated: 0,
          unit: "ea",
          expiry: "2025-10-11",
        },
        {
          code: "FG002",
          name: "애니콩 펫베이커리 B",
          ordered: 50,
          allocated: 0,
          unit: "ea",
          expiry: "2025-10-08",
        },
      ],
      orderDate: "2025-09-10",
      requestedDate: "2025-09-12",
      status: "pending",
      priority: "normal",
    },
    {
      id: "SO002",
      type: "B2C",
      customer: "김펫맘",
      products: [
        {
          code: "FG001",
          name: "애니콩 펫베이커리 A",
          ordered: 5,
          allocated: 5,
          unit: "ea",
          expiry: "2025-10-15",
        },
      ],
      orderDate: "2025-09-11",
      requestedDate: "2025-09-11",
      status: "picked",
      priority: "urgent",
    },
    {
      id: "SO003",
      type: "B2B",
      customer: "펫샵 홍대점",
      products: [
        {
          code: "FG002",
          name: "애니콩 펫베이커리 B",
          ordered: 200,
          allocated: 200,
          unit: "ea",
          expiry: "2025-10-20",
        },
      ],
      orderDate: "2025-09-09",
      requestedDate: "2025-09-11",
      status: "shipped",
      priority: "normal",
      trackingNumber: "TRK20250911001",
    },
  ]);

  const [inventory, setInventory] = useState([
    {
      code: "FG001",
      name: "애니콩 펫베이커리 A",
      available: 850,
      lot: "LOT20250909001",
      expiry: "2025-10-09",
      location: "P2-FG-A1",
    },
    {
      code: "FG001",
      name: "애니콩 펫베이커리 A",
      available: 320,
      lot: "LOT20250910002",
      expiry: "2025-10-10",
      location: "P2-FG-A2",
    },
    {
      code: "FG001",
      name: "애니콩 펫베이커리 A",
      available: 150,
      lot: "LOT20250911003",
      expiry: "2025-10-11",
      location: "P2-FG-A3",
    },
    {
      code: "FG002",
      name: "애니콩 펫베이커리 B",
      available: 500,
      lot: "LOT20250908004",
      expiry: "2025-10-08",
      location: "P2-FG-B1",
    },
    {
      code: "FG002",
      name: "애니콩 펫베이커리 B",
      available: 200,
      lot: "LOT20250911005",
      expiry: "2025-10-11",
      location: "P2-FG-B2",
    },
  ]);

  const statusColors: { [key: string]: string } = {
    pending: "bg-blue-100 text-blue-800",
    allocated: "bg-yellow-100 text-yellow-800",
    picked: "bg-orange-100 text-orange-800",
    shipped: "bg-green-100 text-green-800",
    delivered: "bg-purple-100 text-purple-800",
  };

  const statusLabels: { [key: string]: string } = {
    pending: "대기",
    allocated: "할당완료",
    picked: "피킹완료",
    shipped: "출고완료",
    delivered: "배송완료",
  };

  const priorityColors: { [key: string]: string } = {
    urgent: "bg-red-100 text-red-800",
    normal: "bg-gray-100 text-gray-800",
    low: "bg-blue-100 text-blue-800",
  };

  const priorityLabels: { [key: string]: string } = {
    urgent: "긴급",
    normal: "일반",
    low: "낮음",
  };

  // FEFO 로직 (First Expired, First Out)
  const allocateInventory = (
    orderId: string,
    productCode: string,
    quantity: number
  ) => {
    // 유통기한 기준으로 정렬 (빠른 순서대로)
    const availableStock = inventory
      .filter((item) => item.code === productCode && item.available > 0)
      .sort(
        (a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime()
      );

    let remainingQuantity = quantity;
    const allocations = [];

    for (const stock of availableStock) {
      if (remainingQuantity <= 0) break;

      const allocatedFromThis = Math.min(stock.available, remainingQuantity);
      allocations.push({
        lot: stock.lot,
        quantity: allocatedFromThis,
        location: stock.location,
        expiry: stock.expiry,
      });

      remainingQuantity -= allocatedFromThis;
    }

    if (remainingQuantity > 0) {
      alert(`재고 부족: ${productCode}의 ${remainingQuantity}개가 부족합니다.`);
      return false;
    }

    // 주문 상태 업데이트
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedProducts = order.products.map((product) =>
            product.code === productCode
              ? { ...product, allocated: quantity }
              : product
          );

          const allAllocated = updatedProducts.every(
            (p) => p.allocated >= p.ordered
          );
          return {
            ...order,
            products: updatedProducts,
            status: allAllocated ? "allocated" : order.status,
          };
        }
        return order;
      })
    );

    // 재고 차감
    setInventory((prev) => {
      let newInventory = [...prev];
      let remaining = quantity;

      for (let i = 0; i < newInventory.length && remaining > 0; i++) {
        if (
          newInventory[i].code === productCode &&
          newInventory[i].available > 0
        ) {
          const deduction = Math.min(newInventory[i].available, remaining);
          newInventory[i] = {
            ...newInventory[i],
            available: newInventory[i].available - deduction,
          };
          remaining -= deduction;
        }
      }

      return newInventory;
    });

    alert(
      `할당 완료:\n${allocations
        .map((a) => `${a.lot}: ${a.quantity}개 (${a.location})`)
        .join("\n")}`
    );
    return true;
  };

  const generatePickingList = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const pickingList = order.products
      .filter((p) => p.allocated > 0)
      .map((p) => {
        const stocks = inventory
          .filter((item) => item.code === p.code && item.available < 1000) // 차감된 재고 추정
          .sort(
            (a, b) =>
              new Date(a.expiry).getTime() - new Date(b.expiry).getTime()
          );

        return {
          product: p.name,
          quantity: p.allocated,
          locations: stocks
            .slice(0, 2)
            .map((s) => s.location)
            .join(", "),
          expiry: stocks[0]?.expiry || p.expiry,
        };
      });

    alert(
      `피킹 리스트 생성됨 (${orderId}):\n\n${pickingList
        .map(
          (item) =>
            `${item.product}: ${item.quantity}개\n위치: ${item.locations}\n유통기한: ${item.expiry}`
        )
        .join("\n\n")}`
    );
  };

  const completePicking = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "picked" } : order
      )
    );
  };

  const shipOrder = (orderId: string) => {
    const trackingNumber = `TRK${Date.now().toString().slice(-9)}`;
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "shipped", trackingNumber }
          : order
      )
    );
    alert(`출고 완료!\n송장번호: ${trackingNumber}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#724323] flex items-center gap-2">
            <Truck className="w-6 h-6" />
            출고 관리
          </h1>
          <p className="text-[#333333] mt-1">
            B2B/B2C 피킹, FEFO 우선, 송장 발행
          </p>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">주문 관리</TabsTrigger>
          <TabsTrigger value="picking">피킹 관리</TabsTrigger>
          <TabsTrigger value="inventory">출고 재고</TabsTrigger>
          <TabsTrigger value="tracking">배송 추적</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* Order Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border border-[#F5E9D5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333] mb-1">신규 주문</p>
                    <p className="text-2xl font-bold text-[#724323]">
                      {orders.filter((o) => o.status === "pending").length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333] mb-1">피킹 대기</p>
                    <p className="text-2xl font-bold text-[#724323]">
                      {orders.filter((o) => o.status === "allocated").length}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Package className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333] mb-1">출고 완료</p>
                    <p className="text-2xl font-bold text-[#724323]">
                      {orders.filter((o) => o.status === "shipped").length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Truck className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333] mb-1">긴급 주문</p>
                    <p className="text-2xl font-bold text-[#724323]">
                      {orders.filter((o) => o.priority === "urgent").length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <FileText className="w-5 h-5" />
                주문 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-[#F5E9D5] rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-medium text-[#724323] text-lg">
                            {order.id}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                order.type === "B2B"
                                  ? "bg-[#724323] text-white"
                                  : "bg-[#F9B679] text-white"
                              }
                            >
                              {order.type}
                            </Badge>
                            <span className="text-[#333333]">
                              {order.customer}
                            </span>
                          </div>
                          <p className="text-sm text-[#333333]">
                            주문일: {order.orderDate} | 요청일:{" "}
                            {order.requestedDate}
                          </p>
                        </div>
                        <Badge className={statusColors[order.status]}>
                          {statusLabels[order.status]}
                        </Badge>
                        <Badge className={priorityColors[order.priority]}>
                          {priorityLabels[order.priority]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.status === "pending" && (
                          <Button
                            onClick={() => {
                              order.products.forEach((product) => {
                                allocateInventory(
                                  order.id,
                                  product.code,
                                  product.ordered
                                );
                              });
                            }}
                            className="bg-[#A3C478] hover:bg-[#8fb865] text-white"
                          >
                            재고 할당
                          </Button>
                        )}
                        {order.status === "allocated" && (
                          <>
                            <Button
                              onClick={() => generatePickingList(order.id)}
                              variant="outline"
                              className="border-[#724323] text-[#724323] hover:bg-[#F5E9D5]"
                            >
                              피킹리스트
                            </Button>
                            <Button
                              onClick={() => completePicking(order.id)}
                              className="bg-[#F9B679] hover:bg-[#f7a866] text-white"
                            >
                              피킹 완료
                            </Button>
                          </>
                        )}
                        {order.status === "picked" && (
                          <Button
                            onClick={() => shipOrder(order.id)}
                            className="bg-[#724323] hover:bg-[#5a3419] text-white"
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            출고
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>품목코드</TableHead>
                          <TableHead>품목명</TableHead>
                          <TableHead>주문수량</TableHead>
                          <TableHead>할당수량</TableHead>
                          <TableHead>유통기한</TableHead>
                          <TableHead>상태</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.products.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {product.code}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                              {product.ordered} {product.unit}
                            </TableCell>
                            <TableCell className="font-medium">
                              {product.allocated} {product.unit}
                              {product.allocated < product.ordered && (
                                <Badge className="ml-2 bg-red-100 text-red-800">
                                  부족
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-[#333333]" />
                                {product.expiry}
                              </div>
                            </TableCell>
                            <TableCell>
                              {product.allocated >= product.ordered ? (
                                <Badge className="bg-green-100 text-green-800">
                                  할당완료
                                </Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800">
                                  대기
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {order.trackingNumber && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-800 font-medium">
                            출고 완료 - 송장번호: {order.trackingNumber}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="picking" className="space-y-4">
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Scan className="w-5 h-5" />
                피킹 작업대
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-[#724323]">피킹 스캔</h4>
                  <div className="space-y-2">
                    <Label>주문번호</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="피킹할 주문 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {orders
                          .filter((o) => o.status === "allocated")
                          .map((order) => (
                            <SelectItem key={order.id} value={order.id}>
                              {order.id} - {order.customer}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>바코드 스캔</Label>
                    <Input placeholder="품목 바코드를 스캔하세요" />
                  </div>
                  <Button className="w-full bg-[#724323] hover:bg-[#5a3419] text-white">
                    <Scan className="w-4 h-4 mr-2" />
                    스캔 확인
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-[#724323]">피킹 진행률</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#333333]">
                        SO002 - 김펫맘
                      </span>
                      <Badge className="bg-orange-100 text-orange-800">
                        피킹중
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>애니몽 밀키트 A (5ea)</span>
                        <span className="text-green-600">완료</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Package className="w-5 h-5" />
                출고 가능 재고 (FEFO 기준)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>품목코드</TableHead>
                    <TableHead>품목명</TableHead>
                    <TableHead>재고수량</TableHead>
                    <TableHead>로트번호</TableHead>
                    <TableHead>유통기한</TableHead>
                    <TableHead>위치</TableHead>
                    <TableHead>우선순위</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory
                    .filter((item) => item.available > 0)
                    .sort(
                      (a, b) =>
                        new Date(a.expiry).getTime() -
                        new Date(b.expiry).getTime()
                    )
                    .map((item, index) => {
                      const daysToExpiry = Math.ceil(
                        (new Date(item.expiry).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      const isExpiringSoon = daysToExpiry <= 3;

                      return (
                        <TableRow
                          key={index}
                          className={isExpiringSoon ? "bg-red-50" : ""}
                        >
                          <TableCell className="font-medium">
                            {item.code}
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.available} ea</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.lot}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-[#333333]" />
                              {item.expiry}
                              {isExpiringSoon && (
                                <AlertTriangle className="w-4 h-4 text-red-500 ml-1" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                isExpiringSoon
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {isExpiringSoon ? "긴급" : "일반"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Truck className="w-5 h-5" />
                배송 추적
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders
                  .filter((o) => o.status === "shipped")
                  .map((order) => (
                    <div
                      key={order.id}
                      className="border border-[#F5E9D5] rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-[#724323]">
                            {order.id} - {order.customer}
                          </h4>
                          <p className="text-sm text-[#333333]">
                            송장번호: {order.trackingNumber}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          배송중
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#333333]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>출고일: {order.requestedDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          <span>
                            예상도착:{" "}
                            {
                              new Date(Date.now() + 24 * 60 * 60 * 1000)
                                .toISOString()
                                .split("T")[0]
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
