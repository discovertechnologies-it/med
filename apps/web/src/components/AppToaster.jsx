import { Toaster } from 'sonner';

export default function AppToaster() {
  return (
    <Toaster
      richColors
      closeButton
      position="top-right"
      mobileOffset={{ bottom: 16, left: 16, right: 16 }}
      toastOptions={{
        classNames: {
          toast: 'rounded-xl shadow-card',
        },
      }}
    />
  );
}
