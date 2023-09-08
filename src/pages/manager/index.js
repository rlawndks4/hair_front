import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from 'src/auth/useAuthContext';

// ----------------------------------------------------------------------

export default function Index() {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user?.level >= 10) {
      router.push('/manager/user');
    } else {
      router.push('/manager/login')
    }
  });

  return null;
}
