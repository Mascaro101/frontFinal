import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const CreateStore = () => {
    const [storeName, setStoreName] = useState('');
    const [CIF, setCIF] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [pageId, setPageId] = useState('');
    const [storeToken, setStoreToken] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/api/store', {
                storeName,
                CIF,
                address,
                city,
                email,
                contactNumber,
                pageId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setStoreToken(response.data.token);
            // Optionally, you can redirect to the stores page
            // router.push('/stores');
        } catch (err) {
            console.error('Error creating store:', err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Create Store</h1>
                <input type="text" placeholder="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
                <input type="text" placeholder="CIF" value={CIF} onChange={(e) => setCIF(e.target.value)} required />
                <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="text" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
                <input type="number" placeholder="Page ID" value={pageId} onChange={(e) => setPageId(e.target.value)} required />
                <button type="submit">Create Store</button>
            </form>
            {storeToken && (
                <div>
                    <h2>Store Token</h2>
                    <p>{storeToken}</p>
                </div>
            )}
        </div>
    );
};

export default CreateStore;