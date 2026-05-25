import { z } from 'zod';
export declare const listOrdersSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["paid", "pending", "refunded", "failed"]>>;
    customerEmail: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: "paid" | "pending" | "refunded" | "failed" | undefined;
    customerEmail?: string | undefined;
}, {
    limit?: number | undefined;
    page?: number | undefined;
    status?: "paid" | "pending" | "refunded" | "failed" | undefined;
    customerEmail?: string | undefined;
}>;
export declare function listOrders(args: z.infer<typeof listOrdersSchema>): Promise<string>;
export declare const draftContentSchema: z.ZodObject<{
    brief: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["blog", "transcript-summary", "earnings-summary"]>>;
}, "strip", z.ZodTypeAny, {
    type: "blog" | "transcript-summary" | "earnings-summary";
    brief: string;
}, {
    brief: string;
    type?: "blog" | "transcript-summary" | "earnings-summary" | undefined;
}>;
export declare function draftContent(args: z.infer<typeof draftContentSchema>): Promise<string>;
export declare const generateMetaSchema: z.ZodObject<{
    body: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    type: z.ZodDefault<z.ZodEnum<["blog", "transcript", "earnings"]>>;
}, "strip", z.ZodTypeAny, {
    type: "blog" | "transcript" | "earnings";
    body: string;
    title?: string | undefined;
}, {
    body: string;
    type?: "blog" | "transcript" | "earnings" | undefined;
    title?: string | undefined;
}>;
export declare function generateMeta(args: z.infer<typeof generateMetaSchema>): Promise<string>;
export declare const suggestTagsSchema: z.ZodObject<{
    body: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["blog", "transcript", "earnings"]>>;
}, "strip", z.ZodTypeAny, {
    type: "blog" | "transcript" | "earnings";
    body: string;
}, {
    body: string;
    type?: "blog" | "transcript" | "earnings" | undefined;
}>;
export declare function suggestTags(args: z.infer<typeof suggestTagsSchema>): Promise<string>;
//# sourceMappingURL=admin.d.ts.map