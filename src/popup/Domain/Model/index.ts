export type Question = {
  firstNumber: number;
  secondNumber: number;
  math: "+" | "-" | "x" | ":";
  result: number;
  answer: [number];
};

export type Summary = {
  player: string;
  listQuestionPassed: [Question];
};

export type User = {
  userName: string;
  jwt: string;
};

export interface GraphQLResponse<T> {
  data: {
    [key: string]: T
  } | null,
  errors: Array<{
    message: string;
    location: Array<{
      line: number;
      column: number
    }>
  }>
}

export interface WalletConnectResponse {
  failReason?: string;
  id?: string;
  publicationId?: string;
  status?: string;
  txId?: string
  nextStep?: {
    chainId?: number;
    method?: string;
    params?: Array<string>;
  }
}