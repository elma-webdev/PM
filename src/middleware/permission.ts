import { Request, Response, NextFunction } from "express";

export const permission_Level1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
   console.log(
     "Permission check failed: No req.user ADMIN found. Is Auth middleware running first?"
   );
     res.status(401).json({ message: "Unauthorized" });
     return;
  }

  if (req.user.role !== 2) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }
  next();
};
export const permission_Level2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
   console.log(
     "Permission check failed: No req.user ADMIN and PSICOLOGO found. Is Auth middleware running first?"
   );
     res.status(401).json({ message: "Unauthorized" });
     return;
  }

  const { role } = req.user;
  console.log("Checking role in middleware:", role);

  if (role !== 1 && role !== 2) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }

     next();
};
export const permissionBoth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  if (!req.user) {
    console.log(
      "Permission check failed: No req.user ADMIN and PACIENTE found. Is Auth middleware running first?"
    );
    res.status(401).json({ message: "Unauthorized: Session missing" });
    return;
  }

  const { role } = req.user;
  console.log("Checking role in middleware:", role);

  if (role === 0 || role === 2) {
   return next();
  }

  res
    .status(403)
    .json({ message: "Forbidden: You do not have the required role" });
};


// export const authorize = (allowedRoles: string[]) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!req.user) {
//          console.log(
//            "Permission check failed: No req.user found. Is Auth middleware running first?"
//          );
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         if (!allowedRoles.includes(req.user.role)) {
//             return res.status(403).json({ message: "Forbidden" });
//         }

//         next();
//     };
// };

// Usage in routes:
// router.get("/data", authorize(["ADMIN", "PSICOLOGO"]), controller);