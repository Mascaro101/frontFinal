import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const CreateWebStore = () => {
    const [storeName, setStoreName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [pageId, setPageId] = useState('');
    const [title, setTitle] = useState('');
    const [activity, setActivity] = useState('');
    const [resume, setResume] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('storeToken');
            await axios.post('http://localhost:3000/api/webStore', {
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
            console.error('Error creating web store:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create Web Store</h1>
            <input type="text" placeholder="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="text" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
            <input type="number" placeholder="Page ID" value={pageId} onChange={(e) => setPageId(e.target.value)} required />
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="text" placeholder="Activity" value={activity} onChange={(e) => setActivity(e.target.value)} required />
            <input type="text" placeholder="Resume" value={resume} onChange={(e) => setResume(e.target.value)} required />
            <button type="submit">Create Web Store</button>
        </form>
    );
};

export default CreateWebStore;