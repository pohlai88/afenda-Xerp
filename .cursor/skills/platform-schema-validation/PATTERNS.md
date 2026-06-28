# Schema Validation — Extended Patterns

## Nested object validation

```ts
const AddressSchema = z.object({
  street: z.string().min(1),
  city:   z.string().min(1),
  zip:    z.string().regex(/^\d{5}(-\d{4})?$/),
});

const CreateOrderSchema = z.object({
  customerId:      z.string().uuid(),
  shippingAddress: AddressSchema,
  lineItems: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity:  z.number().int().positive(),
    })
  ).min(1, "Order must have at least one item"),
});
```

## Union discrimination via Zod

```ts
const TextBlockSchema  = z.object({ type: z.literal("text"),  content: z.string() });
const ImageBlockSchema = z.object({ type: z.literal("image"), url: z.string().url(), alt: z.string() });
const BlockSchema = z.discriminatedUnion("type", [TextBlockSchema, ImageBlockSchema]);

type Block = z.infer<typeof BlockSchema>;
// TypeScript narrows block.content / block.url based on block.type
```

## Optional vs required fields

```ts
// exactOptionalPropertyTypes is enabled — optional means absent, not undefined
const UpdateProfileSchema = z.object({
  name:  z.string().min(1).optional(),  // may be absent in partial update
  email: z.string().email().optional(),
  bio:   z.string().max(500).nullable(), // present but may be null
});
```

## Environment variable schema (parse at startup)

```ts
// lib/env.ts — parse throws at module load time if required var is missing
import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL:       z.string().url(),
  SUPABASE_ANON_KEY:  z.string().min(1),
  SUPABASE_URL:       z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export const env = EnvSchema.parse(process.env);
//                             ^ throws at startup, not at request time
```

## Reusing schemas for request + response

```ts
// Define base schema
const UserSchema = z.object({
  id:    z.string().uuid(),
  name:  z.string(),
  email: z.string().email(),
});

// Request schema omits server-assigned fields
const CreateUserRequestSchema = UserSchema.omit({ id: true });

// Response schema may extend with computed fields
const UserResponseSchema = UserSchema.extend({
  createdAt: z.string().datetime(),
});

type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
type UserResponse      = z.infer<typeof UserResponseSchema>;
```

## safeParseAsync for DB-validated uniqueness

```ts
const CreateAccountSchema = z.object({
  email: z.string().email(),
}).superRefine(async (data, ctx) => {
  const existing = await db.user.findUnique({ where: { email: data.email } });
  if (existing) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["email"],
      message: "Email is already registered",
    });
  }
});

const result = await CreateAccountSchema.safeParseAsync(formInput);
```

## Mapping ZodError to structured errors

```ts
function mapZodError(error: z.ZodError) {
  return {
    ok: false as const,
    code: "VALIDATION_ERROR" as const,
    errors: error.issues.map((issue) => ({
      path:    issue.path.map(String).join("."),
      message: issue.message,
    })),
  };
}
```
