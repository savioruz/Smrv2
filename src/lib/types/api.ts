export interface Response<T> {
	data?: T;
	paging?: {
		page: number;
		limit: number;
		total_page: number;
		total_count: number;
	};
}

export interface ErrorResponse {
	request_id: string;
	errors: {
		[key: string]: string[];
	};
}
