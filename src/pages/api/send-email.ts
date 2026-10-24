import type { APIRoute } from 'astro';
import { handleSendEmail } from '../../features/contact-form/server/handle-send-email';
import { contactDeps } from '../../features/contact-form/server/runtime';

// The only on-demand route: every page stays prerendered.
export const prerender = false;

export const POST: APIRoute = ({ request }) => handleSendEmail(request, contactDeps);
