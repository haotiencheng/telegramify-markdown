// Import the library
import telegramifyMarkdown from 'telegramify-markdown';

// --- CORS Configuration ---
const allowedOrigins = [
	'https://md2tg.projectstain.dev', // Your frontend
	'http://localhost:3000', // Common dev servers
];

// --- Main Worker Logic ---
export default {
	async fetch(request) {
		const origin = request.headers.get('Origin');
		const isAllowedOrigin = origin && allowedOrigins.includes(origin);

		// 1. Handle CORS Preflight (OPTIONS request)
		if (request.method === 'OPTIONS') {
			if (isAllowedOrigin) {
				return new Response(null, {
					status: 204,
					headers: {
						'Access-Control-Allow-Origin': origin,
						'Access-Control-Allow-Methods': 'POST, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type',
					},
				});
			} else {
				return new Response('Forbidden', { status: 403 });
			}
		}

		// Prepare a function to create responses with CORS headers
		const createCorsResponse = (body, options) => {
			const headers = new Headers(options.headers);
			// Only add CORS header if the origin is allowed
			if (isAllowedOrigin) {
				headers.set('Access-Control-Allow-Origin', origin);
			}
			return new Response(body, { ...options, headers });
		};

		// 2. Process Actual API Request (POST)
		const standardHeaders = { 'Content-Type': 'application/json' };

		if (request.method !== 'POST') {
			const errorResponse = { success: false, error: 'Only POST requests are accepted.' };
			return createCorsResponse(JSON.stringify(errorResponse), { status: 405, headers: standardHeaders });
		}

		try {
			const body = await request.json();
			const markdownText = body.markdown;

			if (!markdownText) {
				const errorResponse = { success: false, error: 'Request body must be a JSON object with a "markdown" key.' };
				return createCorsResponse(JSON.stringify(errorResponse), { status: 400, headers: standardHeaders });
			}

			const convertedText = telegramifyMarkdown(markdownText);
			const successResponse = { success: true, data: { telegram_text: convertedText } };
			return createCorsResponse(JSON.stringify(successResponse), { status: 200, headers: standardHeaders });
		} catch (error) {
			const errorResponse = { success: false, error: 'Invalid JSON in request body.' };
			return createCorsResponse(JSON.stringify(errorResponse), { status: 400, headers: standardHeaders });
		}
	},
};
