import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, url }) => {
	if (url.searchParams.has("error")) {
		const error_code: string = url.searchParams.get("error")!;
		const error_description: string = url.searchParams.get("error_description")!;
		const error_message: string = url.searchParams.get("message")!;

		console.log(error_code, error_description, error_message);

		return {
			success: false,
			error_code,
			error_description,
			error_message
		}
	}
}