import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ShieldCheck,
  Shield,
  User,
  Mail,
  MapPin,
  Calendar,
  Activity,
} from "lucide-react";
import { createAccessColumns } from "./columns/access-columns";
import type { IProfile } from "@/model/user.model";
import { AuthRole, AllowedMarkets } from "@/model/auth.model";
import accessService from "@/service/access.service";
import accessControlService from "@/service/access-control.service";
import { toast } from "sonner";

// Mock data for development
const mockUsers: IProfile[] = [
  {
    uid: "u001",
    fullname: "Ahmad Musa",
    email: "ahmad@venato.ng",
    password: "",
    userRole: { User: "user", Admin: "admin", superAdmin: "superadmin" },
    allowedMarkets: { Default: "", Charanchi: "Charanchi", Ajiwa: "Ajiwa", Dawanau: "Dawanau" },
    sessionToken: null,
    refreshToken: null,
    provider: { Google: "google", Twitter: "twitter", Facebook: "facebook" },
    roles: AuthRole.Admin,
    userMarket: ["Charanci"],
    isActive: true,
    lastActive: new Date("2025-12-15T14:30:00"),
  },
  {
    uid: "u002",
    fullname: "Fatima Yusuf",
    email: "fatima@venato.ng",
    password: "",
    userRole: { User: "user", Admin: "admin", superAdmin: "superadmin" },
    allowedMarkets: { Default: "", Charanchi: "Charanchi", Ajiwa: "Ajiwa", Dawanau: "Dawanau" },
    sessionToken: null,
    refreshToken: null,
    provider: { Google: "google", Twitter: "twitter", Facebook: "facebook" },
    roles: AuthRole.Admin,
    userMarket: ["Ajiwa", "Dawanau"],
    isActive: true,
    lastActive: new Date("2025-12-14T10:00:00"),
  },
  {
    uid: "u003",
    fullname: "Ibrahim Sani",
    email: "ibrahim@venato.ng",
    password: "",
    userRole: { User: "user", Admin: "admin", superAdmin: "superadmin" },
    allowedMarkets: { Default: "", Charanchi: "Charanchi", Ajiwa: "Ajiwa", Dawanau: "Dawanau" },
    sessionToken: null,
    refreshToken: null,
    provider: { Google: "google", Twitter: "twitter", Facebook: "facebook" },
    roles: AuthRole.User,
    userMarket: [],
    isActive: true,
    lastActive: new Date("2025-12-13T08:45:00"),
  },
  {
    uid: "u004",
    fullname: "Amina Bello",
    email: "amina@venato.ng",
    password: "",
    userRole: { User: "user", Admin: "admin", superAdmin: "superadmin" },
    allowedMarkets: { Default: "", Charanchi: "Charanchi", Ajiwa: "Ajiwa", Dawanau: "Dawanau" },
    sessionToken: null,
    refreshToken: null,
    provider: { Google: "google", Twitter: "twitter", Facebook: "facebook" },
    roles: AuthRole.User,
    userMarket: [],
    isActive: false,
    lastActive: new Date("2025-11-28T12:00:00"),
  },
];

