import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/ModifyWebStore.module.css'; // Import the CSS file

const ModifyWebStore = () => {
    const [storeName, setStoreName] = useState('');
    const [CIF, setCIF] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [pageId, setPageId] = useState('');
    const [title, setTitle] = useState('');
    const [activity, setActivity] = useState('');
    const [resume, setResume] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleFetch = async () => {
        try {
            const token = localStorage.getItem('storeToken');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await axios.get(`http://localhost:3000/api/webStore/${CIF}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            const webStore = response.data;
            setStoreName(webStore.storeName);
            setAddress(webStore.address);
            setCity(webStore.city);
            setEmail(webStore.email);
            setContactNumber(webStore.contactNumber);
            setPageId(webStore.pageId);
            setTitle(webStore.title);
            setActivity(webStore.activity);
            setResume(webStore.resume);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching web store:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('storeToken');
            await axios.put(`http://localhost:3000/api/webStore/${CIF}`, {
                storeName,
                address,
                city,
                email,
                contactNumber,
                pageId,
                title,
                activity,
                resume
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/store-menu');
        } catch (err) {
            console.error('Error modifying web store:', err);
            setError(err.message);
        }
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={styles.title}>Modify Web Store</h1>
                <input
                    type="text"
                    placeholder="CIF"
                    value={CIF}
                    onChange={(e) => setCIF(e.target.value)}
                    required
                    className={styles.input}
                />
                <button
                    type="button"
                    onClick={handleFetch}
                    className={`${styles.button} ${styles.fetchButton}`}
                >
                    Fetch Web Store
                </button>
                <input
                    type="text"
                    placeholder="Store Name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className={styles.input}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="Contact Number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                    className={styles.input}
                />
                <input
                    type="number"
                    placeholder="Page ID"
                    value={pageId}
                    onChange={(e) => setPageId(e.target.value)}
                    required
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="Activity"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    required
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="Resume"
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    required
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Modify Web Store</button>
            </form>
            {error && <div className={styles.error}>Error: {error}</div>}
        </div>
    );
};

export default ModifyWebStore;
