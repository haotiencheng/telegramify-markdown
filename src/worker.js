// Import the library you just installed
import telegramifyMarkdown from 'telegramify-markdown';

export default {
	async fetch(request) {
		// 1. Only allow POST requests
		if (request.method !== 'POST') {
			return new Response('Please send a POST request with your Markdown in the body.', {
				status: 405, // Method Not Allowed
			});
		}

		// 2. Get the Markdown text from the request body
		const markdownText = await request.text();

		if (!markdownText) {
			return new Response('Request body is empty.', { status: 400 });
		}

		// 3. Use the library to convert the text
		const convertedText = telegramifyMarkdown(markdownText);

		// 4. Return the converted text as the response
		return new Response(convertedText, {
			headers: { 'Content-Type': 'text/plain' },
		});
	},
};
