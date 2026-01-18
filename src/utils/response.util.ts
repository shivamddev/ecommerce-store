import { Response } from 'express';

interface SuccessResponse<T> {
	success: true;
	message?: string;
	data: T;
}

interface ErrorResponse {
	success: false;
	error: {
		code: string;
		message: string;
		details?: unknown;
	};
}

export function sendSuccess<T>(
	res: Response,
	data: T,
	message?: string,
	statusCode: number = 200,
): void {
	const response: SuccessResponse<T> = {
		success: true,
		data,
	};
	if (message) {
		response.message = message;
	}
	res.status(statusCode).json(response);
}

export function sendError(
	res: Response,
	code: string,
	message: string,
	statusCode: number = 400,
	details?: unknown,
): void {
	const response: ErrorResponse = {
		success: false,
		error: {
			code,
			message,
		},
	};
	if (details) {
		response.error.details = details;
	}
	res.status(statusCode).json(response);
}

export function formatPrice(cents: number): string {
	return `$${(cents / 100).toFixed(2)}`;
}
