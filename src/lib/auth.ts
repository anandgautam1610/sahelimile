export interface UserProfile {
  name: string;
  email: string;
  gender: "female" | "male" | "other";
  verified: boolean;
  verifiedAt: string;
  verificationMethod: "face-ai" | "demo-bypass";
  confidence?: number;
  avatarUrl?: string;
  organization?: string;
}

export const AUTH_STORAGE_KEY = "sahelimile_auth_user";

export const DEMO_VERIFIED_USER: UserProfile = {
  name: "Aditi Rao",
  email: "aditi.rao@manit.ac.in",
  gender: "female",
  verified: true,
  verifiedAt: "Verified Today",
  verificationMethod: "demo-bypass",
  confidence: 0.96,
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  organization: "MANIT Bhopal (Computer Science)",
};

export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.verified) {
      return parsed;
    }
  } catch (err) {
    console.error("Error reading stored user auth:", err);
  }
  return null;
}

export function setStoredUser(user: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Error saving stored user auth:", err);
  }
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.error("Error clearing stored user auth:", err);
  }
}