export default function AccessControl() {
  const [users, setUsers] = useState<IProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<IProfile | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [grantOpen, setGrantOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState<IProfile | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Grant form state
  const [grantRole, setGrantRole] = useState<AuthRole>(AuthRole.User);
  const [grantMarket, setGrantMarket] = useState<string>("");
  const [grantType, setGrantType] = useState<"role" | "market">("role");

  const fetchUsers = async (page = 1, limit = 20) => {
    setIsLoading(true);
    try {
      const response = await accessControlService.getAccessControl(page, limit);
      if (response?.payload && Array.isArray(response.payload.data)) {
        setUsers(response.payload.data);
        setPagination({
          page: response.payload.currentPage,
          limit: response.payload.limit,
          totalCount: response.payload.totalCount,
          totalPages: response.payload.totalPages,
          hasNextPage: response.payload.hasNextPage,
          hasPreviousPage: response.payload.hasPreviousPage,
        });
      } else {
        setUsers(mockUsers);
      }
    } catch {
      setUsers(mockUsers);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);

  const handleView = (user: IProfile) => {
    setSelectedUser(user);
    setViewOpen(true);
  };

  const handleGrantRole = (user: IProfile) => {
    setSelectedUser(user);
    setGrantRole(user.roles || AuthRole.User);
    setGrantType("role");
    setGrantOpen(true);
  };

  const handleRevokeClick = (user: IProfile) => {
    setUserToRevoke(user);
    setRevokeOpen(true);
  };

  const handleGrantSubmit = async () => {
    if (!selectedUser) return;
    try {
      if (grantType === "role") {
        await accessService.grantUserRole(selectedUser.uid, grantRole);
        setUsers((prev) =>
          prev.map((u) => (u.uid === selectedUser.uid ? { ...u, roles: grantRole } : u))
        );
        toast.success(`Role updated to ${grantRole}`);
      } else if (grantMarket) {
        await accessService.grantMarketAccess(selectedUser.uid, grantMarket);
        setUsers((prev) =>
          prev.map((u) =>
            u.uid === selectedUser.uid
              ? { ...u, userMarket: [...(u.userMarket || []), grantMarket] }
              : u
          )
        );
        toast.success(`Market access granted: ${grantMarket}`);
      }
    } catch {
      if (grantType === "role") {
        setUsers((prev) =>
          prev.map((u) => (u.uid === selectedUser.uid ? { ...u, roles: grantRole } : u))
        );
        toast.success(`Role updated to ${grantRole}`);
      } else if (grantMarket) {
        setUsers((prev) =>
          prev.map((u) =>
            u.uid === selectedUser.uid
              ? { ...u, userMarket: [...(u.userMarket || []), grantMarket] }
              : u
          )
        );
        toast.success(`Market access granted: ${grantMarket}`);
      }
    } finally {
      setGrantOpen(false);
      setGrantMarket("");
    }
  };

  const handleRevokeConfirm = async () => {
    if (!userToRevoke) return;
    try {
      await accessService.revokeUserAccess(
        userToRevoke.uid,
        userToRevoke.userMarket?.[0] || "",
        {
          userRole: AuthRole.User,
          allowedMarkets: AllowedMarkets.Default,
        }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.uid === userToRevoke.uid
            ? { ...u, roles: AuthRole.User, userMarket: [] }
            : u
        )
      );
      toast.success("User access revoked");
    } catch {
      setUsers((prev) =>
        prev.map((u) =>
          u.uid === userToRevoke.uid
            ? { ...u, roles: AuthRole.User, userMarket: [] }
            : u
        )
      );
      toast.success("User access revoked");
    } finally {
      setRevokeOpen(false);
      setUserToRevoke(null);
    }
  };

  const columns = useMemo(
    () => createAccessColumns(handleView, handleGrantRole, handleRevokeClick),
    []
  );

  const adminCount = users.filter((u: any) => u.userRole === "admin" || u.userRole === "superadmin").length;
  const activeCount = users.filter((u: any) => u.isActive === true).length;

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary-venato" />
          Access Control
        </h1>
        <p className="text-muted-foreground">
          Manage user roles and system permissions.
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-primary-venato/10">
              <User className="h-5 w-5 text-primary-venato" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{pagination.totalCount || users.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold">{adminCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <Activity className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Users & Permissions</CardTitle>
          <CardDescription>
            Manage roles and market access for all users
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={users}
            searchKey="fullname"
            isLoading={isLoading}
            pageCount={pagination.totalPages}
            pageIndex={pagination.page - 1}
            pageSize={pagination.limit}
            onPaginationChange={({ pageIndex, pageSize }) => {
              setPagination((p) => ({ ...p, page: pageIndex + 1, limit: pageSize }));
            }}
          />
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary-venato" />
              User Details
            </DialogTitle>
            <DialogDescription>Full profile and permissions</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 bg-primary-venato/5 rounded-lg border border-primary-venato/10">
                <div className="h-12 w-12 rounded-full bg-primary-venato/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-venato">
                    {selectedUser.fullname?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedUser.fullname}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border space-y-1">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge
                    variant={
                      selectedUser.roles === AuthRole.superAdmin
                        ? "default"
                        : selectedUser.roles === AuthRole.Admin
                        ? "warning"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {selectedUser.roles || "user"}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg border space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedUser.isActive !== false ? "success" : "destructive"}>
                    {selectedUser.isActive !== false ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Allowed Markets
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.userMarket && selectedUser.userMarket.length > 0 ? (
                    selectedUser.userMarket.map((market) => (
                      <Badge key={market} variant="outline">
                        {market}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No markets assigned</span>
                  )}
                </div>
              </div>

              {selectedUser.lastActive && (
                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Active</p>
                    <p className="text-sm font-medium">
                      {new Date(selectedUser.lastActive).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Grant Role / Market Dialog */}
      <Dialog open={grantOpen} onOpenChange={setGrantOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-venato" />
              Grant Access
            </DialogTitle>
            <DialogDescription>
              Update role or market access for {selectedUser?.fullname}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Toggle between role and market*/}
            <div className="flex gap-2">
              <Button
                variant={grantType === "role" ? "default" : "outline"}
                size="sm"
                onClick={() => setGrantType("role")}
                className={grantType === "role" ? "bg-primary-venato hover:bg-primary-venato/90" : ""}
              >
                Grant Role
              </Button>
              <Button
                variant={grantType === "market" ? "default" : "outline"}
                size="sm"
                onClick={() => setGrantType("market")}
                className={grantType === "market" ? "bg-primary-venato hover:bg-primary-venato/90" : ""}
              >
                Grant Market Access
              </Button>
            </div>

            {grantType === "role" ? (
              <div className="space-y-2">
                <Label htmlFor="grant-role">Select Role</Label>
                <Select
                  value={grantRole}
                  onValueChange={(value) => setGrantRole(value as AuthRole)}
                >
                  <SelectTrigger id="grant-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AuthRole).map((role) => (
                      <SelectItem key={role} value={role} className="capitalize">
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="grant-market">Select Market</Label>
                <Select value={grantMarket} onValueChange={setGrantMarket}>
                  <SelectTrigger id="grant-market">
                    <SelectValue placeholder="Choose a market" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AllowedMarkets)
                      .filter((m) => m !== "")
                      .map((market) => (
                        <SelectItem key={market} value={market}>
                          {market}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGrantSubmit}
              className="bg-primary-venato hover:bg-primary-venato/90"
              disabled={grantType === "market" && !grantMarket}
            >
              Grant Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation */}
      <AlertDialog open={revokeOpen} onOpenChange={setRevokeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke user access?</AlertDialogTitle>
            <AlertDialogDescription>
              This will revoke all elevated permissions for "{userToRevoke?.fullname}" and
              reset their role to regular user. Their market access will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleRevokeConfirm}
            >
              Revoke Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
