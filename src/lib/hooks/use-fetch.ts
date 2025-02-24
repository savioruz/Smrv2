const baseUrl = import.meta.env.VITE_API_BASE_URL;

async function refreshToken(
	refreshToken: string
): Promise<{ access_token: string; refresh_token: string } | null> {
	try {
		const response = await fetch(`${baseUrl}/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ refresh_token: refreshToken })
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		return data.data;
	} catch {
		return null;
	}
}

export async function useFetch<T>(
	url: string,
	options: RequestInit,
	accessToken?: string
): Promise<T> {
	try {
		const response = await fetch(`${baseUrl}${url}`, {
			...options,
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...(accessToken && { Authorization: `Bearer ${accessToken}` }),
				...options.headers
			}
		});

		// If we get a 401 and have an access token, try to refresh
		if (response.status === 401 && accessToken) {
			// Get refresh token from cookies
			const refreshTokenCookie = document.cookie
				.split('; ')
				.find((row) => row.startsWith('refresh_token='))
				?.split('=')[1];

			if (refreshTokenCookie) {
				const tokens = await refreshToken(refreshTokenCookie);
				if (tokens) {
					// Update cookies
					document.cookie = `access_token=${tokens.access_token}; path=/; max-age=${60 * 60}; secure; samesite=strict`;
					document.cookie = `refresh_token=${tokens.refresh_token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;

					// Retry the original request with new token
					const retryResponse = await fetch(`${baseUrl}${url}`, {
						...options,
						mode: 'cors',
						headers: {
							'Content-Type': 'application/json',
							Accept: 'application/json',
							Authorization: `Bearer ${tokens.access_token}`,
							...options.headers
						}
					});

					if (retryResponse.ok) {
						return await retryResponse.json();
					}
				}
			}
		}

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (err) {
		console.error('Fetch error:', err);
		throw err instanceof Error ? err : new Error(String(err));
	}
}
