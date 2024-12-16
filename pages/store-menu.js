import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

const StoreMenu = () => {
    const [store, setStore] = useState(null);
    const [error, setError] = useState(null);
    const [newText, setNewText] = useState('');
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
            const token = localStorage.getItem('storeToken');
            const endpoint = `http://localhost:3000/api/webStore/${store.CIF}/uploadImage`;

            console.log('Uploading image to:', endpoint); // Debug log

            const response = await axios.patch(endpoint, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Image upload response:', response.data); // Debug log
            await fetchWebStore();
        } catch (err) {
            console.error('Error uploading image:', err.response || err.message);
            setError(err.response?.data?.error || 'Error uploading image');
        }
    };

    const handleAddText = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('storeToken');
            const endpoint = `http://localhost:3000/api/webStore/${store.CIF}/uploadText`;

            console.log('Adding text to:', endpoint); // Debug log
            const response = await axios.patch(endpoint, { text: newText }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Add text response:', response.data); // Debug log
            setNewText('');
            await fetchWebStore();
        } catch (err) {
            console.error('Error adding text:', err.response || err.message);
            setError(err.response?.data?.error || 'Error adding text');
        }
    };

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

    if (error) return <div>Error: {error}</div>;
    if (!store) return <div>Loading...</div>;

    return (
        <div>
            <h1>Store Menu</h1>
            <p><strong>Store Name:</strong> {store.title}</p>
            <p><strong>Store ID:</strong> {store.CIF}</p>
            <p><strong>City:</strong> {store.city}</p>
            <p><strong>Activity:</strong> {store.activity}</p>
            <p><strong>Resume:</strong> {store.resume}</p>
            <p><strong>Created At:</strong> {new Date(store.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(store.updatedAt).toLocaleString()}</p>
            <Link href="/create-webstore">
                <button>Create Web Store</button>
            </Link>
            <Link href="/modify-webstore">
                <button>Modify Web Store</button>
            </Link>
            <button onClick={handleDelete}>Delete Web Store</button>

            <input type="file" onChange={handleImageUpload} />
            <div>
                <h2>Uploaded Images</h2>
                {store.imagesArray?.length > 0 ? (
                    store.imagesArray.map((image, index) => (
                        <img
                            key={index}
                            src={`http://localhost:3000/${image.replace('\\', '/')}`}
                            alt={`Uploaded ${index}`}
                            style={{ width: '100px', height: '100px', margin: '10px' }}
                        />
                    ))
                ) : (
                    <p>No images uploaded</p>
                )}
            </div>
            <div>
                <h2>Texts</h2>
                {store.textsArray?.length > 0 ? (
                    store.textsArray.map((text, index) => <p key={index}>{text}</p>)
                ) : (
                    <p>No texts added</p>
                )}
            </div>
            <form onSubmit={handleAddText}>
                <input
                    type="text"
                    placeholder="Add Text"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    required
                />
                <button type="submit">Add Text</button>
            </form>
            <button onClick={handleFetchUsers}>Get Users in Same City</button>
            <div>
                <h2>Users in Same City</h2>
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <div key={index}>
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
