export interface IConfig {
  meteo_service: {
    base_url: string;
    private_key: string;
    public_key: string;
    station_id: number;
  };
  google_api_key: string;
  coords_timeout: string | undefined;
  websocket_auth_secret_key: string;
}
