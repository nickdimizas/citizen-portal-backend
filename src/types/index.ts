type TokenPayload = {
  id: string;
  username: string;
  email: string;
  role: string;
};

type JwtExpiresIn =
  | number
  | '1s'
  | '10s'
  | '30s'
  | '1m'
  | '10m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '6h'
  | '12h'
  | '1d'
  | '2d'
  | '7d'
  | '14d'
  | '30d';

export { TokenPayload, JwtExpiresIn };
