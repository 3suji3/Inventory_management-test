import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { FolderOpen, FileText, Upload, Download, Eye, Search, Calendar, User, Filter, Trash2, Plus } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'phase_management' | 'production_report' | 'defect_record' | 'safety_checklist' | 'quality_report' | 'template';
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  format: 'PDF' | 'DOCX' | 'XLSX' | 'JPG' | 'PNG';
  status: 'active' | 'archived';
  tags: string[];
  description?: string;
}

export function DocumentRepositoryPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: '2024년 1월 위상관리 일지',
      type: 'phase_management',
      category: '위상관리일지',
      uploadedBy: '김관리자',
      uploadedAt: '2024-01-15',
      size: '2.3 MB',
      format: 'PDF',
      status: 'active',
      tags: ['위상관리', '1월', '2024'],
      description: '2024년 1월 위상관리 현황 및 개선사항'
    },
    {
      id: '2',
      name: '생산 완료 보고서 템플릿',
      type: 'template',
      category: '템플릿',
      uploadedBy: '시스템관리자',
      uploadedAt: '2024-01-01',
      size: '156 KB',
      format: 'DOCX',
      status: 'active',
      tags: ['템플릿', '생산보고서'],
      description: '표준 생산 완료 보고서 양식'
    },
    {
      id: '3',
      name: '1월 1주차 불량품 발생 기록',
      type: 'defect_record',
      category: '불량품기록',
      uploadedBy: '이품질',
      uploadedAt: '2024-01-08',
      size: '1.8 MB',
      format: 'PDF',
      status: 'active',
      tags: ['불량품', '1월', '품질관리'],
      description: '닭고기 간식 제품 불량 발생 원인 분석 및 대응방안'
    },
    {
      id: '4',
      name: '안전점검표_2024_01_15',
      type: 'safety_checklist',
      category: '안전점검표',
      uploadedBy: '안전관리자',
      uploadedAt: '2024-01-15',
      size: '892 KB',
      format: 'XLSX',
      status: 'active',
      tags: ['안전점검', '1월', '설비'],
      description: '1월 3주차 안전점검 결과'
    },
    {
      id: '5',
      name: '품질검사 결과 보고서',
      type: 'quality_report',
      category: '품질보고서',
      uploadedBy: '박품질',
      uploadedAt: '2024-01-12',
      size: '3.2 MB',
      format: 'PDF',
      status: 'active',
      tags: ['품질검사', '미생물', '성분분석'],
      description: '월간 품질검사 종합 결과 보고서'
    },
    {
      id: '6',
      name: '2023년 12월 생산실적 보고',
      type: 'production_report',
      category: '생산보고서',
      uploadedBy: '김생산',
      uploadedAt: '2024-01-02',
      size: '1.5 MB',
      format: 'PDF',
      status: 'archived',
      tags: ['생산실적', '12월', '2023'],
      description: '2023년 12월 생산실적 종합 보고'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'production_report' as Document['type'],
    description: '',
    tags: ''
  });

  const categories = [
    { value: 'all', label: '전체 문서' },
    { value: '위상관리일지', label: '위상관리일지' },
    { value: '생산보고서', label: '생산보고서' },
    { value: '불량품기록', label: '불량품기록' },
    { value: '안전점검표', label: '안전점검표' },
    { value: '품질보고서', label: '품질보고서' },
    { value: '템플릿', label: '템플릿' }
  ];

  const documentTypes = [
    { value: 'phase_management', label: '위상관리 일지' },
    { value: 'production_report', label: '생산 보고서' },
    { value: 'defect_record', label: '불량품 기록' },
    { value: 'safety_checklist', label: '안전점검표' },
    { value: 'quality_report', label: '품질 보고서' },
    { value: 'template', label: '템플릿' }
  ];

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'phase_management':
        return <Calendar className="w-4 h-4 text-[#724323]" />;
      case 'production_report':
        return <FileText className="w-4 h-4 text-[#A3C478]" />;
      case 'defect_record':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'safety_checklist':
        return <FileText className="w-4 h-4 text-[#F9B679]" />;
      case 'quality_report':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'template':
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getFormatBadge = (format: Document['format']) => {
    const formatColors = {
      PDF: 'bg-red-500 text-white',
      DOCX: 'bg-blue-500 text-white',
      XLSX: 'bg-green-500 text-white',
      JPG: 'bg-purple-500 text-white',
      PNG: 'bg-purple-500 text-white'
    };
    
    return <Badge className={formatColors[format]}>{format}</Badge>;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesFormat = selectedFormat === 'all' || doc.format === selectedFormat;
    
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const activeDocuments = filteredDocuments.filter(doc => doc.status === 'active');
  const archivedDocuments = filteredDocuments.filter(doc => doc.status === 'archived');

  const handleUploadDocument = () => {
    if (newDocument.name && newDocument.type) {
      const document: Document = {
        id: Date.now().toString(),
        name: newDocument.name,
        type: newDocument.type,
        category: documentTypes.find(t => t.value === newDocument.type)?.label || '',
        uploadedBy: '현재사용자',
        uploadedAt: new Date().toISOString().split('T')[0],
        size: '1.2 MB', // Mock size
        format: 'PDF', // Mock format
        status: 'active',
        tags: newDocument.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        description: newDocument.description
      };
      
      setDocuments([...documents, document]);
      setNewDocument({ name: '', type: 'production_report', description: '', tags: '' });
      setIsUploadDialogOpen(false);
    }
  };

  const handleArchiveDocument = (docId: string) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === docId ? { ...doc, status: 'archived' as const } : doc
      )
    );
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(docs => docs.filter(doc => doc.id !== docId));
  };

  const getDocumentStats = () => {
    return {
      total: documents.length,
      active: documents.filter(d => d.status === 'active').length,
      archived: documents.filter(d => d.status === 'archived').length,
      byCategory: categories.slice(1).map(cat => ({
        name: cat.label,
        count: documents.filter(d => d.category === cat.label).length
      }))
    };
  };

  const stats = getDocumentStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#724323] mb-2">문서 보관함</h1>
          <p className="text-[#333333]">위상관리 일지 및 각종 문서를 체계적으로 관리합니다</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#724323] hover:bg-[#5a341c] text-white">
              <Upload className="w-4 h-4 mr-2" />
              문서 업로드
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-[#724323]">새 문서 업로드</DialogTitle>
              <DialogDescription>
                새로운 문서를 업로드합니다
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="doc-name">문서명</Label>
                <Input
                  id="doc-name"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                  placeholder="문서명을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-type">문서 유형</Label>
                <Select value={newDocument.type} onValueChange={(value: any) => setNewDocument({...newDocument, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-description">설명</Label>
                <Input
                  id="doc-description"
                  value={newDocument.description}
                  onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                  placeholder="문서에 대한 간단한 설명"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-tags">태그</Label>
                <Input
                  id="doc-tags"
                  value={newDocument.tags}
                  onChange={(e) => setNewDocument({...newDocument, tags: e.target.value})}
                  placeholder="태그1, 태그2, 태그3 (쉼표로 구분)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">파일 선택</Label>
                <div className="border-2 border-dashed border-[#F5E9D5] rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-[#724323] mx-auto mb-2" />
                  <p className="text-sm text-[#666]">파일을 여기에 드래그하거나 클릭하여 선택하세요</p>
                  <Button variant="outline" className="mt-2" size="sm">
                    파일 선택
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                취소
              </Button>
              <Button 
                onClick={handleUploadDocument}
                className="bg-[#724323] hover:bg-[#5a341c] text-white"
              >
                업로드
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
              <FolderOpen className="w-8 h-8 text-[#724323]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">활성 문서</p>
                <p className="text-2xl text-[#A3C478]">{stats.active}</p>
              </div>
              <FileText className="w-8 h-8 text-[#A3C478]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">보관 문서</p>
                <p className="text-2xl text-[#F9B679]">{stats.archived}</p>
              </div>
              <FileText className="w-8 h-8 text-[#F9B679]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#F5E9D5]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">템플릿</p>
                <p className="text-2xl text-gray-500">
                  {documents.filter(d => d.type === 'template').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Overview */}
      <Card className="border-[#F5E9D5]">
        <CardHeader className="bg-[#F5E9D5] rounded-t-lg">
          <CardTitle className="text-[#724323]">카테고리별 문서 현황</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.byCategory.map((category) => (
              <div key={category.name} className="text-center p-4 bg-[#FAF6F2] rounded-lg">
                <FolderOpen className="w-8 h-8 text-[#724323] mx-auto mb-2" />
                <p className="text-sm text-[#666] mb-1">{category.name}</p>
                <p className="text-xl text-[#724323]">{category.count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="border-[#F5E9D5]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666] w-4 h-4" />
                <Input
                  placeholder="문서명, 설명, 태그로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="형식" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 형식</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="DOCX">DOCX</SelectItem>
                  <SelectItem value="XLSX">XLSX</SelectItem>
                  <SelectItem value="JPG">JPG</SelectItem>
                  <SelectItem value="PNG">PNG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">활성 문서 ({activeDocuments.length})</TabsTrigger>
          <TabsTrigger value="archived">보관 문서 ({archivedDocuments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card className="border-[#F5E9D5]">
            <CardHeader className="bg-[#F5E9D5] rounded-t-lg">
              <CardTitle className="text-[#724323]">활성 문서 목록</CardTitle>
              <CardDescription>
                현재 사용 중인 문서들입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#FAF6F2]">
                    <TableHead>문서명</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>형식</TableHead>
                    <TableHead>크기</TableHead>
                    <TableHead>업로드자</TableHead>
                    <TableHead>업로드일</TableHead>
                    <TableHead>태그</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-[#FAF6F2]">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(doc.type)}
                          <div>
                            <p className="font-medium text-[#724323]">{doc.name}</p>
                            {doc.description && (
                              <p className="text-xs text-[#666]">{doc.description}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{doc.category}</TableCell>
                      <TableCell>{getFormatBadge(doc.format)}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#666]" />
                          {doc.uploadedBy}
                        </div>
                      </TableCell>
                      <TableCell>{doc.uploadedAt}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {doc.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{doc.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedDocument(doc)}
                            className="border-[#F5E9D5]"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#A3C478] text-[#A3C478]"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleArchiveDocument(doc.id)}
                            className="border-[#F9B679] text-[#F9B679]"
                          >
                            보관
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

        <TabsContent value="archived">
          <Card className="border-[#F5E9D5]">
            <CardHeader className="bg-[#F5E9D5] rounded-t-lg">
              <CardTitle className="text-[#724323]">보관 문서 목록</CardTitle>
              <CardDescription>
                보관된 문서들입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#FAF6F2]">
                    <TableHead>문서명</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>형식</TableHead>
                    <TableHead>크기</TableHead>
                    <TableHead>업로드자</TableHead>
                    <TableHead>업로드일</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {archivedDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-[#FAF6F2] opacity-75">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(doc.type)}
                          <div>
                            <p className="font-medium text-[#724323]">{doc.name}</p>
                            {doc.description && (
                              <p className="text-xs text-[#666]">{doc.description}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{doc.category}</TableCell>
                      <TableCell>{getFormatBadge(doc.format)}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#666]" />
                          {doc.uploadedBy}
                        </div>
                      </TableCell>
                      <TableCell>{doc.uploadedAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#A3C478] text-[#A3C478]"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
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
      </Tabs>

      {/* Document Detail Dialog */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#724323] flex items-center gap-2">
                {getTypeIcon(selectedDocument.type)}
                {selectedDocument.name}
              </DialogTitle>
              <DialogDescription>
                {selectedDocument.category} • {selectedDocument.format} • {selectedDocument.size}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-[#666]">업로드자</Label>
                  <p>{selectedDocument.uploadedBy}</p>
                </div>
                <div>
                  <Label className="text-sm text-[#666]">업로드일</Label>
                  <p>{selectedDocument.uploadedAt}</p>
                </div>
              </div>
              {selectedDocument.description && (
                <div>
                  <Label className="text-sm text-[#666]">설명</Label>
                  <p className="mt-1">{selectedDocument.description}</p>
                </div>
              )}
              <div>
                <Label className="text-sm text-[#666]">태그</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedDocument.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                닫기
              </Button>
              <Button className="bg-[#724323] hover:bg-[#5a341c] text-white">
                <Download className="w-4 h-4 mr-2" />
                다운로드
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}