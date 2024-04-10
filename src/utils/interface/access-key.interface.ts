interface AccessKey {
  accessKey: string;
  userId: string;
  adminId: string;
  rateLimit: number;
  expirationTime: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export default AccessKey;
