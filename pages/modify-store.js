import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const ModifyStore = () => {
    const [CIF, setCIF] = useState('');
    const [storeName, setStoreName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [pageId, setPageId] = useState('');
    const router = useRouter();

    const handleFetch = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/store/${CIF}`);
            const store = response.data;
            setStoreName(store.storeName);
            setAddress(store.address);
            setCity(store.city);
            setEmail(store.email);
            setContactNumber(store.contactNumber);
            setPageId(store.pageId);
        } catch (err) {
            console.error('Error fetching store:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/store/${CIF}`, {
                storeName,
                address,
                city,
                email,
                contactNumber,
                pageId,
                updatedAt: new Date().toISOString()
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/stores');
        } catch (err) {
            console.error('Error modifying store:', err);
        }
    };

    return (
        <div>
            <h1>Modify Store</h1>
            <input type="text" placeholder="CIF" value={CIF} onChange={(e) => setCIF(e.target.value)} required />
            <button onClick={handleFetch}>Fetch Store</button>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
                <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="text" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
                <input type="number" placeholder="Page ID" value={pageId} onChange={(e) => setPageId(e.target.value)} required />
                <button type="submit">Modify Store</button>
            </form>
        </div>
    );
};

export default ModifyStore;