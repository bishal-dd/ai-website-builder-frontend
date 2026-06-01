export type EmailDnsRecordType = "MX" | "TXT" | "CNAME";

export interface EmailDnsRecord {
  host: string;
  type: EmailDnsRecordType;
  value: string;
  ttl: number;
  priority?: number;
}

export interface EmailDnsResponse {
  domain: {
    id: string;
    name: string;
    status?: string | null;
  };
  records: EmailDnsRecord[];
}

export interface SaveEmailDnsInput {
  domainId: string;
  records: EmailDnsRecord[];
}
