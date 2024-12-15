import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.jwt_secret!;
export const generateToken = (user: any) => {
 
  if(!user||!user.id){
    throw new Error('User is not defined or userId is not defined');
  }
  const payload = {
    userId: user.id,
    email: user.email,
  };

  // Generate the token with an expiration time (e.g., 1 hour)
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
  return token;
};
interface TokenPayload {
  id: string;
  email: string;
}



export function verifyToken(token: string): TokenPayload {
  if (!JWT_SECRET) {
    throw new Error('JWT secret is not defined in environment variables.');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    // console.log('Decoded token:', decoded);  // Log the decoded token
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid or expired token');
  }
}
