import { AES, enc, mode } from 'crypto-js';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';

import { ITechniquesMapActiveButtonState, VehicleData, VehicleLatLanData } from 'interfaces';
import { socketApiSocket } from 'utils/config';

const useWebSocket = (
  time: number,
  secret: string,
  vehicleCode: string | null,
  techniqueId: string | null,
  kind = 'ping',
) => {
  const initialState =
    kind === 'ping'
      ? {
          status: '',
          latitude: '',
          longitude: '',
          speed: 0,
        }
      : {
          status: '',
          online_vehicle_ids: null,
          all_vehicles_info: null,
        };

  const [socketMap, setSocketMap] = useState<VehicleData | VehicleLatLanData | null>(initialState);
  const [socketLoading, setSocketLoading] = useState(false);
  const [latestSocketData, setLatestSocketData] = useState<ITechniquesMapActiveButtonState | null>(
    null,
  );

  const connectWebSocket = useCallback(() => {
    let connectionID = '';
    const message = moment().format('YYYY-MM-DD');
    const key = enc.Utf8.parse(secret);
    const encrypted = AES.encrypt(message, key, { mode: mode.ECB }).toString();
    const encodedEncrypted = encodeURIComponent(encrypted);

    const socket = new WebSocket(`${socketApiSocket}?Authentication=${encodedEncrypted}`);

    socket.onopen = () => {
      setSocketLoading(true);
      let payload = {};

      if (kind === 'ping') {
        payload = {
          kind: 'ping',
          timeout: time,
          vehicle_code: vehicleCode,
          connection_id: connectionID,
        };
      } else if (kind === 'info') {
        payload = {
          kind: 'info',
          timeout: time,
          company_id: techniqueId,
          connection_id: connectionID,
        };
      }

      socket.send(JSON.stringify(payload));
    };

    socket.onmessage = (event) => {
      setSocketLoading(false);
      const messageData = JSON.parse(event.data);
      connectionID = messageData.connection_id;

      if (kind === 'ping') {
        setSocketMap((prevMap) => ({ ...prevMap, status: messageData.kind }));
        if (messageData?.data?.latitude && messageData?.data?.longitude) {
          setSocketMap((prevMap) => ({ ...prevMap, ...messageData.data }));
        }
      } else {
        setSocketMap({ ...socketMap, status: messageData.kind });
        if (Object.keys(messageData?.data || {})?.length) {
          setSocketMap({ ...socketMap, ...messageData.data });
          setLatestSocketData(messageData?.data);
        }
      }
    };

    socket.onclose = (event) => {
      if (event.code === 1000) {
        socket.close();
      } else {
        connectWebSocket();
      }
    };

    return socket;
  }, [time, secret]);

  useEffect(() => {
    const socket = connectWebSocket();
    return () => {
      socket.close();
    };
  }, [connectWebSocket]);

  return { socketMap, socketLoading, latestSocketData } as {
    socketMap: VehicleData | VehicleLatLanData | null;
    latestSocketData: ITechniquesMapActiveButtonState | null;
    socketLoading: boolean;
  };
};

export default useWebSocket;
