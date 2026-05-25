import { z } from 'zod';
export declare const listBlogPostsSchema: z.ZodObject<{
    contentType: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    contentType?: string | undefined;
}, {
    limit?: number | undefined;
    page?: number | undefined;
    contentType?: string | undefined;
}>;
export declare const getBlogPostSchema: z.ZodObject<{
    slug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    slug: string;
}, {
    slug: string;
}>;
export declare function listBlogPosts(args: z.infer<typeof listBlogPostsSchema>): Promise<string>;
export declare function getBlogPost(args: z.infer<typeof getBlogPostSchema>): Promise<string>;
//# sourceMappingURL=blog.d.ts.map