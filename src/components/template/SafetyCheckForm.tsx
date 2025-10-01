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

interface SafetyCheckFormProps {
  newDocument: {
    productName?: string;
    productionQuantity?: string;
    productionDate?: string;
    notes?: string;
    type?: string;
  };
  setNewDocument: React.Dispatch<React.SetStateAction<any>>;
  handleCreateDocument: () => void;
  setIsNewDocDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SafetyCheckForm({
  newDocument,
  setNewDocument,
  handleCreateDocument,
  setIsNewDocDialogOpen,
}: SafetyCheckFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="productName">제품명</Label>
        <Input
          id="productName"
          value={newDocument.productName || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewDocument({ ...newDocument, productName: e.target.value })
          }
          placeholder="제품명을 입력하세요"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="productionQuantity">생산 수량</Label>
        <Input
          id="productionQuantity"
          type="number"
          value={newDocument.productionQuantity || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewDocument({
              ...newDocument,
              productionQuantity: e.target.value,
            })
          }
          placeholder="생산 수량을 입력하세요"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="productionDate">생산 일자</Label>
        <Input
          id="productionDate"
          type="date"
          value={newDocument.productionDate || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewDocument({ ...newDocument, productionDate: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">특이사항</Label>
        <Textarea
          id="notes"
          value={newDocument.notes || ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setNewDocument({ ...newDocument, notes: e.target.value })
          }
          placeholder="특이사항을 입력하세요"
          rows={4}
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
