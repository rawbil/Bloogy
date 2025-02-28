# Handling cookies
- **Method 1**:
  import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

```
const fetchProtectedData = async () => {
  const router = useRouter();
  try {
    const response = await axios.get('/api/protected', { withCredentials: true });
    // Use the response data...
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // Handle unauthenticated state
      toast.error('Your session has expired. Please log in again.');
      router.push('/user/login');
    } else {
      toast.error('An unexpected error occurred.');
    }
  }
};

```

- **Method 2:**
    **Use library like Cookie.js:**

    ```
        import Cookies from 'js-cookie';
        import { useRouter } from 'next/navigation';
        import { useEffect } from 'react';

        const ProtectedComponent = () => {
        const router = useRouter();

        useEffect(() => {
            const token = Cookies.get("access_token");
            if (!token) {
            // No token means user is not logged in
            router.push('/user/login');
            }
        }, [router]);

        return (
            <div>
            {/* Protected content here */}
            </div>
        );
        };

    ```
