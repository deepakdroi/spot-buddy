import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      dob?: string;
    };
  }

  interface User {
    accessToken?: string;
    dob?: string;
  }

  interface JWT {
    accessToken?: string;
    dob?: string;
  }
}
