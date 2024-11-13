const apiUrl = process.env.EXPO_PUBLIC_API_URL;
console.log("==> apiUrl", apiUrl);
export const gettingAllPost = async (token: string) => {
    try {

        const req = await fetch(`${apiUrl}posts/`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

        });

        // if (!req.status) {
        //     const errorResponse = await req.text();
        //     console.error(`Error ${req.status}:`, errorResponse);
        //     throw new Error(`Error de autenticación: ${req.statusText}`);
        // }
        console.log("==> req", resp);
        const resp = await req.json();
        return resp;

    } catch (e) {
        console.error('Error:', e);
        return null;
    }
};
