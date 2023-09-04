import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from 'src/auth/useAuthContext';

// ----------------------------------------------------------------------

export default function Index() {
  const router = useRouter();
  const { user } = useAuthContext();
  useEffect(() => {
    if(user){
      router.push('/user/home');
    }else{
      router.push('/user/login');
    }
  }, [user]);
  return null;
}
