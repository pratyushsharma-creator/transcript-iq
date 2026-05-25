import { z } from 'zod';
export declare const listEarningsSchema: z.ZodObject<{
    sector: z.ZodOptional<z.ZodString>;
    ticker: z.ZodOptional<z.ZodString>;
    quarter: z.ZodOptional<z.ZodEnum<["Q1", "Q2", "Q3", "Q4"]>>;
    fiscalYear: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sector?: string | undefined;
    ticker?: string | undefined;
    quarter?: "Q1" | "Q2" | "Q3" | "Q4" | undefined;
    fiscalYear?: number | undefined;
}, {
    sector?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    ticker?: string | undefined;
    quarter?: "Q1" | "Q2" | "Q3" | "Q4" | undefined;
    fiscalYear?: number | undefined;
}>;
export declare const getEarningsSchema: z.ZodObject<{
    slug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    slug: string;
}, {
    slug: string;
}>;
export declare function listEarnings(args: z.infer<typeof listEarningsSchema>): Promise<string>;
export declare function getEarnings(args: z.infer<typeof getEarningsSchema>): Promise<string>;
//# sourceMappingURL=earnings.d.ts.map