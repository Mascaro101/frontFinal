"use client";

import Link from 'next/link';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Home = () => {
    const [webStores, setWebStores] = useState([]);
    const [error, setError] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [storeToken, setStoreToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchWebStores = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/webStore');
                console.log('API Response:', response.data); // Debug the API response
                setWebStores(response.data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching web stores:', err);
            }
        };
        fetchWebStores();

        // Check for user token in local storage
        const token = localStorage.getItem('token');
        if (token) {
            setUserToken(token);

            // Decode the JWT token to check if the user is an admin
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decodedToken = JSON.parse(jsonPayload);
            if (decodedToken.role === 'admin') {
                setIsAdmin(true);
            }
        }

        // Check for store token in local storage
        const storeToken = localStorage.getItem('storeToken');
        if (storeToken) {
            setStoreToken(storeToken);
        }
    }, []);

    return (
        <div>
            <h1>Welcome to the API Frontend</h1>
            <nav>
                <ul>
                    <li><Link href="/webStore/new">Create Web Store</Link></li>
                    <li><Link href="/login">Login</Link></li>
                    <li><Link href="/register">Register</Link></li>
                    {userToken && !storeToken && <li><Link href="/profile">Personal Profile</Link></li>}
                    {storeToken && <li><Link href="/store-menu">Store Menu</Link></li>}
                    {isAdmin && <li><Link href="/stores">Stores</Link></li>}
                </ul>
            </nav>
            <div>
                <h2>Available Web Stores</h2>
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <ul>
                    {webStores.length > 0 ? (
                        webStores.map((webStore) => (
                            <li key={webStore.storeId}>
                                <Link href={`/webStore/${webStore.storeId}`}>
                                    {webStore.title || 'Unnamed Store'}
                                </Link>
                            </li>
                        ))
                    ) : (
                        <p>No web stores available</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Home;