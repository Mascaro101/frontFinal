import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [storeToken, setStoreToken] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (storeToken) {
                // Set the store token directly in local storage
                localStorage.setItem('storeToken', storeToken);
                router.push('/'); // Redirect to the home page
            } else {
                // Login as user
                const response = await axios.post('http://localhost:3000/api/user/login', { email, password });
                localStorage.setItem('token', response.data.token);
                router.push('/'); // Redirect to the home page
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!storeToken}
                disabled={!!storeToken}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!storeToken}
                disabled={!!storeToken}
            />
            <input
                type="text"
                placeholder="Store Token"
                value={storeToken}
                onChange={(e) => setStoreToken(e.target.value)}
                required={!email && !password}
                disabled={!!email || !!password}
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;