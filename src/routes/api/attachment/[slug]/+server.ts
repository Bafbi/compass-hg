import { db } from '$lib/server/db.js';
import { attachments } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const GET = async ({ params }) => {
	const { slug } = params;
	const selectAttachment = await db
		.select()
		.from(attachments)
		.where(eq(attachments.id, slug))
		.get();
	if (!selectAttachment) {
		return new Response('Not found', { status: 404 });
	}

	const file: File = new File([selectAttachment.blob], selectAttachment.name, {
		type: selectAttachment.type
	});
    
	return new Response(file.stream(), {
		status: 200,
		headers: {
			'Content-Disposition': `attachment; filename="${file.name}";`,
			'Content-Type': file.type,
            'Content-Length': file.size.toFixed(0)
		}
	});
};
