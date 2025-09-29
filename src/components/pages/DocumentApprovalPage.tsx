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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CheckCircle, Clock, XCircle, FileText, Plus, Eye, Download, MessageSquare, User, ArrowRight } from 'lucide-react';

interface ApprovalDocument {
  id: string;
  documentNumber: string;
  title: string;
  type: 'production_report' | 'defect_report' | 'safety_check' | 'quality_report';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: string;
  approvers: ApprovalStep[];
  currentStep: number;
  content: string;
  attachments?: string[];
}

interface ApprovalStep {
  level: number;
  role: string;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  comments?: string;
}

export function DocumentApprovalPage() {
  const [documents, setDocuments] = useState<ApprovalDocument[]>([
    {
      id: '1',
      documentNumber: 'DOC-2024-0001',
      title: '1월 1주차 생산 완료 보고서',
      type: 'production_report',
      status: 'pending',
      submittedBy: '김생산',
      submittedAt: '2024-01-15',
      currentStep: 1,
      content: '1월 1주차 생산 결과를 보고드립니다...',
      approvers: [
        { level: 1, role: '팀장', approver: '이팀장', status: 'approved', approvedAt: '2024-01-15', comments: '확인완료' },
        { level: 2, role: '공장장', approver: '박공장장', status: 'pending' },
        { level: 3, role: '대표', approver: '최대표', status: 'pending' }
      ]
    },
    {
      id: '2',
      documentNumber: 'DOC-2024-0002',
      title: '제품 불량 발생 보고서',
      type: 'defect_report',
      status: 'rejected',
      submittedBy: '이품질',
      submittedAt: '2024-01-14',
      currentStep: 1,
      content: '닭고기 간식 제품에서 이물질 발견...',
      approvers: [
        { level: 1, role: '팀장', approver: '이팀장', status: 'rejected', approvedAt: '2024-01-14', comments: '상세 분석 내용 추가 필요' },
        { level: 2, role: '공장장', approver: '박공장장', status: 'pending' },
        { level: 3, role: '대표', approver: '최대표', status: 'pending' }
      ]
    },
    {
      id: '3',
      documentNumber: 'DOC-2024-0003',
      title: '안전점검표 (1월 2주차)',
      type: 'safety_check',
      status: 'approved',
      submittedBy: '안전관리자',
      submittedAt: '2024-01-12',
      currentStep: 3,
      content: '1월 2주차 안전점검 결과...',
      approvers: [
        { level: 1, role: '팀장', approver: '이팀장', status: 'approved', approvedAt: '2024-01-12', comments: '이상없음' },
        { level: 2, role: '공장장', approver: '박공장장', status: 'approved', approvedAt: '2024-01-13', comments: '승인' },
        { level: 3, role: '대표', approver: '최대표', status: 'approved', approvedAt: '2024-01-14', comments: '최종승인' }
      ]
    }
  ]);

  const [isNewDocDialogOpen, setIsNewDocDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ApprovalDocument | null>(null);
  const [newDocument, setNewDocument] = useState({
    title: '',
    type: 'production_report' as ApprovalDocument['type'],
    content: ''
  });

  const getDocumentTypeLabel = (type: ApprovalDocument['type']) => {
    const typeMap = {
      production_report: '생산 완료 보고서',
      defect_report: '불량 보고서',
      safety_check: '안전점검표',
      quality_report: '품질검사 보고서'
    };
    return typeMap[type];
  };

  const getStatusIcon = (status: ApprovalDocument['status']) => {
    switch (status) {
      case 'draft':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-[#F9B679]" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-[#A3C478]" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ApprovalDocument['status']) => {
    const statusMap = {
      draft: { label: '임시저장', class: 'bg-gray-500 text-white' },
      pending: { label: '결재중', class: 'bg-[#F9B679] text-white' },
      approved: { label: '승인완료', class: 'bg-[#A3C478] text-white' },
      rejected: { label: '반려', class: 'bg-red-500 text-white' }
    };
    
    const statusInfo = statusMap[status];
    return (
      <Badge className={statusInfo.class}>
        {getStatusIcon(status)}
        <span className="ml-1">{statusInfo.label}</span>
      </Badge>
    );
  };

  const handleCreateDocument = () => {
    if (newDocument.title && newDocument.content) {
      const document: ApprovalDocument = {
        id: Date.now().toString(),
        documentNumber: `DOC-2024-${String(documents.length + 1).padStart(4, '0')}`,
        title: newDocument.title,
        type: newDocument.type,
        status: 'pending',
        submittedBy: '현재사용자',
        submittedAt: new Date().toISOString().split('T')[0],
        currentStep: 0,
        content: newDocument.content,
        approvers: [
          { level: 1, role: '팀장', approver: '이팀장', status: 'pending' },
          { level: 2, role: '공장장', approver: '박공장장', status: 'pending' },
          { level: 3, role: '대표', approver: '최대표', status: 'pending' }
        ]
      };
      
      setDocuments([...documents, document]);
      setNewDocument({ title: '', type: 'production_report', content: '' });
      setIsNewDocDialogOpen(false);
    }
  };

  const handleApprove = (docId: string, stepLevel: number, comments: string) => {
    setDocuments(docs => docs.map(doc => {
      if (doc.id === docId) {
        const updatedApprovers = doc.approvers.map(approver => {
          if (approver.level === stepLevel) {
            return {
              ...approver,
              status: 'approved' as const,
              approvedAt: new Date().toISOString().split('T')[0],
              comments
            };
          }
          return approver;
        });

        const nextStep = stepLevel + 1;
        const isLastStep = nextStep > doc.approvers.length;
        
        return {
          ...doc,
          approvers: updatedApprovers,
          currentStep: isLastStep ? doc.approvers.length : nextStep,
          status: isLastStep ? 'approved' as const : 'pending' as const
        };
      }
      return doc;
    }));
  };

  const handleReject = (docId: string, stepLevel: number, comments: string) => {
    setDocuments(docs => docs.map(doc => {
      if (doc.id === docId) {
        const updatedApprovers = doc.approvers.map(approver => {
          if (approver.level === stepLevel) {
            return {
              ...approver,
              status: 'rejected' as const,
              approvedAt: new Date().toISOString().split('T')[0],
              comments
            };
          }
          return approver;
        });

        return {
          ...doc,
          approvers: updatedApprovers,
          status: 'rejected' as const
        };
      }
      return doc;
    }));
  };

  const getDocumentStats = () => {
    return {
      total: documents.length,
      pending: documents.filter(d => d.status === 'pending').length,
      approved: documents.filter(d => d.status === 'approved').length,
      rejected: documents.filter(d => d.status === 'rejected').length,
    };
  };

  const stats = getDocumentStats();
  const myPendingApprovals = documents.filter(doc => 
    doc.status === 'pending' && 
    doc.approvers[doc.currentStep]?.approver === '이팀장' // 현재 사용자
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#724323] mb-2">전자결재 시스템</h1>
          <p className="text-[#333333]">문서 결재 요청 및 승인 처리를 관리합니다</p>
        </div>
        <Dialog open={isNewDocDialogOpen} onOpenChange={setIsNewDocDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#724323] hover:bg-[#5a341c] text-white">
              <Plus className="w-4 h-4 mr-2" />
              새 문서 작성
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#724323]">새 결재 문서</DialogTitle>
              <DialogDescription>
                새로운 결재 문서를 작성합니다
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="doc-title">문서 제목</Label>
                <Input
                  id="doc-title"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                  placeholder="문서 제목을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-type">문서 유형</Label>
                <Select value={newDocument.type} onValueChange={(value: any) => setNewDocument({...newDocument, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production_report">생산 완료 보고서</SelectItem>
                    <SelectItem value="defect_report">불량 보고서</SelectItem>
                    <SelectItem value="safety_check">안전점검표</SelectItem>
                    <SelectItem value="quality_report">품질검사 보고서</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-content">문서 내용</Label>
                <Textarea
                  id="doc-content"
                  value={newDocument.content}
                  onChange={(e) => setNewDocument({...newDocument, content: e.target.value})}
                  placeholder="문서 내용을 입력하세요"
                  rows={8}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewDocDialogOpen(false)}>
                취소
              </Button>
              <Button 
                onClick={handleCreateDocument}
                className="bg-[#724323] hover:bg-[#5a341c] text-white"
              >
                결재 요청
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
                <p className="text-sm text-[#666]">전체 문서</p>
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
                <p className="text-sm text-[#666]">결재 대기</p>
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
                <p className="text-sm text-[#666]">승인 완료</p>
                <p className="text-2xl text-[#A3C478]">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-[#A3C478]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">반려</p>
                <p className="text-2xl text-red-500">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">전체 문서</TabsTrigger>
          <TabsTrigger value="pending">내 결재 대기</TabsTrigger>
          <TabsTrigger value="submitted">내가 제출한 문서</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="border-[#F5E9D5]">
            <CardHeader className="bg-[#F5E9D5] rounded-t-lg">
              <CardTitle className="text-[#724323]">전체 결재 문서</CardTitle>
              <CardDescription>
                시스템에 등록된 모든 결재 문서 목록입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#FAF6F2]">
                    <TableHead>문서번호</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작성자</TableHead>
                    <TableHead>작성일</TableHead>
                    <TableHead>진행단계</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-[#FAF6F2]">
                      <TableCell className="font-medium text-[#724323]">
                        {doc.documentNumber}
                      </TableCell>
                      <TableCell>{doc.title}</TableCell>
                      <TableCell>{getDocumentTypeLabel(doc.type)}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>{doc.submittedBy}</TableCell>
                      <TableCell>{doc.submittedAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {doc.approvers.map((approver, index) => (
                            <div key={index} className="flex items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                approver.status === 'approved' ? 'bg-[#A3C478] text-white' :
                                approver.status === 'rejected' ? 'bg-red-500 text-white' :
                                index === doc.currentStep ? 'bg-[#F9B679] text-white' :
                                'bg-gray-200 text-gray-500'
                              }`}>
                                {index + 1}
                              </div>
                              {index < doc.approvers.length - 1 && (
                                <ArrowRight className="w-3 h-3 mx-1 text-gray-400" />
                              )}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedDoc(doc)}
                            className="border-[#F5E9D5]"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          {doc.status === 'approved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#A3C478] text-[#A3C478]"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card className="border-[#F5E9D5]">
            <CardHeader className="bg-[#F5E9D5] rounded-t-lg">
              <CardTitle className="text-[#724323]">내 결재 대기 문서</CardTitle>
              <CardDescription>
                내가 결재해야 할 문서 목록입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {myPendingApprovals.length === 0 ? (
                <div className="text-center py-8 text-[#666]">
                  결재 대기 중인 문서가 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {myPendingApprovals.map((doc) => (
                    <Card key={doc.id} className="border-[#F9B679]">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-[#724323]">{doc.title}</h4>
                            <p className="text-sm text-[#666]">{getDocumentTypeLabel(doc.type)} • {doc.submittedBy}</p>
                          </div>
                          <Badge className="bg-[#F9B679] text-white">결재 대기</Badge>
                        </div>
                        <p className="text-sm text-[#333] mb-4 line-clamp-2">{doc.content}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(doc.id, doc.currentStep + 1, '승인합니다')}
                            className="bg-[#A3C478] hover:bg-[#8fb968] text-white"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(doc.id, doc.currentStep + 1, '추가 검토 필요')}
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            반려
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedDoc(doc)}
                            className="border-[#F5E9D5]"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            상세보기
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          <Card className="border-[#F5E9D5]">
            <CardHeader className="bg-[#F5E9D5] rounded-t-lg">
              <CardTitle className="text-[#724323]">내가 제출한 문서</CardTitle>
              <CardDescription>
                내가 작성하여 결재 요청한 문서 목록입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8 text-[#666]">
                아직 제출한 문서가 없습니다.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Detail Dialog */}
      {selectedDoc && (
        <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#724323]">{selectedDoc.title}</DialogTitle>
              <DialogDescription>
                {getDocumentTypeLabel(selectedDoc.type)} • {selectedDoc.documentNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-[#666]">작성자</Label>
                  <p>{selectedDoc.submittedBy}</p>
                </div>
                <div>
                  <Label className="text-sm text-[#666]">작성일</Label>
                  <p>{selectedDoc.submittedAt}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-[#666]">문서 내용</Label>
                <div className="mt-2 p-4 bg-[#FAF6F2] rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedDoc.content}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-[#666]">결재 진행 상황</Label>
                <div className="mt-2 space-y-3">
                  {selectedDoc.approvers.map((approver, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-[#FAF6F2] rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        approver.status === 'approved' ? 'bg-[#A3C478]' :
                        approver.status === 'rejected' ? 'bg-red-500' :
                        'bg-[#F9B679]'
                      } text-white`}>
                        {approver.status === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                         approver.status === 'rejected' ? <XCircle className="w-4 h-4" /> :
                         <User className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{approver.role}</span>
                          <span className="text-[#666]">{approver.approver}</span>
                          {approver.status === 'approved' && (
                            <Badge className="bg-[#A3C478] text-white">승인</Badge>
                          )}
                          {approver.status === 'rejected' && (
                            <Badge className="bg-red-500 text-white">반려</Badge>
                          )}
                          {approver.status === 'pending' && (
                            <Badge className="bg-[#F9B679] text-white">대기중</Badge>
                          )}
                        </div>
                        {approver.comments && (
                          <div className="mt-1 flex items-center gap-1 text-sm text-[#666]">
                            <MessageSquare className="w-3 h-3" />
                            {approver.comments}
                          </div>
                        )}
                        {approver.approvedAt && (
                          <p className="text-xs text-[#666] mt-1">{approver.approvedAt}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}