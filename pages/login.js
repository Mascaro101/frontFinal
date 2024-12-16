import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css'; // Import the CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [storeToken, setStoreToken] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (storeToken) {
                // Store login
                localStorage.setItem('storeToken', storeToken);
                router.push('/'); // Redirect to the home page
            } else {
                // User login
                const response = await axios.post('http://localhost:3000/api/user/login', { email, password });
                localStorage.setItem('token', response.data.token);
                router.push('/'); // Redirect to the home page
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* User Login Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>User Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={!storeToken}
                    disabled={!!storeToken}
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!storeToken}
                    disabled={!!storeToken}
                    className={styles.input}
                />
            </div>

            {/* Store Login Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Store Login</h2>
                <input
                    type="text"
                    placeholder="Store Token"
                    value={storeToken}
                    onChange={(e) => setStoreToken(e.target.value)}
                    required={!email && !password}
                    disabled={!!email || !!password}
                    className={styles.input}
                />
            </div>

            <button type="submit" className={styles.button}>
                Login
            </button>
        </form>
    );
};

export default Login;
