import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISpRasaXProps {
  description: string;
  context: WebPartContext;
  webURL: string;
}

export interface ISpRasaXState {
  fullName: string;
  viewImg: boolean;
  image: string;
}
