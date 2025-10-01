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
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Tags,
  Printer,
  Eye,
  Edit,
  Save,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Settings,
} from "lucide-react";

export function LabelManagementPage() {
  const [templates, setTemplates] = useState([
    {
      id: "LBL001",
      name: "원재료 입고 라벨",
      type: "raw_material",
      size: "50x30mm",
      fields: [
        "품목코드",
        "품목명",
        "수량",
        "로트번호",
        "제조일",
        "유통기한",
        "공급업체",
      ],
      zpl: "^XA^FO50,50^A0N,30,30^FD품목: {{itemName}}^FS^FO50,100^A0N,25,25^FD로트: {{lotNumber}}^FS^XZ",
      status: "active",
      lastModified: "2025-09-10",
    },
    {
      id: "LBL002",
      name: "전처리 산출 라벨",
      type: "wip",
      size: "60x40mm",
      fields: [
        "WIP코드",
        "WIP명",
        "수량",
        "로트번호",
        "제조일",
        "유통기한",
        "작업자",
      ],
      zpl: "^XA^FO30,30^A0N,35,35^FD{{wipCode}}^FS^FO30,80^A0N,30,30^FD{{wipName}}^FS^FO30,130^A0N,25,25^FD{{quantity}}{{unit}}^FS^XZ",
      status: "active",
      lastModified: "2025-09-09",
    },
    {
      id: "LBL003",
      name: "완제품 포장 라벨",
      type: "finished_goods",
      size: "80x50mm",
      fields: [
        "제품코드",
        "제품명",
        "수량",
        "제조일",
        "유통기한",
        "영양성분",
        "제조사",
      ],
      zpl: "^XA^FO40,40^A0N,40,40^FD{{productCode}}^FS^FO40,90^A0N,35,35^FD{{productName}}^FS^FO40,140^A0N,30,30^FD제조: {{mfgDate}}^FS^FO40,180^A0N,30,30^FD유통: {{expDate}}^FS^XZ",
      status: "active",
      lastModified: "2025-09-11",
    },
  ]);

  const [printJobs, setPrintJobs] = useState([
    {
      id: "PJ001",
      templateId: "LBL001",
      templateName: "원재료 입고 라벨",
      quantity: 50,
      status: "completed",
      printedBy: "김검수",
      printTime: "2025-09-11 09:30",
      printer: "Zebra-P1-RM",
      data: { itemName: "닭고기 가슴살", lotNumber: "LOT20250911001" },
    },
    {
      id: "PJ002",
      templateId: "LBL002",
      templateName: "전처리 산출 라벨",
      quantity: 25,
      status: "printing",
      printedBy: "이전처리",
      printTime: "2025-09-11 14:15",
      printer: "Zebra-P1-WIP",
      data: { wipCode: "WIP001", wipName: "전처리 믹스 A" },
    },
    {
      id: "PJ003",
      templateId: "LBL003",
      templateName: "완제품 포장 라벨",
      quantity: 100,
      status: "pending",
      printedBy: "최포장",
      printTime: "2025-09-11 16:00",
      printer: "Zebra-P2-FG",
      data: { productCode: "FG001", productName: "애니몽 밀키트 A" },
    },
  ]);

  const [printers, setPrinters] = useState([
    {
      id: "Zebra-P1-RM",
      name: "1공장 원재료창고",
      location: "P1-RM",
      status: "online",
      model: "Zebra ZT410",
    },
    {
      id: "Zebra-P1-WIP",
      name: "1공장 전처리라인",
      location: "P1-WIP",
      status: "online",
      model: "Zebra ZT410",
    },
    {
      id: "Zebra-P2-FG",
      name: "2공장 포장라인",
      location: "P2-FG",
      status: "offline",
      model: "Zebra ZT610",
    },
    {
      id: "Zebra-P2-BOX",
      name: "2공장 박스포장",
      location: "P2-BOX",
      status: "online",
      model: "Zebra ZT230",
    },
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    type: "raw_material",
    size: "50x30mm",
    fields: ["품목코드", "품목명", "수량"],
    zpl: "^XA^FO50,50^A0N,30,30^FD품목: {{itemName}}^FS^XZ",
  });

  const statusColors: { [key: string]: string } = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    draft: "bg-yellow-100 text-yellow-800",
  };

  const jobStatusColors: { [key: string]: string } = {
    pending: "bg-blue-100 text-blue-800",
    printing: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  const printerStatusColors: { [key: string]: string } = {
    online: "bg-green-100 text-green-800",
    offline: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  const previewLabel = (template: any) => {
    const sampleData = {
      itemName: "샘플 품목명",
      lotNumber: "LOT20250911999",
      wipCode: "WIP999",
      wipName: "샘플 WIP",
      productCode: "FG999",
      productName: "샘플 완제품",
      quantity: "100",
      unit: "kg",
      mfgDate: "2025-09-11",
      expDate: "2025-10-11",
    };

    let previewText = template.zpl;
    Object.entries(sampleData).forEach(([key, value]) => {
      previewText = previewText.replace(new RegExp(`{{${key}}}`, "g"), value);
    });

    alert(
      `라벨 미리보기 (${template.name}):\n\n${previewText}\n\n실제 출력시에는 ZPL 명령어가 라벨로 변환됩니다.`
    );
  };

  const printLabel = (templateId: string, quantity: number, data: any) => {
    const jobId = `PJ${String(printJobs.length + 1).padStart(3, "0")}`;
    const template = templates.find((t) => t.id === templateId);

    const newJob = {
      id: jobId,
      templateId,
      templateName: template?.name || "",
      quantity,
      status: "printing" as const,
      printedBy: "현재사용자",
      printTime: new Date().toLocaleString("ko-KR"),
      printer: "Zebra-P1-RM",
      data,
    };

    setPrintJobs((prev) => [newJob, ...prev]);

    // 시뮬레이션: 3초 후 인쇄 완료
    setTimeout(() => {
      setPrintJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "completed" as const } : job
        )
      );
    }, 3000);

    alert(`라벨 프린트 시작됨!\n작업ID: ${jobId}\n수량: ${quantity}장`);
  };

  const reprintLabel = (jobId: string) => {
    // 관리자 승인 시뮬레이션
    const approved = confirm(
      "라벨 재발행 요청\n\n관리자 승인이 필요합니다.\n승인하시겠습니까?"
    );

    if (approved) {
      const originalJob = printJobs.find((job) => job.id === jobId);
      if (originalJob) {
        printLabel(
          originalJob.templateId,
          originalJob.quantity,
          originalJob.data
        );
      }
    }
  };

  const saveTemplate = () => {
    const templateId = `LBL${String(templates.length + 1).padStart(3, "0")}`;
    const template = {
      ...newTemplate,
      id: templateId,
      status: "active" as const,
      lastModified: new Date().toISOString().split("T")[0],
    };

    setTemplates((prev) => [...prev, template]);
    setNewTemplate({
      name: "",
      type: "raw_material",
      size: "50x30mm",
      fields: ["품목코드", "품목명", "수량"],
      zpl: "^XA^FO50,50^A0N,30,30^FD품목: {{itemName}}^FS^XZ",
    });

    alert(`템플릿 저장 완료: ${templateId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#724323] flex items-center gap-2">
            <Tags className="w-6 h-6" />
            라벨 프린트 관리
          </h1>
          <p className="text-[#333333] mt-1">
            ZPL 템플릿, 브라우저 출력, 라벨 재발행 승인
          </p>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">라벨 템플릿</TabsTrigger>
          <TabsTrigger value="printing">프린트 작업</TabsTrigger>
          <TabsTrigger value="printers">프린터 관리</TabsTrigger>
          <TabsTrigger value="quick-print">빠른 인쇄</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {/* Create New Template */}
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Edit className="w-5 h-5" />새 템플릿 생성
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>템플릿 이름</Label>
                    <Input
                      value={newTemplate.name}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="예: 원재료 입고 라벨"
                    />
                  </div>
                  <div>
                    <Label>라벨 타입</Label>
                    <Select
                      value={newTemplate.type}
                      onValueChange={(value: string) =>
                        setNewTemplate((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="raw_material">원재료</SelectItem>
                        <SelectItem value="wip">반제품 (WIP)</SelectItem>
                        <SelectItem value="finished_goods">완제품</SelectItem>
                        <SelectItem value="shipping">출고 라벨</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>라벨 크기</Label>
                    <Select
                      value={newTemplate.size}
                      onValueChange={(value: string) =>
                        setNewTemplate((prev) => ({ ...prev, size: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50x30mm">50x30mm</SelectItem>
                        <SelectItem value="60x40mm">60x40mm</SelectItem>
                        <SelectItem value="80x50mm">80x50mm</SelectItem>
                        <SelectItem value="100x60mm">100x60mm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>ZPL 코드</Label>
                    <Textarea
                      value={newTemplate.zpl}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          zpl: e.target.value,
                        }))
                      }
                      placeholder="^XA^FO50,50^A0N,30,30^FD품목: {{itemName}}^FS^XZ"
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-[#333333] mt-1">
                      변수:{" "}
                      {
                        "{{itemName}}, {{lotNumber}}, {{quantity}}, {{mfgDate}}, {{expDate}}"
                      }
                    </p>
                  </div>
                  <Button
                    onClick={saveTemplate}
                    className="w-full bg-[#724323] hover:bg-[#5a3419] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    템플릿 저장
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Templates List */}
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Tags className="w-5 h-5" />
                라벨 템플릿 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>템플릿ID</TableHead>
                    <TableHead>템플릿명</TableHead>
                    <TableHead>타입</TableHead>
                    <TableHead>크기</TableHead>
                    <TableHead>필드</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>수정일</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        {template.id}
                      </TableCell>
                      <TableCell>{template.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {template.type === "raw_material"
                            ? "원재료"
                            : template.type === "wip"
                            ? "WIP"
                            : template.type === "finished_goods"
                            ? "완제품"
                            : "출고"}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.size}</TableCell>
                      <TableCell>
                        <div className="text-xs text-[#333333]">
                          {template.fields.slice(0, 3).join(", ")}
                          {template.fields.length > 3 && "..."}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[template.status]}>
                          {template.status === "active"
                            ? "활성"
                            : template.status === "inactive"
                            ? "비활성"
                            : "초안"}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.lastModified}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => previewLabel(template)}
                            className="p-1 h-auto"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-1 h-auto"
                          >
                            <Edit className="w-4 h-4" />
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

        <TabsContent value="printing" className="space-y-4">
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Printer className="w-5 h-5" />
                프린트 작업 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>작업ID</TableHead>
                    <TableHead>템플릿</TableHead>
                    <TableHead>수량</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>프린터</TableHead>
                    <TableHead>작업자</TableHead>
                    <TableHead>시간</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {printJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.id}</TableCell>
                      <TableCell>{job.templateName}</TableCell>
                      <TableCell>{job.quantity}장</TableCell>
                      <TableCell>
                        <Badge className={jobStatusColors[job.status]}>
                          {job.status === "pending"
                            ? "대기"
                            : job.status === "printing"
                            ? "인쇄중"
                            : job.status === "completed"
                            ? "완료"
                            : "실패"}
                        </Badge>
                      </TableCell>
                      <TableCell>{job.printer}</TableCell>
                      <TableCell>{job.printedBy}</TableCell>
                      <TableCell>{job.printTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => reprintLabel(job.id)}
                            className="p-1 h-auto text-orange-600 hover:text-orange-700"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-1 h-auto"
                          >
                            <Eye className="w-4 h-4" />
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

        <TabsContent value="printers" className="space-y-4">
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Settings className="w-5 h-5" />
                프린터 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {printers.map((printer) => (
                  <div
                    key={printer.id}
                    className="border border-[#F5E9D5] rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-[#724323]">
                        {printer.name}
                      </h4>
                      <Badge className={printerStatusColors[printer.status]}>
                        {printer.status === "online"
                          ? "온라인"
                          : printer.status === "offline"
                          ? "오프라인"
                          : "경고"}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-[#333333]">
                      <div className="flex justify-between">
                        <span>프린터 ID:</span>
                        <span className="font-medium">{printer.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>모델:</span>
                        <span className="font-medium">{printer.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>위치:</span>
                        <span className="font-medium">{printer.location}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-[#724323] text-[#724323] hover:bg-[#F5E9D5]"
                      >
                        테스트 인쇄
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        설정
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-print" className="space-y-4">
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Printer className="w-5 h-5" />
                빠른 라벨 인쇄
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>라벨 템플릿</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="템플릿 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>프린터</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="프린터 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {printers
                          .filter((p) => p.status === "online")
                          .map((printer) => (
                            <SelectItem key={printer.id} value={printer.id}>
                              {printer.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>인쇄 수량</Label>
                    <Input type="number" defaultValue={1} min={1} max={1000} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>품목명</Label>
                    <Input placeholder="품목명 입력" />
                  </div>
                  <div>
                    <Label>로트번호</Label>
                    <Input placeholder="로트번호 입력" />
                  </div>
                  <div>
                    <Label>수량</Label>
                    <Input placeholder="수량 입력" />
                  </div>
                  <Button
                    onClick={() =>
                      printLabel("LBL001", 1, {
                        itemName: "테스트 품목",
                        lotNumber: "TEST001",
                      })
                    }
                    className="w-full bg-[#724323] hover:bg-[#5a3419] text-white"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    라벨 인쇄
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Print History */}
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                최근 인쇄 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {printJobs.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 bg-[#F5E9D5] rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-[#724323]">
                        {job.templateName}
                      </p>
                      <p className="text-sm text-[#333333]">
                        {job.quantity}장 • {job.printTime}
                      </p>
                    </div>
                    <Badge className={jobStatusColors[job.status]}>
                      {job.status === "completed" ? "완료" : "진행중"}
                    </Badge>
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
