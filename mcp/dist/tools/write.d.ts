import { z } from 'zod';
export declare const createBlogPostSchema: z.ZodObject<{
    title: z.ZodString;
    excerpt: z.ZodOptional<z.ZodString>;
    contentType: z.ZodDefault<z.ZodEnum<["educational", "industry-deep-dive", "use-case", "thought-leadership", "whitepaper", "case-study", "pillar"]>>;
    bodyText: z.ZodOptional<z.ZodString>;
    featured: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    contentType: "educational" | "industry-deep-dive" | "use-case" | "thought-leadership" | "whitepaper" | "case-study" | "pillar";
    title: string;
    excerpt?: string | undefined;
    bodyText?: string | undefined;
    featured?: boolean | undefined;
}, {
    title: string;
    contentType?: "educational" | "industry-deep-dive" | "use-case" | "thought-leadership" | "whitepaper" | "case-study" | "pillar" | undefined;
    excerpt?: string | undefined;
    bodyText?: string | undefined;
    featured?: boolean | undefined;
}>;
export declare function createBlogPost(input: z.infer<typeof createBlogPostSchema>): Promise<string>;
export declare const updateBlogPostSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodString>;
    contentType: z.ZodOptional<z.ZodEnum<["educational", "industry-deep-dive", "use-case", "thought-leadership", "whitepaper", "case-study", "pillar"]>>;
    bodyText: z.ZodOptional<z.ZodString>;
    featured: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    contentType?: "educational" | "industry-deep-dive" | "use-case" | "thought-leadership" | "whitepaper" | "case-study" | "pillar" | undefined;
    title?: string | undefined;
    excerpt?: string | undefined;
    bodyText?: string | undefined;
    featured?: boolean | undefined;
}, {
    id: string;
    contentType?: "educational" | "industry-deep-dive" | "use-case" | "thought-leadership" | "whitepaper" | "case-study" | "pillar" | undefined;
    title?: string | undefined;
    excerpt?: string | undefined;
    bodyText?: string | undefined;
    featured?: boolean | undefined;
}>;
export declare function updateBlogPost(input: z.infer<typeof updateBlogPostSchema>): Promise<string>;
export declare const createTranscriptSchema: z.ZodObject<{
    title: z.ZodString;
    expertFormerTitle: z.ZodString;
    expertLevel: z.ZodEnum<["c-suite", "vp", "director"]>;
    dateConducted: z.ZodString;
    tier: z.ZodDefault<z.ZodEnum<["standard", "premium", "elite"]>>;
    priceUsd: z.ZodDefault<z.ZodNumber>;
    geography: z.ZodOptional<z.ZodEnum<["north-america", "europe", "global", "apac"]>>;
    summary: z.ZodOptional<z.ZodString>;
    executiveSummaryPreview: z.ZodOptional<z.ZodString>;
    topicsCovered: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    tier: "standard" | "premium" | "elite";
    title: string;
    expertFormerTitle: string;
    expertLevel: "c-suite" | "vp" | "director";
    dateConducted: string;
    priceUsd: number;
    geography?: "north-america" | "europe" | "global" | "apac" | undefined;
    summary?: string | undefined;
    executiveSummaryPreview?: string | undefined;
    topicsCovered?: string[] | undefined;
}, {
    title: string;
    expertFormerTitle: string;
    expertLevel: "c-suite" | "vp" | "director";
    dateConducted: string;
    tier?: "standard" | "premium" | "elite" | undefined;
    geography?: "north-america" | "europe" | "global" | "apac" | undefined;
    priceUsd?: number | undefined;
    summary?: string | undefined;
    executiveSummaryPreview?: string | undefined;
    topicsCovered?: string[] | undefined;
}>;
export declare function createTranscript(input: z.infer<typeof createTranscriptSchema>): Promise<string>;
export declare const updateTranscriptSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    expertFormerTitle: z.ZodOptional<z.ZodString>;
    expertLevel: z.ZodOptional<z.ZodEnum<["c-suite", "vp", "director"]>>;
    dateConducted: z.ZodOptional<z.ZodString>;
    tier: z.ZodOptional<z.ZodEnum<["standard", "premium", "elite"]>>;
    priceUsd: z.ZodOptional<z.ZodNumber>;
    geography: z.ZodOptional<z.ZodEnum<["north-america", "europe", "global", "apac"]>>;
    summary: z.ZodOptional<z.ZodString>;
    executiveSummaryPreview: z.ZodOptional<z.ZodString>;
    topicsCovered: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    tier?: "standard" | "premium" | "elite" | undefined;
    geography?: "north-america" | "europe" | "global" | "apac" | undefined;
    title?: string | undefined;
    expertFormerTitle?: string | undefined;
    expertLevel?: "c-suite" | "vp" | "director" | undefined;
    dateConducted?: string | undefined;
    priceUsd?: number | undefined;
    summary?: string | undefined;
    executiveSummaryPreview?: string | undefined;
    topicsCovered?: string[] | undefined;
}, {
    id: string;
    tier?: "standard" | "premium" | "elite" | undefined;
    geography?: "north-america" | "europe" | "global" | "apac" | undefined;
    title?: string | undefined;
    expertFormerTitle?: string | undefined;
    expertLevel?: "c-suite" | "vp" | "director" | undefined;
    dateConducted?: string | undefined;
    priceUsd?: number | undefined;
    summary?: string | undefined;
    executiveSummaryPreview?: string | undefined;
    topicsCovered?: string[] | undefined;
}>;
export declare function updateTranscript(input: z.infer<typeof updateTranscriptSchema>): Promise<string>;
export declare const createEarningsSchema: z.ZodObject<{
    title: z.ZodString;
    companyName: z.ZodString;
    ticker: z.ZodString;
    exchange: z.ZodEnum<["NASDAQ", "NYSE", "NSE", "BSE", "LSE", "HKEX", "SGX", "TSE", "ASX"]>;
    quarter: z.ZodEnum<["Q1", "Q2", "Q3", "Q4", "FY"]>;
    fiscalYear: z.ZodNumber;
    reportDate: z.ZodString;
    priceUsd: z.ZodDefault<z.ZodNumber>;
    summary: z.ZodOptional<z.ZodString>;
    performanceBadges: z.ZodOptional<z.ZodArray<z.ZodEnum<["eps-beat", "eps-miss", "eps-in-line", "rev-beat", "rev-miss", "rev-in-line"]>, "many">>;
    keyTopics: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    keyMetrics: z.ZodOptional<z.ZodArray<z.ZodObject<{
        metric: z.ZodString;
        value: z.ZodString;
        yoyChange: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        metric: string;
        yoyChange?: string | undefined;
    }, {
        value: string;
        metric: string;
        yoyChange?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    ticker: string;
    quarter: "Q1" | "Q2" | "Q3" | "Q4" | "FY";
    fiscalYear: number;
    title: string;
    priceUsd: number;
    companyName: string;
    exchange: "NASDAQ" | "NYSE" | "NSE" | "BSE" | "LSE" | "HKEX" | "SGX" | "TSE" | "ASX";
    reportDate: string;
    summary?: string | undefined;
    performanceBadges?: ("eps-beat" | "eps-miss" | "eps-in-line" | "rev-beat" | "rev-miss" | "rev-in-line")[] | undefined;
    keyTopics?: string[] | undefined;
    keyMetrics?: {
        value: string;
        metric: string;
        yoyChange?: string | undefined;
    }[] | undefined;
}, {
    ticker: string;
    quarter: "Q1" | "Q2" | "Q3" | "Q4" | "FY";
    fiscalYear: number;
    title: string;
    companyName: string;
    exchange: "NASDAQ" | "NYSE" | "NSE" | "BSE" | "LSE" | "HKEX" | "SGX" | "TSE" | "ASX";
    reportDate: string;
    priceUsd?: number | undefined;
    summary?: string | undefined;
    performanceBadges?: ("eps-beat" | "eps-miss" | "eps-in-line" | "rev-beat" | "rev-miss" | "rev-in-line")[] | undefined;
    keyTopics?: string[] | undefined;
    keyMetrics?: {
        value: string;
        metric: string;
        yoyChange?: string | undefined;
    }[] | undefined;
}>;
export declare function createEarnings(input: z.infer<typeof createEarningsSchema>): Promise<string>;
export declare const updateEarningsSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    companyName: z.ZodOptional<z.ZodString>;
    ticker: z.ZodOptional<z.ZodString>;
    exchange: z.ZodOptional<z.ZodEnum<["NASDAQ", "NYSE", "NSE", "BSE", "LSE", "HKEX", "SGX", "TSE", "ASX"]>>;
    quarter: z.ZodOptional<z.ZodEnum<["Q1", "Q2", "Q3", "Q4", "FY"]>>;
    fiscalYear: z.ZodOptional<z.ZodNumber>;
    reportDate: z.ZodOptional<z.ZodString>;
    priceUsd: z.ZodOptional<z.ZodNumber>;
    summary: z.ZodOptional<z.ZodString>;
    performanceBadges: z.ZodOptional<z.ZodArray<z.ZodEnum<["eps-beat", "eps-miss", "eps-in-line", "rev-beat", "rev-miss", "rev-in-line"]>, "many">>;
    keyTopics: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    keyMetrics: z.ZodOptional<z.ZodArray<z.ZodObject<{
        metric: z.ZodString;
        value: z.ZodString;
        yoyChange: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        metric: string;
        yoyChange?: string | undefined;
    }, {
        value: string;
        metric: string;
        yoyChange?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    ticker?: string | undefined;
    quarter?: "Q1" | "Q2" | "Q3" | "Q4" | "FY" | undefined;
    fiscalYear?: number | undefined;
    title?: string | undefined;
    priceUsd?: number | undefined;
    summary?: string | undefined;
    companyName?: string | undefined;
    exchange?: "NASDAQ" | "NYSE" | "NSE" | "BSE" | "LSE" | "HKEX" | "SGX" | "TSE" | "ASX" | undefined;
    reportDate?: string | undefined;
    performanceBadges?: ("eps-beat" | "eps-miss" | "eps-in-line" | "rev-beat" | "rev-miss" | "rev-in-line")[] | undefined;
    keyTopics?: string[] | undefined;
    keyMetrics?: {
        value: string;
        metric: string;
        yoyChange?: string | undefined;
    }[] | undefined;
}, {
    id: string;
    ticker?: string | undefined;
    quarter?: "Q1" | "Q2" | "Q3" | "Q4" | "FY" | undefined;
    fiscalYear?: number | undefined;
    title?: string | undefined;
    priceUsd?: number | undefined;
    summary?: string | undefined;
    companyName?: string | undefined;
    exchange?: "NASDAQ" | "NYSE" | "NSE" | "BSE" | "LSE" | "HKEX" | "SGX" | "TSE" | "ASX" | undefined;
    reportDate?: string | undefined;
    performanceBadges?: ("eps-beat" | "eps-miss" | "eps-in-line" | "rev-beat" | "rev-miss" | "rev-in-line")[] | undefined;
    keyTopics?: string[] | undefined;
    keyMetrics?: {
        value: string;
        metric: string;
        yoyChange?: string | undefined;
    }[] | undefined;
}>;
export declare function updateEarnings(input: z.infer<typeof updateEarningsSchema>): Promise<string>;
export declare const publishContentSchema: z.ZodObject<{
    collection: z.ZodEnum<["blog-posts", "expert-transcripts", "earnings-analyses"]>;
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    collection: "blog-posts" | "expert-transcripts" | "earnings-analyses";
}, {
    id: string;
    collection: "blog-posts" | "expert-transcripts" | "earnings-analyses";
}>;
export declare function publishContent(input: z.infer<typeof publishContentSchema>): Promise<string>;
export declare const unpublishContentSchema: z.ZodObject<{
    collection: z.ZodEnum<["blog-posts", "expert-transcripts", "earnings-analyses"]>;
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    collection: "blog-posts" | "expert-transcripts" | "earnings-analyses";
}, {
    id: string;
    collection: "blog-posts" | "expert-transcripts" | "earnings-analyses";
}>;
export declare function unpublishContent(input: z.infer<typeof unpublishContentSchema>): Promise<string>;
//# sourceMappingURL=write.d.ts.map