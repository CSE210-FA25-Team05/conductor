import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function handle({ event, resolve }) {

    let response = await resolve(event);

    try {
        const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:3001';

        const browserCookieHeader = event.request.headers.get('cookie');

        const headers = {};
        if (browserCookieHeader) {
            headers['Cookie'] = browserCookieHeader;
        }

        let checkAuth = await fetch(`${backendUrl}/me`, {
            method: 'GET',
            headers: headers,
        });

        let data = {}; // Initialize data to an empty object
        try {
            data = await checkAuth.json();
        } catch (jsonError) {
            console.warn("Failed to parse JSON from auth check response, status:", checkAuth.status, jsonError);
        }


        if (checkAuth.ok) {
            const setCookieHeader = checkAuth.headers.get('set-cookie');
            if (setCookieHeader) {
                response.headers.append('set-cookie', setCookieHeader);
            }
        } else if (checkAuth.status === 401 && data.error === 'PROFILE_INCOMPLETE') {
            throw redirect(302, '/profile');
        } else if (checkAuth.status === 401 && event.url.pathname !== '/login') {
            throw redirect(302, '/login');
        }

    } catch (error) {
        if (error instanceof redirect) {
            throw error;
        }

        console.error('Unhandled error in handle hook:', error);

        if (event.url.pathname !== '/login') {
            throw redirect(302, '/login');
        }

    }

    return response;
}
