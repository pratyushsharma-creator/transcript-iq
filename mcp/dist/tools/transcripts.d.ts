import { z } from 'zod';
export declare const listTranscriptsSchema: z.ZodObject<{
    sector: z.ZodOptional<z.ZodString>;
    tier: z.ZodOptional<z.ZodEnum<["standard", "premium", "elite"]>>;
    geography: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sector?: string | undefined;
    tier?: "standard" | "premium" | "elite" | undefined;
    geography?: string | undefined;
}, {
    sector?: string | undefined;
    tier?: "standard" | "premium" | "elite" | undefined;
    geography?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
}>;
export declare const getTranscriptSchema: z.ZodObject<{
    slug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    slug: string;
}, {
    slug: string;
}>;
export declare function listTranscripts(args: z.infer<typeof listTranscriptsSchema>): Promise<string>;
export declare function getTranscript(args: z.infer<typeof getTranscriptSchema>): Promise<string>;
//# sourceMappingURL=transcripts.d.ts.map