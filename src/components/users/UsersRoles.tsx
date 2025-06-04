import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Settings,
  UserPlus,
  Shield,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  avatar?: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const UsersRoles = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "active",
      lastLogin: "2 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      permissions: ["all"],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Editor",
      status: "active",
      lastLogin: "1 day ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      permissions: ["workflows", "knowledge", "prompts"],
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "Viewer",
      status: "pending",
      lastLogin: "Never",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      permissions: ["view"],
    },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Admin",
      description: "Full system access",
      permissions: ["all"],
      userCount: 1,
    },
    {
      id: "2",
      name: "Editor",
      description: "Can create and edit workflows",
      permissions: ["workflows", "knowledge", "prompts"],
      userCount: 1,
    },
    {
      id: "3",
      name: "Viewer",
      description: "Read-only access",
      permissions: ["view"],
      userCount: 1,
    },
  ]);

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  const availablePermissions = [
    "workflows",
    "knowledge",
    "prompts",
    "providers",
    "apis",
    "analytics",
    "users",
    "billing",
    "settings",
  ];

  const handleAddUser = () => {
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "pending",
      lastLogin: "Never",
      permissions:
        roles.find((r) => r.name === newUser.role)?.permissions || [],
    };

    setUsers([...users, user]);
    setIsAddUserDialogOpen(false);
    setNewUser({ name: "", email: "", role: "" });
  };

  const handleAddRole = () => {
    const role: Role = {
      id: Date.now().toString(),
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0,
    };

    setRoles([...roles, role]);
    setIsAddRoleDialogOpen(false);
    setNewRole({ name: "", description: "", permissions: [] });
  };

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-[#0FA4AF]/20 text-[#024950] border-[#0FA4AF]/30">Active</Badge>;
      case "inactive":
        return <Badge className="bg-[#024950]/20 text-[#024950] border-[#024950]/30">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-[#964734]/20 text-[#964734] border-[#964734]/30">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="p-6">
      {/* Page Header - Inline Breadcrumb Style */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5 text-[#024950]" />
          <h1 className="text-xl font-semibold text-[#003135] dark:text-white">Users & Roles</h1>
        </div>
        <Button className="bg-[#024950] hover:bg-[#0FA4AF] text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      <div className="space-y-6">

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Manage users who have access to your AI platform
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isAddUserDialogOpen}
                    onOpenChange={setIsAddUserDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                          Invite a new team member to your AI platform
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="user-name">Full Name</Label>
                          <Input
                            id="user-name"
                            value={newUser.name}
                            onChange={(e) =>
                              setNewUser({ ...newUser, name: e.target.value })
                            }
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-email">Email Address</Label>
                          <Input
                            id="user-email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) =>
                              setNewUser({ ...newUser, email: e.target.value })
                            }
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-role">Role</Label>
                          <Select
                            value={newUser.role}
                            onValueChange={(value) =>
                              setNewUser({ ...newUser, role: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.name}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsAddUserDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleAddUser}>Add User</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.lastLogin}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
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

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Roles</CardTitle>
                    <CardDescription>
                      Define roles and their permissions
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isAddRoleDialogOpen}
                    onOpenChange={setIsAddRoleDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Shield className="h-4 w-4 mr-2" />
                        Add Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Role</DialogTitle>
                        <DialogDescription>
                          Define a new role with specific permissions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="role-name">Role Name</Label>
                          <Input
                            id="role-name"
                            value={newRole.name}
                            onChange={(e) =>
                              setNewRole({ ...newRole, name: e.target.value })
                            }
                            placeholder="Enter role name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role-description">Description</Label>
                          <Input
                            id="role-description"
                            value={newRole.description}
                            onChange={(e) =>
                              setNewRole({
                                ...newRole,
                                description: e.target.value,
                              })
                            }
                            placeholder="Enter role description"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Permissions</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {availablePermissions.map((permission) => (
                              <div
                                key={permission}
                                className="flex items-center space-x-2"
                              >
                                <Switch
                                  id={permission}
                                  checked={newRole.permissions.includes(
                                    permission,
                                  )}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setNewRole({
                                        ...newRole,
                                        permissions: [
                                          ...newRole.permissions,
                                          permission,
                                        ],
                                      });
                                    } else {
                                      setNewRole({
                                        ...newRole,
                                        permissions: newRole.permissions.filter(
                                          (p) => p !== permission,
                                        ),
                                      });
                                    }
                                  }}
                                />
                                <Label htmlFor={permission} className="text-sm">
                                  {permission.charAt(0).toUpperCase() +
                                    permission.slice(1)}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsAddRoleDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleAddRole}>Create Role</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {roles.map((role) => (
                    <Card key={role.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {role.name}
                            </CardTitle>
                            <CardDescription>
                              {role.description}
                            </CardDescription>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Users:</span>
                            <span className="font-medium">
                              {role.userCount}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium mb-2 block">
                              Permissions:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions
                                .slice(0, 3)
                                .map((permission) => (
                                  <Badge
                                    key={permission}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {permission}
                                  </Badge>
                                ))}
                              {role.permissions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{role.permissions.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Permission Matrix</CardTitle>
                <CardDescription>
                  Overview of permissions across all roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Permission</TableHead>
                        {roles.map((role) => (
                          <TableHead key={role.id} className="text-center">
                            {role.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availablePermissions.map((permission) => (
                        <TableRow key={permission}>
                          <TableCell className="font-medium">
                            {permission.charAt(0).toUpperCase() +
                              permission.slice(1)}
                          </TableCell>
                          {roles.map((role) => (
                            <TableCell key={role.id} className="text-center">
                              {role.permissions.includes(permission) ||
                                role.permissions.includes("all") ? (
                                <Badge className="bg-green-100 text-green-800">
                                  ✓
                                </Badge>
                              ) : (
                                <Badge variant="outline">✗</Badge>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UsersRoles;
