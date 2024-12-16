import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/ManageWebStore.module.css';

const ManageWebStore = () => {
    const [store, setStore] = useState(null);
    const [error, setError] = useState(null);
    const [newText, setNewText] = useState('');
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
            setStore(response.data);
        } catch (err) {
            console.error('Error fetching webStore:', err);
            setError(err.message || 'Error fetching webStore');
        }
    };

    useEffect(() => {
        fetchStore();
        fetchWebStore();
    }, [router]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('storeToken');
            await axios.delete(`http://localhost:3000/api/webStore/${store.CIF}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('WebStore deleted successfully');
            router.push('/store-menu');
        } catch (err) {
            console.error('Error deleting webStore:', err);
            setError(err.message || 'Error deleting webStore');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
    
        try {
            // Fetch the latest store information
            await fetchWebStore(); // Ensure the store is updated before proceeding
    
            // Check if store and storeId are available after fetching
            if (!store || !store.storeId) {
                console.error('Store or storeId is not defined after fetch.');
                setError('Cannot upload image. Store information is incomplete.');
                return;
            }
    
            const token = localStorage.getItem('storeToken');
            const endpoint = `http://localhost:3000/api/webStore/${store.storeId}/uploadImage`;
    
            console.log('Uploading image to:', endpoint); // Debug log
    
            const response = await axios.patch(endpoint, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log('Image upload response:', response.data); // Debug log
            await fetchWebStore(); // Refresh the store data after successful upload
        } catch (err) {
            console.error('Error uploading image:', err.response || err.message);
            setError(err.response?.data?.error || 'Error uploading image');
        }
    };
    
    

    const handleAddText = async (e) => {
        e.preventDefault();
    
        try {
            // Fetch the latest store information
            await fetchWebStore(); // Ensure the store is updated before proceeding
    
            // Check if store and storeId are available after fetching
            if (!store || !store.storeId) {
                console.error('Store or storeId is not defined after fetch.');
                setError('Cannot add text. Store information is incomplete.');
                return;
            }
    
            const token = localStorage.getItem('storeToken');
            const endpoint = `http://localhost:3000/api/webStore/${store.storeId}/uploadText`;
    
            console.log('Adding text to:', endpoint); // Debug log
    
            const response = await axios.patch(endpoint, { text: newText }, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log('Add text response:', response.data); // Debug log
            setNewText(''); // Clear the text input after successful submission
            await fetchWebStore(); // Refresh the store data after successful text upload
        } catch (err) {
            console.error('Error adding text:', err.response || err.message);
            setError(err.response?.data?.error || 'Error adding text');
        }
    };
    

    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!store) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Manage Web Store</h1>
            <p><strong>Store Name:</strong> {store.title}</p>
            <p><strong>Store ID:</strong> {store.CIF}</p>
            <p><strong>City:</strong> {store.city}</p>
            <p><strong>Activity:</strong> {store.activity}</p>
            <p><strong>Resume:</strong> {store.resume}</p>
            <p><strong>Created At:</strong> {new Date(store.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(store.updatedAt).toLocaleString()}</p>
            <Link href="/modify-webstore">
                <button className={styles.button}>Modify Web Store</button>
            </Link>
            <button className={styles.button} onClick={handleDelete}>Delete Web Store</button>
            <input type="file" onChange={handleImageUpload} className={styles.fileInput} />
            <div className={styles.imagesContainer}>
                <h2 className={styles.subtitle}>Uploaded Images</h2>
                {store.imagesArray?.length > 0 ? (
                    store.imagesArray.map((image, index) => (
                        <img
                            key={index}
                            src={`http://localhost:3000/${image.replace('\\', '/')}`}
                            alt={`Uploaded ${index}`}
                            className={styles.image}
                        />
                    ))
                ) : (
                    <p>No images uploaded</p>
                )}
            </div>
            <div className={styles.textContainer}>
                <h2 className={styles.subtitle}>Texts</h2>
                {store.textsArray?.length > 0 ? (
                    store.textsArray.map((text, index) => <p key={index}>{text}</p>))
                : (
                    <p>No texts added</p>
                )}
            </div>
            <form onSubmit={handleAddText} className={styles.form}>
                <input
                    type="text"
                    placeholder="Add Text"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    required
                    className={styles.textInput}
                />
                <button type="submit" className={styles.button}>Add Text</button>
            </form>
        </div>
    );
};

export default ManageWebStore;