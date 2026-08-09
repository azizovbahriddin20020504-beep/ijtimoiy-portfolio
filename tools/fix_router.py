from pathlib import Path
import re

path = Path('/home/ubuntu/ijtimoiy-portfolio/server/routers.ts')
text = path.read_text()
replacement = '''    uploadEvidence: protectedProcedure.input(evidenceUploadInput).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const encoded = input.data.includes(",") ? input.data.split(",")[1] : input.data;
      if (!encoded) throw new TRPCError({ code: "BAD_REQUEST", message: "Fayl ma'lumoti bo'sh" });
      const buffer = Buffer.from(encoded, "base64");
      const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
      const stored = await storagePut(`evidence/${ctx.user.id}/${Date.now()}-${safeName}`, buffer, input.mimeType);
      await db.insert(evidence).values({ userId: ctx.user.id, title: input.title, type: input.type, url: stored.url });
      return { success: true, url: stored.url };
    }),'''
pattern = r'    uploadEvidence:.*?\n  \}\),'
updated, count = re.subn(pattern, replacement + '\n  }),', text, count=1, flags=re.S)
if count != 1:
    raise SystemExit(f'uploadEvidence block not found: {count}')
path.write_text(updated)
print('uploadEvidence block fixed')
