interface IRequestInit extends RequestInit {
	headers: {
		[key: string]: string;
	};
}
class APIService {
	private static instance: APIService;
	private readonly baseUrl: string;
	private readonly token: string | null = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY4ODE4MzYzOX0.pOzgW1mfcjOljC20kxy0BGvkgMtSR--kUAUUkLv1GNQ";
	constructor() {
		if (import.meta.env.MODE === "production") {
			this.baseUrl = import.meta.env.VITE_API_PROD
		} else {
			this.baseUrl = import.meta.env.VITE_API_DEV
		}
	}

	public static getInstance(): APIService {
		if (!APIService.instance) {
			APIService.instance = new APIService();
		}
		return APIService.instance;
	}

	private async makeRequest<T>(
		endpoint: string,
		method: string,
		data: unknown | null = null
	): Promise<T> {
		const url = `${this.baseUrl}/api/${endpoint}`;
		const options: IRequestInit = {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
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
export default  APIService.getInstance();
