import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  UserPlus,
  UserCog,
  Store,
  Loader2,
} from "lucide-react";
import { createAccessColumns } from "./columns/access-columns";
import type { IProfile } from "@/model/user.model";
import { AuthRole } from "@/model/auth.model";
import { useAccessControlHook } from "./columns/super-admin-hooks";
import type { IAuth } from "@/types/auth.types";
import { toast } from "sonner";

const roleSchema = z.object({
  grantRole: z.nativeEnum(AuthRole),
});

const marketSchema = z.object({
  grantMarket: z.string().min(1, "Please select a market"),
});

const inviteSchema = z.object({
  fullname: z.string().min(2, { message: "Fullname must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.nativeEnum(AuthRole).refine(
    (val) => val === AuthRole.Admin || val === AuthRole.User,
    { message: "Role must be admin or User" }
  ),
});

type RoleFormValues = z.infer<typeof roleSchema>;
type MarketFormValues = z.infer<typeof marketSchema>;
type InviteFormValues = z.infer<typeof inviteSchema>;


export default function AccessControl() {
  const {
    users,
    isLoading,
    isMutating,
    pagination,
    setPagination,
    fetchUsers,
    fetchAllMarkets,
    grantRoleAccess,
    grantMarketAccess,
    revokeAccess,
    markets,
    marketPagination,
    loadMoreMarkets,
    inviteAdminUser,
    verifyUser,
    deleteUserAccount,
    stats,
  } = useAccessControlHook();

  const [selectedUser, setSelectedUser] = useState<IProfile | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [grantOpen, setGrantOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState<IAuth | null>(null);
  const [userToVerify, setUserToVerify] = useState<IProfile | null>(null);
  const [userToDelete, setUserToDelete] = useState<IProfile | null>(null);

  const roleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      grantRole: AuthRole.User,
    },
  });

  const marketForm = useForm<MarketFormValues>({
    resolver: zodResolver(marketSchema),
    defaultValues: {
      grantMarket: "",
    },
  });

  const inviteForm = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      fullname: "",
      email: "",
      role: AuthRole.Admin,
    },
  });

  useEffect(() => {
    fetchUsers(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit, fetchUsers]);

  useEffect(() => {
    fetchAllMarkets(1);
  }, [fetchAllMarkets]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastMarketElementRef = useCallback((node: HTMLDivElement) => {
    if (marketPagination.isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && marketPagination.hasNextPage) {
        loadMoreMarkets();
      }
    });
    if (node) observer.current.observe(node);
  }, [marketPagination.isLoading, marketPagination.hasNextPage, loadMoreMarkets]);

  const handleView = useCallback((user: IProfile) => {
    setSelectedUser(user);
    setViewOpen(true);
  }, []);

  const handleGrantRole = useCallback((user: IProfile) => {
    setSelectedUser(user);
    roleForm.reset({
      grantRole: (user.userRole as AuthRole) || user.roles || AuthRole.User,
    });
    setGrantOpen(true);
  }, [roleForm]);

  const handleAssignMarket = useCallback((user: IProfile) => {
    const effectiveRole = (user.userRole || user.roles || "").toLowerCase();
    if (effectiveRole !== AuthRole.Admin.toLowerCase()) {
      toast.error("Only users with the Admin role can be assigned a market.");
      return;
    }
    setSelectedUser(user);
    marketForm.reset({ grantMarket: "" });
    setMarketOpen(true);
  }, [marketForm]);

  const handleRevokeClick = useCallback((user: IProfile) => {
    setUserToRevoke(user);
    setRevokeOpen(true);
  }, []);

  const handleRoleSubmit = async (data: RoleFormValues) => {
    if (!selectedUser) return;
    const { success } = await grantRoleAccess(selectedUser._id, data.grantRole);
    if (success) {
      setGrantOpen(false);
    }
  };

  const handleMarketSubmit = async (data: MarketFormValues) => {
    if (!selectedUser) return;
    const effectiveRole = (selectedUser.userRole || selectedUser.roles || "").toLowerCase();
    if (effectiveRole !== AuthRole.Admin.toLowerCase()) {
      toast.error("Only users with the Admin role can be assigned a market.");
      setMarketOpen(false);
      return;
    }
    const { success } = await grantMarketAccess(selectedUser._id, data.grantMarket);
    if (success) {
      setMarketOpen(false);
      marketForm.reset({ grantMarket: "" });
    }
  };

  const handleRevokeConfirm = async () => {
    if (!userToRevoke) return;
    
    const { success } = await revokeAccess(userToRevoke._id);
    
    if (success) {
      setRevokeOpen(false);
      setUserToRevoke(null);
    }
  };

  const handleInviteSubmit = async (data: InviteFormValues) => {
    const { success } = await inviteAdminUser(data.email, data.fullname, data.role);
    if (success) {
      setInviteOpen(false);
      inviteForm.reset();
    }
  };

  const handleVerify = useCallback((user: IProfile) => {
    setUserToVerify(user);
    setVerifyOpen(true);
  }, []);

  const handleVerifyConfirm = async () => {
    if (!userToVerify) return;
    const { success } = await verifyUser(userToVerify._id);
    if (success) {
      setVerifyOpen(false);
      setUserToVerify(null);
    }
  };

  const handleDelete = useCallback((user: IProfile) => {
    setUserToDelete(user);
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    const { success } = await deleteUserAccount(userToDelete._id);
    if (success) {
      setDeleteOpen(false);
      setUserToDelete(null);
    }
  };

  const columns = useMemo(
    () =>
      createAccessColumns(
        handleView,
        handleGrantRole,
        handleAssignMarket,
        handleRevokeClick,
        handleVerify,
        handleDelete
      ),
    [
      handleView,
      handleGrantRole,
      handleAssignMarket,
      handleRevokeClick,
      handleVerify,
      handleDelete,
    ]
  );

  const adminCount = stats.adminUsers;
  const activeCount = stats.activeUsers;

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-primary-venato" />
            Access Control
          </h1>
          <p className="text-muted-foreground">
            Manage user roles and system permissions.
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="bg-primary-venato hover:bg-primary-venato/90 flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Create Admin
        </Button>
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
              <p className="text-2xl font-bold">{pagination.totalCount }</p>
            </div>
          </CardContent>
        </Card>
         <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-primary-venato/10">
              <User className="h-5 w-5 text-primary-venato" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verified Users</p>
              <p className="text-2xl font-bold">{stats.verifiedUsers }</p>
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
                      selectedUser.userRole === AuthRole.superAdmin
                        ? "default"
                        : selectedUser.userRole === AuthRole.Admin
                        ? "warning"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {selectedUser.userRole || "user"}
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
                  {selectedUser.allowedMarkets && selectedUser.allowedMarkets.length > 0 ? (
                    selectedUser.allowedMarkets.map((market: any) => (
                      <Badge key={market._id || market} variant="outline">
                        {market.name || market}
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

      {/* Change User Role Dialog */}
      <Dialog open={grantOpen} onOpenChange={setGrantOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-amber-600" />
              Change User Role
            </DialogTitle>
            <DialogDescription>
              Update the system role for {selectedUser?.fullname}
            </DialogDescription>
          </DialogHeader>
          <Form {...roleForm}>
            <form onSubmit={roleForm.handleSubmit(handleRoleSubmit)}>
              <div className="space-y-4 py-4">
                <FormField
                  control={roleForm.control}
                  name="grantRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Role</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(AuthRole).map((role) => (
                            <SelectItem key={role} value={role} className="capitalize">
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setGrantOpen(false)} disabled={isMutating}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-venato hover:bg-primary-venato/90"
                  disabled={isMutating}
                >
                  {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Role"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Assign Market Dialog (Admin only) */}
      <Dialog
        open={marketOpen}
        onOpenChange={(open) => {
          setMarketOpen(open);
          if (!open) marketForm.reset({ grantMarket: "" });
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-emerald-600" />
              Assign Market
            </DialogTitle>
            <DialogDescription>
              Assign a market to admin {selectedUser?.fullname}
            </DialogDescription>
          </DialogHeader>
          <Form {...marketForm}>
            <form onSubmit={marketForm.handleSubmit(handleMarketSubmit)}>
              <div className="space-y-4 py-4">
                <FormField
                  control={marketForm.control}
                  name="grantMarket"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Market</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a market" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {markets.map((market) => (
                            <SelectItem key={market._id} value={market._id}>
                              {market.name}
                            </SelectItem>
                          ))}
                          {marketPagination.hasNextPage && (
                            <div ref={lastMarketElementRef} className="h-4" />
                          )}
                          {marketPagination.isLoading && (
                            <div className="p-2 text-sm text-center text-muted-foreground">
                              Loading more...
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMarketOpen(false)}
                  disabled={isMutating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-venato hover:bg-primary-venato/90"
                  disabled={isMutating}
                >
                  {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign Market"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              disabled={isMutating}
              onClick={(e) => {
                e.preventDefault();
                handleRevokeConfirm();
              }}
            >
              {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Revoke Access"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Verify Confirmation */}
      <AlertDialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify user account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to verify "{userToVerify?.fullname}"? This will allow them
              to access the system and perform assigned actions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary-venato hover:bg-primary-venato/90"
              onClick={(e) => {
                e.preventDefault();
                handleVerifyConfirm();
              }}
              disabled={isMutating}
            >
              {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete User Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{userToDelete?.fullname}"? This action is permanent
              and will remove all their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              disabled={isMutating}
            >
              {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Admin Dialog */}
      <Dialog
        open={inviteOpen}
        onOpenChange={(open) => {
          setInviteOpen(open);
          if (!open) inviteForm.reset();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary-venato" />
              Create Admin
            </DialogTitle>
            <DialogDescription>
              Invite a new admin or superadmin to the system.
            </DialogDescription>
          </DialogHeader>
          <Form {...inviteForm}>
            <form onSubmit={inviteForm.handleSubmit(handleInviteSubmit)}>
              <div className="space-y-4 py-4">
                <FormField
                  control={inviteForm.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={inviteForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={inviteForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Role</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={AuthRole.Admin}>Admin</SelectItem>
                            <SelectItem value={AuthRole.User}>User</SelectItem>

                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setInviteOpen(false)} disabled={isMutating}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-venato hover:bg-primary-venato/90"
                  disabled={isMutating}
                >
                  {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Invite"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
