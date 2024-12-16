import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const DeleteStore = () => {
    const [CIF, setCIF] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.delete('http://localhost:3000/api/store', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    cif: CIF
                }
            });
            router.push('/stores');
        } catch (err) {
            console.error('Error deleting store:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Delete Store</h1>
            <input type="text" placeholder="CIF" value={CIF} onChange={(e) => setCIF(e.target.value)} required />
            <button type="submit">Delete Store</button>
        </form>
    );
};

export default DeleteStore;