import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { sendSuccess, sendError } from "../utils/response";
import { User } from "../types";

export const DEMO_AUTH_ACCOUNTS: Record<string, User> = {
  "admin@landscope.gov.in": {
    id: "usr_admin_01",
    name: "Dr. Ananya Sharma",
    email: "admin@landscope.gov.in",
    roleCode: "ADMIN",
    organization: "Ministry of Rural Development & DoLR",
    designation: "Director General Land Intelligence",
    status: "ACTIVE",
    createdAt: "2024-01-01T00:00:00Z",
  },
  "officer@landscope.gov.in": {
    id: "usr_field_01",
    name: "M. Gowda",
    email: "officer@landscope.gov.in",
    roleCode: "FIELD_OFFICER",
    organization: "Karnataka Revenue Department",
    designation: "Village Accountant / Patwari",
    status: "ACTIVE",
    createdAt: "2024-01-01T00:00:00Z",
  },
  "legal@landscope.gov.in": {
    id: "usr_legal_01",
    name: "Adv. Rajesh Swaminathan",
    email: "legal@landscope.gov.in",
    roleCode: "LEGAL_REVIEWER",
    organization: "State Land Appellate Authority",
    designation: "Standing Judicial Counsel",
    status: "ACTIVE",
    createdAt: "2024-01-01T00:00:00Z",
  },
};

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = DEMO_AUTH_ACCOUNTS[email?.toLowerCase()] || DEMO_AUTH_ACCOUNTS["admin@landscope.gov.in"];

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        roleCode: user.roleCode,
        organization: user.organization,
        designation: user.designation,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return sendSuccess(res, { user, token }, "Authentication successful");
  }

  static async me(req: any, res: Response) {
    if (!req.user) {
      return sendError(res, "Unauthorized", 401);
    }
    return sendSuccess(res, { user: req.user });
  }
}
