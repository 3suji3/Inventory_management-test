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
import { Progress } from "../ui/progress";
import {
  Factory,
  Scan,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Users,
  Package,
  ArrowRight,
} from "lucide-react";

export function Plant1ProcessingPage() {
  const [activeProcess, setActiveProcess] = useState<string | null>(null);
  const [scannedItems, setScannedItems] = useState<string[]>([]);

  type WorkOrderStatus = "ready" | "in_progress" | "completed" | "paused";

  const [workOrders, setWorkOrders] = useState([
    {
      id: "WO001",
      type: "전처리",
      product: "전처리 믹스 A",
      quantity: 100,
      unit: "kg",
      status: "ready" as WorkOrderStatus,
      operator: "김전처리",
      startTime: null,
      progress: 0,
      materials: [
        {
          code: "RAW001",
          name: "닭고기 (가슴살)",
          required: 50,
          scanned: 0,
          unit: "kg",
        },
        { code: "RAW002", name: "당근", required: 30, scanned: 0, unit: "kg" },
        { code: "RAW003", name: "감자", required: 20, scanned: 0, unit: "kg" },
      ],
    },
    {
      id: "WO002",
      type: "세척",
      product: "세척 야채 믹스",
      quantity: 200,
      unit: "kg",
      status: "in_progress" as WorkOrderStatus,
      operator: "이세척",
      startTime: "09:30",
      progress: 65,
      materials: [
        {
          code: "RAW002",
          name: "당근",
          required: 100,
          scanned: 100,
          unit: "kg",
        },
        {
          code: "RAW004",
          name: "양배추",
          required: 100,
          scanned: 100,
          unit: "kg",
        },
      ],
    },
    {
      id: "WO003",
      type: "절단",
      product: "절단 육류",
      quantity: 50,
      unit: "kg",
      status: "completed" as WorkOrderStatus,
      operator: "박절단",
      startTime: "08:00",
      progress: 100,
      materials: [
        {
          code: "RAW001",
          name: "닭고기 (가슴살)",
          required: 50,
          scanned: 50,
          unit: "kg",
        },
      ],
    },
  ]);

  const statusColors: Record<WorkOrderStatus, string> = {
    ready: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    paused: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<WorkOrderStatus, string> = {
    ready: "준비",
    in_progress: "진행중",
    completed: "완료",
    paused: "일시정지",
  };

  const startProcess = (woId: string) => {
    setActiveProcess(woId);
    setWorkOrders((prev) =>
      prev.map((wo) =>
        wo.id === woId
          ? {
              ...wo,
              status: "in_progress",
              startTime: new Date().toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : wo
      )
    );
  };

  const pauseProcess = (woId: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === woId ? { ...wo, status: "paused" } : wo))
    );
  };

  const completeProcess = (woId: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) =>
        wo.id === woId ? { ...wo, status: "completed", progress: 100 } : wo
      )
    );
    setActiveProcess(null);
  };

  const scanMaterial = (
    woId: string,
    materialCode: string,
    quantity: number
  ) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === woId) {
          const updatedMaterials = wo.materials.map((material) =>
            material.code === materialCode
              ? {
                  ...material,
                  scanned: Math.min(
                    material.required,
                    material.scanned + quantity
                  ),
                }
              : material
          );

          const totalRequired = updatedMaterials.reduce(
            (sum, m) => sum + m.required,
            0
          );
          const totalScanned = updatedMaterials.reduce(
            (sum, m) => sum + m.scanned,
            0
          );
          const progress = Math.round((totalScanned / totalRequired) * 100);

          return { ...wo, materials: updatedMaterials, progress };
        }
        return wo;
      })
    );

    setScannedItems((prev) => [...prev, `${woId}-${materialCode}-${quantity}`]);
    setTimeout(() => {
      setScannedItems((prev) =>
        prev.filter((item) => item !== `${woId}-${materialCode}-${quantity}`)
      );
    }, 3000);
  };

  const generateOutputLabel = (wo: any) => {
    const outputCode = `WIP${Date.now().toString().slice(-6)}`;
    alert(
      `전처리 산출 라벨 생성됨:\n\n산출코드: ${outputCode}\n품목: ${
        wo.product
      }\n수량: ${wo.quantity}${wo.unit}\n작업자: ${
        wo.operator
      }\n완료시간: ${new Date().toLocaleString(
        "ko-KR"
      )}\n\n라벨이 프린터로 전송되었습니다.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#724323] flex items-center gap-2">
            <Factory className="w-6 h-6" />
            1공장 전처리 공정
          </h1>
          <p className="text-[#333333] mt-1">
            공정시작 스캔, 투입 바코드 스캔, 전처리 산출 라벨 생성
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#A3C478] text-white px-4 py-2">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            1공장 가동중
          </Badge>
        </div>
      </div>

      {/* Real-time Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333] mb-1">진행중 작업</p>
                <p className="text-2xl font-bold text-[#724323]">
                  {
                    workOrders.filter((wo) => wo.status === "in_progress")
                      .length
                  }
                </p>
              </div>
              <div className="p-3 bg-[#F9B679] rounded-lg">
                <Factory className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333] mb-1">대기 작업</p>
                <p className="text-2xl font-bold text-[#724323]">
                  {workOrders.filter((wo) => wo.status === "ready").length}
                </p>
              </div>
              <div className="p-3 bg-[#A3C478] rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333] mb-1">완료 작업</p>
                <p className="text-2xl font-bold text-[#724323]">
                  {workOrders.filter((wo) => wo.status === "completed").length}
                </p>
              </div>
              <div className="p-3 bg-[#724323] rounded-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333] mb-1">작업자</p>
                <p className="text-2xl font-bold text-[#724323]">3</p>
              </div>
              <div className="p-3 bg-[#F5E9D5] rounded-lg">
                <Users className="w-5 h-5 text-[#724323]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders */}
      <Card className="border border-[#F5E9D5]">
        <CardHeader>
          <CardTitle className="text-[#724323] flex items-center gap-2">
            <Package className="w-5 h-5" />
            작업 지시서 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {workOrders.map((wo) => (
              <div
                key={wo.id}
                className="border border-[#F5E9D5] rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-medium text-[#724323] text-lg">
                        {wo.id}
                      </h3>
                      <p className="text-[#333333]">
                        {wo.type} • {wo.product}
                      </p>
                      <p className="text-sm text-[#333333]">
                        목표: {wo.quantity}
                        {wo.unit}
                      </p>
                    </div>
                    <Badge className={statusColors[wo.status]}>
                      {statusLabels[wo.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-[#333333]">작업자</p>
                      <p className="font-medium text-[#724323]">
                        {wo.operator}
                      </p>
                      {wo.startTime && (
                        <p className="text-sm text-[#333333]">
                          시작: {wo.startTime}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {wo.status === "ready" && (
                        <Button
                          onClick={() => startProcess(wo.id)}
                          className="bg-[#A3C478] hover:bg-[#8fb865] text-white"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          시작
                        </Button>
                      )}
                      {wo.status === "in_progress" && (
                        <>
                          <Button
                            onClick={() => pauseProcess(wo.id)}
                            variant="outline"
                            className="border-orange-500 text-orange-500 hover:bg-orange-50"
                          >
                            <Pause className="w-4 h-4 mr-2" />
                            일시정지
                          </Button>
                          <Button
                            onClick={() => completeProcess(wo.id)}
                            className="bg-[#724323] hover:bg-[#5a3419] text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            완료
                          </Button>
                        </>
                      )}
                      {wo.status === "completed" && (
                        <Button
                          onClick={() => generateOutputLabel(wo)}
                          className="bg-[#F9B679] hover:bg-[#f7a866] text-white"
                        >
                          산출라벨 생성
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <h4 className="font-medium text-[#724323] mb-3 flex items-center gap-2">
                    <Scan className="w-4 h-4" />
                    투입 원재료
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>원재료코드</TableHead>
                        <TableHead>원재료명</TableHead>
                        <TableHead>필요량</TableHead>
                        <TableHead>스캔량</TableHead>
                        <TableHead>진행률</TableHead>
                        <TableHead>스캔</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wo.materials.map((material) => {
                        const materialProgress = Math.round(
                          (material.scanned / material.required) * 100
                        );
                        const isScanned = scannedItems.some((item) =>
                          item.includes(material.code)
                        );

                        return (
                          <TableRow
                            key={material.code}
                            className={isScanned ? "bg-green-50" : ""}
                          >
                            <TableCell className="font-medium">
                              {material.code}
                            </TableCell>
                            <TableCell>{material.name}</TableCell>
                            <TableCell>
                              {material.required} {material.unit}
                            </TableCell>
                            <TableCell className="font-medium">
                              {material.scanned} {material.unit}
                              {isScanned && (
                                <Badge className="ml-2 bg-green-500 text-white">
                                  스캔됨!
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={materialProgress}
                                  className="w-16 h-2"
                                />
                                <span className="text-sm">
                                  {materialProgress}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() =>
                                  scanMaterial(wo.id, material.code, 10)
                                }
                                disabled={
                                  material.scanned >= material.required ||
                                  wo.status !== "in_progress"
                                }
                                className="bg-[#724323] hover:bg-[#5a3419] text-white"
                              >
                                <Scan className="w-4 h-4 mr-1" />
                                스캔
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processing Equipment Status */}
      <Card className="border border-[#F5E9D5]">
        <CardHeader>
          <CardTitle className="text-[#724323] flex items-center gap-2">
            <Factory className="w-5 h-5" />
            설비 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[#F5E9D5] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-[#724323]">절단기 #1</h4>
                <Badge className="bg-green-100 text-green-800">정상</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#333333]">가동률</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-[#333333]">현재 작업</span>
                  <span className="font-medium">WO003</span>
                </div>
              </div>
            </div>

            <div className="border border-[#F5E9D5] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-[#724323]">세척기 #1</h4>
                <Badge className="bg-yellow-100 text-yellow-800">작업중</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#333333]">가동률</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-[#333333]">현재 작업</span>
                  <span className="font-medium">WO002</span>
                </div>
              </div>
            </div>

            <div className="border border-[#F5E9D5] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-[#724323]">전처리기 #1</h4>
                <Badge className="bg-blue-100 text-blue-800">대기</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#333333]">가동률</span>
                  <span className="font-medium">0%</span>
                </div>
                <Progress value={0} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-[#333333]">다음 작업</span>
                  <span className="font-medium">WO001</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
