import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from '../styles/Stores.module.css'; // Importing the CSS module

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/store');
                setStores(response.data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching stores:', err);
            }
        };
        fetchStores();
    }, []);

    return (
        <div className={styles['stores-container']}>
            {/* Buttons moved to the top */}
            <div className={styles['button-group']}>
                <Link href="/create-store">
                    <button>Create Store</button>
                </Link>
                <Link href="/modify-store">
                    <button>Modify Store</button>
                </Link>
                <Link href="/delete-store">
                    <button>Delete Store</button>
                </Link>
            </div>
            <h1>All Stores</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <ul>
                {stores.length > 0 ? (
                    stores.map((store) => (
                        <li key={store.CIF}>
                            <p><strong>Store Name:</strong> {store.storeName}</p>
                            <p><strong>CIF:</strong> {store.CIF}</p>
                            <p><strong>Email:</strong> {store.email}</p>
                        </li>
                    ))
                ) : (
                    <p>No stores available</p>
                )}
            </ul>
        </div>
    );
};

export default Stores;
