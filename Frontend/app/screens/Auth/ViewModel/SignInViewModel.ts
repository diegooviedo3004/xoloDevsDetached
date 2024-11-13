const apiUrl = process.env.EXPO_PUBLIC_API_URL;
console.log("===> apiurl", apiUrl);
export const SignInViewModel = async (username: string | null, password: string | null) => {
    try {
        console.log("==> datos", username, password);
        const req = await fetch(`http://192.168.100.6:8000/auth/jwt/create/`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: username,
                password: password,
            }),
        });

        if (!req.ok) {
            const errorResponse = await req.text();
            console.error(`Error ${req.status}:`, errorResponse);
            throw new Error(`Error de autenticación: ${req.statusText}`);
        }

        const resp = await req.json();
        return { status: req.status, ...resp };

    } catch (e) {
        console.error('Error durante la autenticación:', e);
        return null;
    }
};
