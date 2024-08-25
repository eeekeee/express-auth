import { UserDocument } from "../models/userModel"; // User 모델의 타입을 가져옵니다.

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // user 속성을 추가합니다.
    }
  }
}
