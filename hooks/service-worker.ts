import { useEffect } from 'react';


export function useServiceWorker(path: string) {
  useEffect(() => {
    if('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
       navigator.serviceWorker.register(path).then(
          registration => {
            console.log('Service Worker registration successful with scope:', registration.scope);
          },
          err => {
            console.log('Service Worker registration failed:', err);
          }
        );
      });
    }
  }, [])
}