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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Factory,
  Scan,
  Play,
  Package,
  ChefHat,
  Box,
  Snowflake,
  CheckCircle,
  Clock,
  Thermometer,
} from "lucide-react";

export function Plant2ManufacturingPage() {
  const [manufacturingOrders, setManufacturingOrders] = useState([
    {
      id: "MO001",
      product: "애니콩 펫베이커리 A",
      targetQuantity: 1000,
      producedQuantity: 650,
      unit: "ea",
      status: "in_progress",
      stage: "baking",
      startTime: "08:00",
      estimatedCompletion: "16:00",
      operator: "최제조",
      recipe: "RCP001",
      bom: [
        {
          code: "WIP001",
          name: "전처리 믹스 A",
          required: 500,
          consumed: 325,
          unit: "kg",
        },
        {
          code: "RAW005",
          name: "조미료",
          required: 50,
          consumed: 32.5,
          unit: "kg",
        },
        {
          code: "PKG001",
          name: "포장재",
          required: 1000,
          consumed: 650,
          unit: "ea",
        },
      ],
    },
    {
      id: "MO002",
      product: "애니콩 펫베이커리 B",
      targetQuantity: 500,
      producedQuantity: 0,
      unit: "ea",
      status: "ready",
      stage: "waiting",
      operator: "김혼합",
      recipe: "RCP002",
      bom: [
        {
          code: "WIP002",
          name: "세척 야채 믹스",
          required: 200,
          consumed: 0,
          unit: "kg",
        },
        {
          code: "RAW006",
          name: "육류 베이스",
          required: 100,
          consumed: 0,
          unit: "kg",
        },
      ],
    },
  ]);

  const [qualityChecks, setQualityChecks] = useState([
    {
      id: "QC001",
      moId: "MO001",
      stage: "mixing",
      parameter: "온도",
      target: "65°C",
      actual: "64°C",
      status: "pass",
      checkedBy: "박품질",
      checkTime: "10:30",
    },
    {
      id: "QC002",
      moId: "MO001",
      stage: "baking",
      parameter: "습도",
      target: "85%",
      actual: "87%",
      status: "warning",
      checkedBy: "박품질",
      checkTime: "14:15",
    },
  ]);

  const statusColors: { [key: string]: string } = {
    ready: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    paused: "bg-gray-100 text-gray-800",
  };

  const statusLabels: { [key: string]: string } = {
    ready: "준비",
    in_progress: "진행중",
    completed: "완료",
    paused: "일시정지",
  };

  const stageColors: { [key: string]: string } = {
    waiting: "bg-gray-100 text-gray-800",
    mixing: "bg-blue-100 text-blue-800",
    baking: "bg-orange-100 text-orange-800",
    packaging: "bg-purple-100 text-purple-800",
    cold_storage: "bg-cyan-100 text-cyan-800",
    completed: "bg-green-100 text-green-800",
  };

  const stageLabels: { [key: string]: string } = {
    waiting: "대기",
    mixing: "혼합/배합",
    baking: "조리/베이킹",
    packaging: "포장",
    cold_storage: "냉동보관",
    completed: "완료",
  };

  const qualityStatusColors = {
    pass: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    fail: "bg-red-100 text-red-800",
  };

  const startManufacturing = (moId: string) => {
    setManufacturingOrders((prev) =>
      prev.map((mo) =>
        mo.id === moId
          ? {
              ...mo,
              status: "in_progress",
              stage: "mixing",
              startTime: new Date().toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : mo
      )
    );
  };

  const advanceStage = (moId: string) => {
    const stages = [
      "mixing",
      "baking",
      "packaging",
      "cold_storage",
      "completed",
    ];
    setManufacturingOrders((prev) =>
      prev.map((mo) => {
        if (mo.id === moId) {
          const currentIndex = stages.indexOf(mo.stage);
          const nextStage =
            stages[Math.min(currentIndex + 1, stages.length - 1)];
          return {
            ...mo,
            stage: nextStage,
            status: nextStage === "completed" ? "completed" : mo.status,
          };
        }
        return mo;
      })
    );
  };

  const scanBOM = (moId: string, bomCode: string, quantity: number) => {
    setManufacturingOrders((prev) =>
      prev.map((mo) => {
        if (mo.id === moId) {
          const updatedBom = mo.bom.map((item) =>
            item.code === bomCode
              ? {
                  ...item,
                  consumed: Math.min(item.required, item.consumed + quantity),
                }
              : item
          );

          const totalRequired = updatedBom.reduce(
            (sum, item) => sum + item.required,
            0
          );
          const totalConsumed = updatedBom.reduce(
            (sum, item) => sum + item.consumed,
            0
          );
          const progress = Math.round((totalConsumed / totalRequired) * 100);
          const producedQuantity = Math.round(
            (progress / 100) * mo.targetQuantity
          );

          return { ...mo, bom: updatedBom, producedQuantity };
        }
        return mo;
      })
    );
  };

  const addQualityCheck = (moId: string, stage: string) => {
    const newCheck = {
      id: `QC${String(qualityChecks.length + 1).padStart(3, "0")}`,
      moId,
      stage,
      parameter: "온도",
      target: "65°C",
      actual: "65°C",
      status: "pass" as const,
      checkedBy: "박품질",
      checkTime: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setQualityChecks((prev) => [newCheck, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#724323] flex items-center gap-2">
            <Factory className="w-6 h-6" />
            2공장 제조/포장
          </h1>
          <p className="text-[#333333] mt-1">
            MO 발행, 공정별 스캔, BOM 차감, 밀키트/완제품 분기
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#F9B679] text-white px-4 py-2">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            2공장 가동중
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="manufacturing" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="manufacturing">제조 현황</TabsTrigger>
          <TabsTrigger value="quality">품질 관리</TabsTrigger>
          <TabsTrigger value="packaging">포장 라인</TabsTrigger>
          <TabsTrigger value="storage">냉동 보관</TabsTrigger>
        </TabsList>

        <TabsContent value="manufacturing" className="space-y-4">
          {/* Manufacturing Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border border-[#F5E9D5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333] mb-1">진행중 MO</p>
                    <p className="text-2xl font-bold text-[#724323]">
                      {
                        manufacturingOrders.filter(
                          (mo) => mo.status === "in_progress"
                        ).length
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
                    <p className="text-sm text-[#333333] mb-1">오늘 생산량</p>
                    <p className="text-2xl font-bold text-[#724323]">650 ea</p>
                  </div>
                  <div className="p-3 bg-[#A3C478] rounded-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333] mb-1">품질 검사</p>
                    <p className="text-2xl font-bold text-[#724323]">
                      {
                        qualityChecks.filter((qc) => qc.status === "pass")
                          .length
                      }
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
                    <p className="text-sm text-[#333333] mb-1">가동률</p>
                    <p className="text-2xl font-bold text-[#724323]">87%</p>
                  </div>
                  <div className="p-3 bg-[#F5E9D5] rounded-lg">
                    <Clock className="w-5 h-5 text-[#724323]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Manufacturing Orders */}
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Package className="w-5 h-5" />
                제조 지시서 (MO)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {manufacturingOrders.map((mo) => (
                  <div
                    key={mo.id}
                    className="border border-[#F5E9D5] rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-medium text-[#724323] text-lg">
                            {mo.id}
                          </h3>
                          <p className="text-[#333333]">{mo.product}</p>
                          <p className="text-sm text-[#333333]">
                            목표: {mo.targetQuantity}
                            {mo.unit} | 생산: {mo.producedQuantity}
                            {mo.unit}
                          </p>
                        </div>
                        <Badge className={statusColors[mo.status]}>
                          {statusLabels[mo.status]}
                        </Badge>
                        <Badge className={stageColors[mo.stage]}>
                          {stageLabels[mo.stage]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {mo.status === "ready" && (
                          <Button
                            onClick={() => startManufacturing(mo.id)}
                            className="bg-[#A3C478] hover:bg-[#8fb865] text-white"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            제조 시작
                          </Button>
                        )}
                        {mo.status === "in_progress" &&
                          mo.stage !== "completed" && (
                            <>
                              <Button
                                onClick={() => advanceStage(mo.id)}
                                className="bg-[#F9B679] hover:bg-[#f7a866] text-white"
                              >
                                다음 공정
                              </Button>
                              <Button
                                onClick={() => addQualityCheck(mo.id, mo.stage)}
                                variant="outline"
                                className="border-[#724323] text-[#724323] hover:bg-[#F5E9D5]"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                품질검사
                              </Button>
                            </>
                          )}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#333333]">
                          생산 진행률
                        </span>
                        <span className="text-sm font-medium text-[#724323]">
                          {Math.round(
                            (mo.producedQuantity / mo.targetQuantity) * 100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(mo.producedQuantity / mo.targetQuantity) * 100}
                        className="h-2"
                      />
                    </div>

                    {/* BOM */}
                    <div>
                      <h4 className="font-medium text-[#724323] mb-3 flex items-center gap-2">
                        <Scan className="w-4 h-4" />
                        원재료 투입 (BOM)
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>원재료코드</TableHead>
                            <TableHead>원재료명</TableHead>
                            <TableHead>필요량</TableHead>
                            <TableHead>투입량</TableHead>
                            <TableHead>진행률</TableHead>
                            <TableHead>스캔</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mo.bom.map((item) => {
                            const progress = Math.round(
                              (item.consumed / item.required) * 100
                            );

                            return (
                              <TableRow key={item.code}>
                                <TableCell className="font-medium">
                                  {item.code}
                                </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                  {item.required} {item.unit}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {item.consumed} {item.unit}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress
                                      value={progress}
                                      className="w-16 h-2"
                                    />
                                    <span className="text-sm">{progress}%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      scanBOM(mo.id, item.code, 10)
                                    }
                                    disabled={
                                      item.consumed >= item.required ||
                                      mo.status !== "in_progress"
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

                    {/* Additional Info */}
                    <div className="mt-4 pt-4 border-t border-[#F5E9D5] flex justify-between text-sm text-[#333333]">
                      <span>작업자: {mo.operator}</span>
                      <span>레시피: {mo.recipe}</span>
                      {mo.startTime && <span>시작시간: {mo.startTime}</span>}
                      {mo.estimatedCompletion && (
                        <span>예상완료: {mo.estimatedCompletion}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                품질 검사 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>검사ID</TableHead>
                    <TableHead>MO번호</TableHead>
                    <TableHead>공정</TableHead>
                    <TableHead>검사항목</TableHead>
                    <TableHead>기준값</TableHead>
                    <TableHead>실측값</TableHead>
                    <TableHead>결과</TableHead>
                    <TableHead>검사자</TableHead>
                    <TableHead>검사시간</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualityChecks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell className="font-medium">{check.id}</TableCell>
                      <TableCell>{check.moId}</TableCell>
                      <TableCell>
                        <Badge className={stageColors[check.stage]}>
                          {stageLabels[check.stage]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Thermometer className="w-4 h-4 text-[#724323]" />
                          {check.parameter}
                        </div>
                      </TableCell>
                      <TableCell>{check.target}</TableCell>
                      <TableCell className="font-medium">
                        {check.actual}
                      </TableCell>
                      <TableCell>
                        <Badge className={qualityStatusColors[check.status]}>
                          {check.status === "pass"
                            ? "합격"
                            : check.status === "warning"
                            ? "주의"
                            : "불합격"}
                        </Badge>
                      </TableCell>
                      <TableCell>{check.checkedBy}</TableCell>
                      <TableCell>{check.checkTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packaging" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-[#F5E9D5]">
              <CardHeader>
                <CardTitle className="text-[#724323] flex items-center gap-2">
                  <Box className="w-5 h-5" />
                  포장 라인 #1
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#333333]">현재 작업</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    MO001 진행중
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#333333]">포장 속도</span>
                    <span className="font-medium">450 ea/시간</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#333333]">포장재 재고</span>
                    <p className="font-medium text-[#724323]">2,500 ea</p>
                  </div>
                  <div>
                    <span className="text-[#333333]">라벨 재고</span>
                    <p className="font-medium text-[#724323]">3,200 ea</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardHeader>
                <CardTitle className="text-[#724323] flex items-center gap-2">
                  <Box className="w-5 h-5" />
                  포장 라인 #2
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#333333]">현재 작업</span>
                  <Badge className="bg-blue-100 text-blue-800">대기중</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#333333]">포장 속도</span>
                    <span className="font-medium">0 ea/시간</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#333333]">포장재 재고</span>
                    <p className="font-medium text-[#724323]">1,800 ea</p>
                  </div>
                  <div>
                    <span className="text-[#333333]">라벨 재고</span>
                    <p className="font-medium text-[#724323]">2,100 ea</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-[#F5E9D5]">
              <CardHeader>
                <CardTitle className="text-[#724323] flex items-center gap-2">
                  <Snowflake className="w-5 h-5" />
                  냉동창고 A
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#333333]">온도</span>
                  <span className="font-medium text-blue-600">-18°C</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#333333]">보관량</span>
                    <span className="font-medium">850 / 1000 ea</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="text-sm">
                  <span className="text-[#333333]">주요 품목</span>
                  <p className="font-medium text-[#724323]">애니몽 밀키트 A</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardHeader>
                <CardTitle className="text-[#724323] flex items-center gap-2">
                  <Snowflake className="w-5 h-5" />
                  냉동창고 B
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#333333]">온도</span>
                  <span className="font-medium text-blue-600">-18°C</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#333333]">보관량</span>
                    <span className="font-medium">320 / 1000 ea</span>
                  </div>
                  <Progress value={32} className="h-2" />
                </div>
                <div className="text-sm">
                  <span className="text-[#333333]">주요 품목</span>
                  <p className="font-medium text-[#724323]">대기중</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardHeader>
                <CardTitle className="text-[#724323] flex items-center gap-2">
                  <Snowflake className="w-5 h-5" />
                  냉동창고 C
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#333333]">온도</span>
                  <span className="font-medium text-blue-600">-18°C</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#333333]">보관량</span>
                    <span className="font-medium">120 / 1000 ea</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>
                <div className="text-sm">
                  <span className="text-[#333333]">주요 품목</span>
                  <p className="font-medium text-[#724323]">완제품 보관</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
