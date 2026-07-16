/**
 * Browser session for the consumer web app.
 * JWT + last-used pincode persisted in localStorage (the web equivalent of the
 * mobile app's SecureStore session). Single source of truth for the token so
 * the API client and AuthContext stay in sync.
 */
const TOKEN_KEY = 'mv_token';
const PINCODE_KEY = 'mv_pincode';

export const session = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getPincode(): string | null {
    return localStorage.getItem(PINCODE_KEY);
  },
  /**
   * Store the visitor's area. Passing an empty string CLEARS it — "no area" is a
   * legitimate state now (browse everything), so it must be a real absence
   * rather than an empty string sitting in storage pretending to be a pincode.
   */
  setPincode(pincode: string): void {
    if (pincode) localStorage.setItem(PINCODE_KEY, pincode);
    else localStorage.removeItem(PINCODE_KEY);
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PINCODE_KEY);
  },
};
