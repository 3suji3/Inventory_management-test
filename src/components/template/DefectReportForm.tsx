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

interface DefectReportFormProps {
  newDocument: {
    title?: string;
    defectContent?: string;
    defectDate?: string;
    type?: string;
  };
  setNewDocument: React.Dispatch<React.SetStateAction<any>>;
  handleCreateDocument: () => void;
  setIsNewDocDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DefectReportForm({
  newDocument,
  setNewDocument,
  handleCreateDocument,
  setIsNewDocDialogOpen,
}: DefectReportFormProps) {
  return (
    <>
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
      <div className="space-y-2">
        <Label htmlFor="defectContent">불량 내용</Label>
        <Textarea
          id="defectContent"
          value={newDocument.defectContent || ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setNewDocument({ ...newDocument, defectContent: e.target.value })
          }
          placeholder="불량 내용을 입력하세요"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="defectDate">발생 일자</Label>
        <Input
          id="defectDate"
          type="date"
          value={newDocument.defectDate || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewDocument({ ...newDocument, defectDate: e.target.value })
          }
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
