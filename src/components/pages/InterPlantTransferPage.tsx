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
import {
  ArrowRightLeft,
  Truck,
  Package,
  Scan,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface TransferItem {
  code: string;
  name: string;
  quantity: number;
  unit: string;
  lot: string;
}

interface Transfer {
  id: string;
  fromPlant: string;
  toPlant: string;
  status: "preparing" | "in_transit" | "delivered";
  items: TransferItem[];
  createdDate?: string;
  preparedBy?: string;
  transportMode?: string;
  departureTime?: string;
  estimatedArrival?: string;
  deliveredTime?: string;
  receivedBy?: string;
}

export function InterPlantTransferPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([
    {
      id: "TRF001",
      fromPlant: "1공장",
      toPlant: "2공장",
      status: "preparing",
      items: [
        {
          code: "WIP001",
          name: "전처리 믹스 A",
          quantity: 50,
          unit: "kg",
          lot: "LOT20250911001",
        },
        {
          code: "WIP002",
          name: "세척 야채 믹스",
          quantity: 100,
          unit: "kg",
          lot: "LOT20250911002",
        },
      ],
      createdDate: "2025-09-11",
      preparedBy: "김전처리",
      transportMode: "internal_truck",
    },
    {
      id: "TRF002",
      fromPlant: "1공장",
      toPlant: "2공장",
      status: "in_transit",
      items: [
        {
          code: "WIP003",
          name: "절단 육류",
          quantity: 75,
          unit: "kg",
          lot: "LOT20250910003",
        },
      ],
      createdDate: "2025-09-10",
      preparedBy: "이세척",
      transportMode: "pallet",
      departureTime: "14:30",
      estimatedArrival: "15:00",
    },
    {
      id: "TRF003",
      fromPlant: "1공장",
      toPlant: "2공장",
      status: "delivered",
      items: [
        {
          code: "WIP004",
          name: "전처리 야채",
          quantity: 200,
          unit: "kg",
          lot: "LOT20250909004",
        },
      ],
      createdDate: "2025-09-09",
      preparedBy: "박절단",
      transportMode: "box",
      deliveredTime: "16:45",
      receivedBy: "최제조",
    },
  ]);

  const [newTransfer, setNewTransfer] = useState({
    items: [{ code: "", name: "", quantity: 0, unit: "kg", lot: "" }],
    transportMode: "internal_truck",
  });

  const statusColors = {
    preparing: "bg-blue-100 text-blue-800",
    in_transit: "bg-yellow-100 text-yellow-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    preparing: "출고준비",
    in_transit: "이송중",
    delivered: "입고완료",
    cancelled: "취소됨",
  };

  const transportModes: {
    [key: string]: { label: string; icon: string; color: string };
  } = {
    internal_truck: {
      label: "내부트럭",
      icon: "🚛",
      color: "bg-[#724323]",
    },
    pallet: {
      label: "팔렛",
      icon: "📦",
      color: "bg-[#F9B679]",
    },
    box: { label: "박스", icon: "📋", color: "bg-[#A3C478]" },
  };

  const startTransfer = (transferId: string) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        transfer.id === transferId
          ? {
              ...transfer,
              status: "in_transit",
              departureTime: new Date().toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              estimatedArrival: new Date(
                Date.now() + 30 * 60 * 1000
              ).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : transfer
      )
    );
  };

  const completeTransfer = (transferId: string) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        transfer.id === transferId
          ? {
              ...transfer,
              status: "delivered",
              deliveredTime: new Date().toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              receivedBy: "2공장 담당자",
            }
          : transfer
      )
    );
  };

  const createTransfer = () => {
    const transferId = `TRF${String(transfers.length + 1).padStart(3, "0")}`;
    const newTransferData = {
      id: transferId,
      fromPlant: "1공장",
      toPlant: "2공장",
      status: "preparing" as const,
      items: newTransfer.items.filter((item) => item.code && item.name),
      createdDate: new Date().toISOString().split("T")[0],
      preparedBy: "현재사용자",
      transportMode: newTransfer.transportMode,
    };

    setTransfers((prev) => [newTransferData, ...prev]);
    setNewTransfer({
      items: [
        {
          code: "",
          name: "",
          quantity: 0,
          unit: "kg",
          lot: "",
        },
      ],
      transportMode: "internal_truck",
    });
  };

  const addItemToTransfer = () => {
    setNewTransfer((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          code: "",
          name: "",
          quantity: 0,
          unit: "kg",
          lot: "",
        },
      ],
    }));
  };

  const updateTransferItem = (index: number, field: string, value: any) => {
    setNewTransfer((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#724323] flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6" />
            공장간 이동 관리
          </h1>
          <p className="text-[#333333] mt-1">
            1공장 출고 → IN-TRANSIT → 2공장 입고
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#A3C478] text-white px-4 py-2">
            오늘 이송:{" "}
            {transfers.filter((t) => t.createdDate === "2025-09-11").length}건
          </Badge>
        </div>
      </div>

      {/* Transfer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333] mb-1">출고준비</p>
                <p className="text-2xl font-bold text-[#724323]">
                  {transfers.filter((t) => t.status === "preparing").length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333] mb-1">이송중</p>
                <p className="text-2xl font-bold text-[#724323]">
                  {transfers.filter((t) => t.status === "in_transit").length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Truck className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333] mb-1">입고완료</p>
                <p className="text-2xl font-bold text-[#724323]">
                  {transfers.filter((t) => t.status === "delivered").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333] mb-1">평균 이송시간</p>
                <p className="text-2xl font-bold text-[#724323]">32분</p>
              </div>
              <div className="p-3 bg-[#F5E9D5] rounded-lg">
                <Clock className="w-5 h-5 text-[#724323]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Transfer */}
      <Card className="border border-[#F5E9D5]">
        <CardHeader>
          <CardTitle className="text-[#724323] flex items-center gap-2">
            <Package className="w-5 h-5" />
            신규 이송 등록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>출발 공장</Label>
                <Input value="1공장 (전처리)" readOnly />
              </div>
              <div>
                <Label>도착 공장</Label>
                <Input value="2공장 (제조)" readOnly />
              </div>
              <div>
                <Label>운송 방식</Label>
                <Select
                  value={newTransfer.transportMode}
                  onValueChange={(value: string) =>
                    setNewTransfer((prev) => ({
                      ...prev,
                      transportMode: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(transportModes).map(([key, mode]) => (
                      <SelectItem key={key} value={key}>
                        {mode.icon} {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>이송 품목</Label>
              <div className="space-y-2 mt-2">
                {newTransfer.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 bg-[#FAF6F2] rounded-lg"
                  >
                    <Input
                      placeholder="품목코드"
                      value={item.code}
                      onChange={(e) =>
                        updateTransferItem(index, "code", e.target.value)
                      }
                    />
                    <Input
                      placeholder="품목명"
                      value={item.name}
                      onChange={(e) =>
                        updateTransferItem(index, "name", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="수량"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        updateTransferItem(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <Select
                      value={item.unit}
                      onValueChange={(value: string) =>
                        updateTransferItem(index, "unit", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="ea">ea</SelectItem>
                        <SelectItem value="box">box</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="로트번호"
                      value={item.lot}
                      onChange={(e) =>
                        updateTransferItem(index, "lot", e.target.value)
                      }
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setNewTransfer((prev) => ({
                          ...prev,
                          items: prev.items.filter((_, i) => i !== index),
                        }));
                      }}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      삭제
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addItemToTransfer}
                  className="w-full border-[#724323] text-[#724323] hover:bg-[#F5E9D5]"
                >
                  + 품목 추가
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={createTransfer}
                className="bg-[#724323] hover:bg-[#5a3419] text-white"
              >
                이송 등록
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer List */}
      <Card className="border border-[#F5E9D5]">
        <CardHeader>
          <CardTitle className="text-[#724323] flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            이송 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transfers.map((transfer) => (
              <div
                key={transfer.id}
                className="border border-[#F5E9D5] rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-medium text-[#724323] text-lg">
                        {transfer.id}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-[#333333]">
                        <MapPin className="w-4 h-4" />
                        {transfer.fromPlant} → {transfer.toPlant}
                      </div>
                      <p className="text-sm text-[#333333]">
                        등록일: {transfer.createdDate}
                      </p>
                    </div>
                    <Badge className={statusColors[transfer.status]}>
                      {statusLabels[transfer.status]}
                    </Badge>
                    <div
                      className={`px-3 py-1 rounded-lg ${
                        typeof transfer.transportMode === "string" &&
                        transportModes[transfer.transportMode]
                          ? transportModes[transfer.transportMode].color
                          : "bg-gray-200"
                      } text-white`}
                    >
                      {typeof transfer.transportMode === "string" &&
                      transportModes[transfer.transportMode]
                        ? transportModes[transfer.transportMode].icon
                        : ""}
                      {typeof transfer.transportMode === "string" &&
                      transportModes[transfer.transportMode]
                        ? transportModes[transfer.transportMode].label
                        : transfer.transportMode}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {transfer.status === "preparing" && (
                      <Button
                        onClick={() => startTransfer(transfer.id)}
                        className="bg-[#F9B679] hover:bg-[#f7a866] text-white"
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        출고 시작
                      </Button>
                    )}
                    {transfer.status === "in_transit" && (
                      <Button
                        onClick={() => completeTransfer(transfer.id)}
                        className="bg-[#A3C478] hover:bg-[#8fb865] text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        입고 완료
                      </Button>
                    )}
                    {transfer.status === "delivered" && (
                      <Button
                        variant="outline"
                        className="border-[#724323] text-[#724323] hover:bg-[#F5E9D5]"
                      >
                        <Scan className="w-4 h-4 mr-2" />
                        이력 조회
                      </Button>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                {(transfer.status === "in_transit" ||
                  transfer.status === "delivered") && (
                  <div className="mb-4 p-3 bg-[#F5E9D5] rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#724323]" />
                        <span className="text-[#724323] font-medium">
                          출발: {transfer.departureTime}
                        </span>
                      </div>
                      {transfer.estimatedArrival && (
                        <span className="text-[#333333]">
                          예상도착: {transfer.estimatedArrival}
                        </span>
                      )}
                      {transfer.deliveredTime && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-medium">
                            도착: {transfer.deliveredTime}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Items */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>품목코드</TableHead>
                      <TableHead>품목명</TableHead>
                      <TableHead>수량</TableHead>
                      <TableHead>로트번호</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transfer.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.code}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.lot}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[transfer.status]}>
                            {statusLabels[transfer.status]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Additional Info */}
                <div className="mt-4 text-sm text-[#333333] flex justify-between">
                  <span>준비자: {transfer.preparedBy}</span>
                  {transfer.receivedBy && (
                    <span>수령자: {transfer.receivedBy}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
