import z from "zod";

export const SearchRequestSchema = z.object({
	q: z.string().min(1).max(100),
});
