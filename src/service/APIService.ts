interface IRequestInit extends RequestInit {
	headers: {
		[key: string]: string;
	};
}

export default class APIService {
	private readonly baseUrl: string;
	private readonly token: string | null =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDk3LCJpYXQiOjE2ODc1MDgxMDUsImV4cCI6MTg2NzUwODEwNX0.filDUBVpNyFquEGVb6ug9W-6MaOmJREkEWJjP1IgG5Q";
	
	constructor() {
		if (import.meta.env.MODE === "production") {
			this.baseUrl = import.meta.env.VITE_API_PROD
		} else {
			this.baseUrl = import.meta.env.VITE_API_DEV
		}
		console.log(import.meta.env)
	}
	
	private async makeRequest<T>(
		endpoint: string,
		method: string,
		data: unknown | null = null
	): Promise<T> {
		const url = `${this.baseUrl}/${endpoint}`;
		const options: IRequestInit = {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
				apiKey: import.meta.env.VITE_APIKEY,
				clientIp: "",
			},
		};
		
		if (data) {
			options.body = JSON.stringify(data);
		}
		
		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			console.error("API Request Error:", error);
			throw error;
		}
	}
	
	public get<T>(endpoint: string): Promise<T> {
		return this.makeRequest<T>(endpoint, "GET");
	}
	
	public post<T>(endpoint: string, data: never): Promise<T> {
		return this.makeRequest<T>(endpoint, "POST", data);
	}
	
	public put<T>(endpoint: string, data: unknown): Promise<T> {
		return this.makeRequest<T>(endpoint, "PUT", data);
	}
	
	public patch<T>(endpoint: string, data: unknown): Promise<T> {
		return this.makeRequest<T>(endpoint, "PATCH", data);
	}
	
	public delete<T>(endpoint: string): Promise<T> {
		return this.makeRequest<T>(endpoint, "DELETE");
	}
}
