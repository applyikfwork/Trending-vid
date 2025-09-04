import { 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User
} from 'firebase/auth';
import { auth } from './firebase';

export const sendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
    return { success: true, message: 'Verification email sent successfully' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const changePassword = async (user: User, currentPassword: string, newPassword: string) => {
  try {
    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email!, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
    return { success: true, message: 'Password updated successfully' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const checkEmailVerified = (user: User | null): boolean => {
  return user?.emailVerified || false;
};