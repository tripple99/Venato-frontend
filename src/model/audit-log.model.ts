import { AuthRole } from "./auth.model";

export interface IAuditLog {
  _id: string;
  actorId?: {
    _id: string;
    name?: string;
    email?: string;
    fullname?: string;
  };
  actorType: AuthRole;
  action: string;
  entityType?: string;
  entityId?: string;
  status: "SUCCESS" | "FAILED";
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  before?: any;
  after?: any;
  createdAt: string;
}
