import z from 'zod';

const marks = z
  .array(z.strictObject({ type: z.enum(['bold', 'underline']) }))
  .max(2)
  .optional();
const listType = z.enum(['1', 'a', 'A', 'i', 'I']).nullable().optional();

const text = z.strictObject({
  type: z.literal('text'),
  text: z.string().min(1),
  marks,
});

const paragraph = z.strictObject({
  type: z.literal('paragraph'),
  content: z
    .array(z.union([text, z.strictObject({ type: z.literal('hardBreak'), marks })]))
    .optional(),
});

type Paragraph = z.infer<typeof paragraph>;
type DescriptionBlock =
  | Paragraph
  | {
      type: 'bulletList' | 'orderedList';
      attrs?: { start: number; type?: z.infer<typeof listType> };
      content: { type: 'listItem'; content: [Paragraph, ...DescriptionBlock[]] }[];
    };

function descriptionBlock(listDepth: number): z.ZodType<DescriptionBlock> {
  if (listDepth === 0) return paragraph;

  const item = z.strictObject({
    type: z.literal('listItem'),
    content: z.tuple([paragraph], descriptionBlock(listDepth - 1)),
  });
  return z.union([
    paragraph,
    z.strictObject({ type: z.literal('bulletList'), content: z.array(item).min(1) }),
    z.strictObject({
      type: z.literal('orderedList'),
      attrs: z.strictObject({ start: z.int32(), type: listType }).optional(),
      content: z.array(item).min(1),
    }),
  ]);
}

const document = z.strictObject({
  type: z.literal('doc'),
  content: z.array(descriptionBlock(8)).min(1),
});

export const richDescriptionSchema = z.preprocess((value, ctx) => {
  if (value == null) return value;
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (Buffer.byteLength(serialized) <= 60_000) {
      return typeof value === 'string' ? JSON.parse(value) : value;
    }
  } catch {
    // Invalid multipart JSON is reported through the same request validation middleware.
  }
  ctx.addIssue({ code: 'custom', message: 'Provide a valid formatted description under 60 KB.' });
  return z.NEVER;
}, document.nullable().optional());
