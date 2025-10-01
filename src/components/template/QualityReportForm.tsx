import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface QualityReportFormProps {
  newDocument: {
    inspectionDate?: string;
    inspectionResult?: string;
    title?: string;
    type?: string;
  };
  setNewDocument: React.Dispatch<React.SetStateAction<any>>;
  handleCreateDocument: () => void;
  setIsNewDocDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function QualityReportForm({
  newDocument,
  setNewDocument,
  handleCreateDocument,
  setIsNewDocDialogOpen,
}: QualityReportFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="inspectionDate">검사 일자</Label>
        <Input
          id="inspectionDate"
          type="date"
          value={newDocument.inspectionDate || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewDocument({ ...newDocument, inspectionDate: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="inspectionResult">검사 결과</Label>
        <Textarea
          id="inspectionResult"
          value={newDocument.inspectionResult || ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setNewDocument({ ...newDocument, inspectionResult: e.target.value })
          }
          placeholder="검사 결과를 입력하세요"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">문서 제목</Label>
        <Input
          id="title"
          value={newDocument.title || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewDocument({ ...newDocument, title: e.target.value })
          }
          placeholder="문서 제목을 입력하세요"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setNewDocument((prev: any) => ({ ...prev, type: "" }));
            setIsNewDocDialogOpen(false);
          }}
        >
          취소
        </Button>
        <Button
          onClick={handleCreateDocument}
          className="bg-[#724323] hover:bg-[#5a341c] text-white"
        >
          결재 요청
        </Button>
      </div>
    </>
  );
}
