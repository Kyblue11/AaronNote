import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

interface ConnectivityState {
    isOnline: boolean;
    connectionType: string;
}

export const useConnectivity: () => ConnectivityState = () => {
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const [connectionType, setConnectionType] = useState<string>("idkbrah");

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: { isConnected: boolean | null; type: string | null }) => {
            setIsOnline(state.isConnected ?? true);
            setConnectionType(state.type ?? "idkbrah");
        });
        return unsubscribe;
    }, []);
    return { isOnline, connectionType };
};
export default useConnectivity;