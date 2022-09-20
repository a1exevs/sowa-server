import { formatString } from "./src/common/utils/formatters";

declare global {
  interface String {
    format(...args: any): string;
  }
}

if (!(String.prototype as any).format) {
  ;(String.prototype as any).format = formatString
}
