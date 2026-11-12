import { useSelector } from 'react-redux';
import useAuthModule from '../../auth/hooks/useAuthModule';

export default function useProfile() {
  const user = useSelector((s) => s.user.user);
  const { logout, loading } = useAuthModule();

  return { user, logout, loading };
}
