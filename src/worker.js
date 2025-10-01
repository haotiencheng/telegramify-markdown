// Import the library
import telegramifyMarkdown from 'telegramify-markdown';

export default {
	async fetch(request) {
		// Set standard JSON headers for all responses
		const headers = { 'Content-Type': 'application/json' };

		// 1. Only allow POST requests
		if (request.method !== 'POST') {
			const errorResponse = {
				success: false,
				error: 'Only POST requests are accepted.',
			};
			return new Response(JSON.stringify(errorResponse), { status: 405, headers });
		}

		try {
			// 2. Get the JSON from the request body
			const body = await request.json();
			const markdownText = body.markdown;

			if (!markdownText) {
				const errorResponse = {
					success: false,
					error: 'Request body must be a JSON object with a "markdown" key.',
				};
				return new Response(JSON.stringify(errorResponse), { status: 400, headers });
			}

			// 3. Use the library to convert the text
			const convertedText = telegramifyMarkdown(markdownText);

			// 4. Return the converted text in a JSON response
			const successResponse = {
				success: true,
				data: {
					telegram_text: convertedText,
				},
			};
			return new Response(JSON.stringify(successResponse), { status: 200, headers });
		} catch (error) {
			// Handle cases where the request body is not valid JSON
			const errorResponse = {
				success: false,
				error: 'Invalid JSON in request body.',
			};
			return new Response(JSON.stringify(errorResponse), { status: 400, headers });
		}
	},
};
