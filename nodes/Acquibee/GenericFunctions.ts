import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INode,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

type AcquibeeApiRequestOptions = {
	url: string;
	method?: IHttpRequestMethods;
	body?: IDataObject;
	qs?: IDataObject;
	headers?: Record<string, string>;
};

export async function acquibeeApiRequest(
	this: ILoadOptionsFunctions | IExecuteFunctions,
	opts: AcquibeeApiRequestOptions,
): Promise<unknown> {
	const creds = await this.getCredentials('acquibeeApi');
	if (!creds) {
		throw new NodeOperationError(this.getNode(), 'No credentials provided');
	}

	const baseUrl = (creds.baseUrl as string) || 'https://app.acquibee.de/api/v4';
	const method = opts.method || 'GET';

	try {
		const options: IHttpRequestOptions = {
			method,
			url: `${baseUrl}${opts.url}`,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				...(opts.headers ?? {}),
			},
			body: opts.body,
			qs: opts.qs,
			json: true,
		};

		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'acquibeeApi',
			options,
		);
		return response;
	} catch (error) {
		return handleApiError.call(this, error);
	}
}

function handleApiError(this: IExecuteFunctions | ILoadOptionsFunctions, error: unknown) {
	const err = error as { message?: string; statusCode?: number; response?: { status?: number; data?: unknown; body?: unknown } };

	if (err.statusCode === 401 || err.response?.status === 401) {
		throw new NodeOperationError(this.getNode(), 'Invalid API key. Please check your Acquibee credentials.');
	}

	const details = err?.response?.data ?? err?.response?.body ?? err?.message ?? err;

	let message: string;

	const errorsArray = (details as { errors?: unknown })?.errors;
	if (Array.isArray(errorsArray)) {
		message = errorsArray.join(' ');
	} else if (typeof details === 'string') {
		message = details;
	} else {
		try {
			message = JSON.stringify(details);
		} catch {
			message = 'Unknown error';
		}
	}

	if (!message || message === '{}') {
		message = 'No additional details provided';
	}

	throw new NodeApiError(this.getNode(), error as JsonObject, {
		message: `Acquibee API request failed. Details: ${message}`,
	});
}

export function formatBirthday(node: INode, dateString: string): string {
	const value = dateString.trim();

	const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
	if (match) {
		return value;
	}

	const date = new Date(value);
	if (isNaN(date.getTime())) {
		throw new NodeOperationError(node, `Invalid date format: "${dateString}". Use DD.MM.YYYY or ISO 8601.`);
	}

	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const year = date.getUTCFullYear();

	return `${day}.${month}.${year}`;
}