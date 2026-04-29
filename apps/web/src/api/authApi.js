// Mock auth API. Replaced by axios calls in M2.
// Accepts any 10-digit Indian mobile (6-9 first digit) and any 6-digit OTP.

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function requestOtp(mobile) {
  await wait(700);
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    throw new Error('Enter a valid 10-digit Indian mobile number');
  }
  return { sent: true, expiresIn: 300 };
}

export async function verifyOtp({ mobile, otp }) {
  await wait(700);
  if (!/^\d{6}$/.test(otp)) {
    throw new Error('OTP must be 6 digits');
  }
  // Mock: any 6-digit otp passes. Hard-code 'wrong' to fail for testing.
  if (otp === '000000') {
    throw new Error('Incorrect OTP');
  }
  return {
    user: {
      id: `u_${mobile}`,
      mobile,
      name: deriveDisplayName(mobile),
    },
    accessToken: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
  };
}

function deriveDisplayName(mobile) {
  // Demo only — first time user has no name; checkout asks for it.
  // We default to "Friend" and let edits via /account override.
  return 'Friend';
}

export function maskMobile(mobile) {
  if (!mobile || mobile.length < 4) return mobile;
  return `+91 ${mobile.slice(0, 2)}xxx xx${mobile.slice(-2)}`;
}
