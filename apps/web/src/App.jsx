import { RouterProvider } from 'react-router-dom';
import MotionConfigProvider from '@/motion/MotionConfigProvider';
import AppToaster from '@/components/AppToaster';
import { router } from '@/routes/router';

export default function App() {
  return (
    <MotionConfigProvider>
      <RouterProvider router={router} />
      <AppToaster />
    </MotionConfigProvider>
  );
}
