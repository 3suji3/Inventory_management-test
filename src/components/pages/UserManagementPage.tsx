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
import { Switch } from "../ui/switch";
import {
  Users,
  UserPlus,
  Shield,
  Settings,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export function UserManagementPage() {
  const [users, setUsers] = useState([
    {
      id: "USR001",
      username: "관리자",
      email: "admin@aniecong.com",
      role: "Admin",
      department: "관리부",
      plant: "ALL",
      status: "active",
      lastLogin: "2025-09-11 14:30",
      permissions: ["all"],
    },
    {
      id: "USR002",
      username: "김검수",
      email: "kim.inspector@aniecong.com",
      role: "QC",
      department: "품질관리",
      plant: "P1",
      status: "active",
      lastLogin: "2025-09-11 09:15",
      permissions: ["receiving", "quality_check"],
    },
    {
      id: "USR003",
      username: "이전처리",
      email: "lee.processor@aniecong.com",
      role: "Operator",
      department: "전처리",
      plant: "P1",
      status: "active",
      lastLogin: "2025-09-11 08:45",
      permissions: ["plant1_processing", "basic_info"],
    },
    {
      id: "USR004",
      username: "최제조",
      email: "choi.manufacturer@aniecong.com",
      role: "Operator",
      department: "제조",
      plant: "P2",
      status: "active",
      lastLogin: "2025-09-11 13:20",
      permissions: ["plant2_manufacturing", "inter_plant_transfer"],
    },
    {
      id: "USR005",
      username: "박품질",
      email: "park.quality@aniecong.com",
      role: "QC",
      department: "품질관리",
      plant: "P2",
      status: "inactive",
      lastLogin: "2025-09-09 16:00",
      permissions: ["quality_check", "label_management"],
    },
  ]);

  const [roles, setRoles] = useState([
    {
      id: "Admin",
      name: "관리자",
      description: "시스템 전체 관리 권한",
      permissions: ["all"],
      userCount: 1,
    },
    {
      id: "Planner",
      name: "계획자",
      description: "생산계획 및 일정관리",
      permissions: ["basic_info", "manufacturing_planning", "inventory_view"],
      userCount: 0,
    },
    {
      id: "Operator",
      name: "작업자",
      description: "공정 작업 및 스캔",
      permissions: [
        "plant1_processing",
        "plant2_manufacturing",
        "inter_plant_transfer",
      ],
      userCount: 2,
    },
    {
      id: "QC",
      name: "품질관리",
      description: "품질검사 및 검수",
      permissions: ["receiving", "quality_check", "label_management"],
      userCount: 2,
    },
    {
      id: "Shipper",
      name: "출고담당",
      description: "출고 및 배송관리",
      permissions: ["shipping", "inventory_view"],
      userCount: 0,
    },
  ]);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "",
    department: "",
    plant: "",
    password: "",
  });

  const [permissions] = useState([
    { id: "basic_info", name: "기초정보 관리", module: "기초정보" },
    { id: "receiving", name: "입고/검수", module: "입고관리" },
    { id: "plant1_processing", name: "1공장 전처리", module: "제조관리" },
    { id: "inter_plant_transfer", name: "공장간 이동", module: "제조관리" },
    { id: "plant2_manufacturing", name: "2공장 제조", module: "제조관리" },
    { id: "shipping", name: "출고관리", module: "출고관리" },
    { id: "label_management", name: "라벨관리", module: "라벨관리" },
    { id: "inventory_view", name: "재고조회", module: "재고관리" },
    { id: "quality_check", name: "품질검사", module: "품질관리" },
    { id: "user_management", name: "사용자관리", module: "시스템관리" },
    { id: "all", name: "전체권한", module: "시스템관리" },
  ]);

  const statusColors: { [key: string]: string } = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    suspended: "bg-red-100 text-red-800",
  };

  const statusLabels: { [key: string]: string } = {
    active: "활성",
    inactive: "비활성",
    suspended: "정지",
  };

  const roleColors: { [key: string]: string } = {
    Admin: "bg-purple-100 text-purple-800",
    Planner: "bg-blue-100 text-blue-800",
    Operator: "bg-green-100 text-green-800",
    QC: "bg-orange-100 text-orange-800",
    Shipper: "bg-cyan-100 text-cyan-800",
  };

  const createUser = () => {
    if (!newUser.username || !newUser.email || !newUser.role) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    const userId = `USR${String(users.length + 1).padStart(3, "0")}`;
    const rolePermissions =
      roles.find((r) => r.id === newUser.role)?.permissions || [];

    const user = {
      ...newUser,
      id: userId,
      status: "active" as const,
      lastLogin: "-",
      permissions: rolePermissions,
    };

    setUsers((prev) => [...prev, user]);
    setNewUser({
      username: "",
      email: "",
      role: "",
      department: "",
      plant: "",
      password: "",
    });

    alert(`사용자 생성 완료: ${userId}`);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
  };

  const deleteUser = (userId: string) => {
    if (confirm("정말로 이 사용자를 삭제하시겠습니까?")) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  };

  const updateUserPermissions = (
    userId: string,
    permissionId: string,
    granted: boolean
  ) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          const newPermissions = granted
            ? [...user.permissions, permissionId]
            : user.permissions.filter((p) => p !== permissionId);
          return { ...user, permissions: newPermissions };
        }
        return user;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#724323] flex items-center gap-2">
            <Users className="w-6 h-6" />
            사용자/권한 관리
          </h1>
          <p className="text-[#333333] mt-1">
            RBAC 기반 접근제어, 사용자 등록 및 권한 설정
          </p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">사용자 관리</TabsTrigger>
          <TabsTrigger value="roles">역할 관리</TabsTrigger>
          <TabsTrigger value="permissions">권한 관리</TabsTrigger>
          <TabsTrigger value="audit">접근 로그</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border border-[#F5E9D5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333] mb-1">전체 사용자</p>
                    <p className="text-2xl font-bold text-[#724323]">
                      {users.length}
                    </p>
                  </div>
                  <div className="p-3 bg-[#724323] rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333] mb-1">활성 사용자</p>
                    <p className="text-2xl font-bold text-[#724323]">
                      {users.filter((u) => u.status === "active").length}
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
                    <p className="text-sm text-[#333333] mb-1">1공장 사용자</p>
                    <p className="text-2xl font-bold text-[#724323]">
                      {users.filter((u) => u.plant === "P1").length}
                    </p>
                  </div>
                  <div className="p-3 bg-[#A3C478] rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#F5E9D5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#333333] mb-1">2공장 사용자</p>
                    <p className="text-2xl font-bold text-[#724323]">
                      {users.filter((u) => u.plant === "P2").length}
                    </p>
                  </div>
                  <div className="p-3 bg-[#F9B679] rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create New User */}
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                신규 사용자 등록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>사용자명</Label>
                  <Input
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    placeholder="사용자명"
                  />
                </div>
                <div>
                  <Label>이메일</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="email@aniecong.com"
                  />
                </div>
                <div>
                  <Label>역할</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: string) =>
                      setNewUser((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="역할 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>부서</Label>
                  <Select
                    value={newUser.department}
                    onValueChange={(value: string) =>
                      setNewUser((prev) => ({ ...prev, department: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="부서 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="관리부">관리부</SelectItem>
                      <SelectItem value="품질관리">품질관리</SelectItem>
                      <SelectItem value="전처리">전처리</SelectItem>
                      <SelectItem value="제조">제조</SelectItem>
                      <SelectItem value="출고">출고</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>담당 공장</Label>
                  <Select
                    value={newUser.plant}
                    onValueChange={(value: string) =>
                      setNewUser((prev) => ({ ...prev, plant: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="공장 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">전체</SelectItem>
                      <SelectItem value="P1">1공장</SelectItem>
                      <SelectItem value="P2">2공장</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>비밀번호</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="비밀번호"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={createUser}
                  className="bg-[#724323] hover:bg-[#5a3419] text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  사용자 생성
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Users className="w-5 h-5" />
                사용자 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>사용자명</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>부서</TableHead>
                    <TableHead>공장</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>최근 로그인</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={roleColors[user.role]}>
                          {roles.find((r) => r.id === user.role)?.name ||
                            user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.plant}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[user.status]}>
                          {statusLabels[user.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleUserStatus(user.id)}
                            className="p-1 h-auto"
                          >
                            {user.status === "active" ? (
                              <AlertTriangle className="w-4 h-4 text-orange-600" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-1 h-auto"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteUser(user.id)}
                            className="p-1 h-auto text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
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

        <TabsContent value="roles" className="space-y-4">
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Shield className="w-5 h-5" />
                역할 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="border border-[#F5E9D5] rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-[#724323]">
                        {role.name}
                      </h4>
                      <Badge className={roleColors[role.id]}>
                        {role.userCount}명
                      </Badge>
                    </div>
                    <p className="text-sm text-[#333333] mb-3">
                      {role.description}
                    </p>
                    <div className="space-y-1">
                      <Label className="text-xs text-[#333333]">권한</Label>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permId) => {
                          const permission = permissions.find(
                            (p) => p.id === permId
                          );
                          return (
                            <Badge
                              key={permId}
                              variant="outline"
                              className="text-xs"
                            >
                              {permission?.name || permId}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        수정
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        상세
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Settings className="w-5 h-5" />
                사용자별 권한 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {users
                  .filter((u) => u.role !== "Admin")
                  .map((user) => (
                    <div
                      key={user.id}
                      className="border border-[#F5E9D5] rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-[#724323]">
                            {user.username}
                          </h4>
                          <p className="text-sm text-[#333333]">
                            {user.department} • {user.plant}
                          </p>
                        </div>
                        <Badge className={roleColors[user.role]}>
                          {roles.find((r) => r.id === user.role)?.name}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {permissions
                          .filter((p) => p.id !== "all")
                          .map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center justify-between p-2 bg-[#FAF6F2] rounded"
                            >
                              <div>
                                <span className="text-sm font-medium text-[#724323]">
                                  {permission.name}
                                </span>
                                <div className="text-xs text-[#333333]">
                                  {permission.module}
                                </div>
                              </div>
                              <Switch
                                checked={user.permissions.includes(
                                  permission.id
                                )}
                                onCheckedChange={(checked) =>
                                  updateUserPermissions(
                                    user.id,
                                    permission.id,
                                    checked
                                  )
                                }
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card className="border border-[#F5E9D5]">
            <CardHeader>
              <CardTitle className="text-[#724323] flex items-center gap-2">
                <Eye className="w-5 h-5" />
                접근 로그
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>시간</TableHead>
                    <TableHead>사용자</TableHead>
                    <TableHead>작업</TableHead>
                    <TableHead>모듈</TableHead>
                    <TableHead>IP 주소</TableHead>
                    <TableHead>결과</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2025-09-11 14:30</TableCell>
                    <TableCell>관리자</TableCell>
                    <TableCell>사용자 생성</TableCell>
                    <TableCell>사용자관리</TableCell>
                    <TableCell>192.168.1.100</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        성공
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-09-11 13:20</TableCell>
                    <TableCell>최제조</TableCell>
                    <TableCell>제조지시 시작</TableCell>
                    <TableCell>2공장 제조</TableCell>
                    <TableCell>192.168.2.150</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        성공
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-09-11 09:15</TableCell>
                    <TableCell>김검수</TableCell>
                    <TableCell>입고 검수</TableCell>
                    <TableCell>입고관리</TableCell>
                    <TableCell>192.168.1.120</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        성공
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-09-11 08:45</TableCell>
                    <TableCell>이전처리</TableCell>
                    <TableCell>전처리 시작</TableCell>
                    <TableCell>1공장 전처리</TableCell>
                    <TableCell>192.168.1.110</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        성공
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-09-10 18:00</TableCell>
                    <TableCell>박품질</TableCell>
                    <TableCell>권한 없는 접근 시도</TableCell>
                    <TableCell>사용자관리</TableCell>
                    <TableCell>192.168.2.200</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800">실패</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
