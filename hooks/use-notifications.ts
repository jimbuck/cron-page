import { useEffect } from 'react';


export function useNotifications() {
	useEffect(() => {
		if(Notification.permission !== 'granted') Notification.requestPermission();
	}, []);
}