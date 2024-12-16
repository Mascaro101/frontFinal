import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/StoreMenu.module.css';

const StoreMenu = () => {
    const [store, setStore] = useState(null);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const router = useRouter();

    const fetchStore = async () => {
        try {
            const token = localStorage.getItem('storeToken');
            if (!token) {
                console.error('No token found, redirecting to login.');
                router.push('/login');
                return;
            }

            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            const decodedToken = JSON.parse(jsonPayload);
            const { CIF } = decodedToken;

            const response = await axios.get(`http://localhost:3000/api/store/${CIF}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Fetched store data:', response.data);
            setStore((prevStore) => ({
                ...prevStore,
                ...response.data,
            }));
        } catch (err) {
            console.error('Error fetching store:', err);
            setError(err.message || 'Error fetching store');
        }
    };

    const fetchWebStore = async () => {
        try {
            const token = localStorage.getItem('storeToken');
            if (!token) {
                console.error('No token found, redirecting to login.');
                router.push('/login');
                return;
            }

            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            const decodedToken = JSON.parse(jsonPayload);
            const { CIF } = decodedToken;

            const response = await axios.get(`http://localhost:3000/api/webStore/${CIF}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Fetched webStore data:', response.data);
            setStore((prevStore) => ({
                ...prevStore,
                ...response.data,
            }));
        } catch (err) {
            console.error('Error fetching webStore:', err);
            setError(err.message || 'Error fetching webStore');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchStore();
            await fetchWebStore();
        };
        fetchData();
    }, [router]);

    const handleFetchUsers = async () => {
        try {
            const token = localStorage.getItem('storeToken');
            const response = await axios.get(`http://localhost:3000/api/webStore/${store.CIF}/usersInSameCity`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Fetched users in the same city:', response.data);
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.message || 'Error fetching users');
        }
    };

    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!store) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Store Menu</h1>
            <p><strong>Store Name:</strong> {store.title}</p>
            <p><strong>Store ID:</strong> {store.CIF}</p>
            <p><strong>City:</strong> {store.city}</p>
            <p><strong>Activity:</strong> {store.activity}</p>
            <p><strong>Resume:</strong> {store.resume}</p>
            <p><strong>Created At:</strong> {new Date(store.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(store.updatedAt).toLocaleString()}</p>
            <Link href="/create-webstore">
                <button className={styles.button}>Create Web Store</button>
            </Link>
            <Link href="/manage-webstore">
                <button className={styles.button}>Manage Web Store</button>
            </Link>
            <button onClick={handleFetchUsers} className={styles.button}>Get Users in Same City</button>
            <div className={styles.usersContainer}>
                <h2 className={styles.subtitle}>Users in Same City</h2>
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <div key={index} className={styles.userCard}>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>City:</strong> {user.city}</p>
                            <p><strong>Age:</strong> {user.age}</p>
                            <p><strong>Interests:</strong> {user.interests.join(', ')}</p>
                        </div>
                    ))
                ) : (
                    <p>No users found in the same city</p>
                )}
            </div>
        </div>
    );
};

export default StoreMenu;