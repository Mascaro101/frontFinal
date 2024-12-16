import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [city, setCity] = useState('');
    const [interests, setInterests] = useState([]);
    const [allowOffer, setAllowOffer] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                // Fetch user profile information
                const response = await axios.get('http://localhost:3000/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
                setUsername(response.data.username);
                setEmail(response.data.email);
                setPassword(response.data.password);
                setAge(response.data.age);
                setCity(response.data.city);
                setInterests(response.data.interests || []);
                setAllowOffer(response.data.allowOffer);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching user profile:', err);
            }
        };
        fetchUserProfile();
    }, [router]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete('http://localhost:3000/api/user/delete', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            localStorage.removeItem('token');
            router.push('/register');
        } catch (err) {
            setError(err.message);
            console.error('Error deleting user:', err);
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:3000/api/user/modify', {
                username,
                email,
                password,
                age,
                city,
                interests,
                allowOffer
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser({ ...user, username, email, password, age, city, interests, allowOffer });
        } catch (err) {
            setError(err.message);
            console.error('Error modifying user:', err);
        }
    };

    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>User Profile</h1>
            <p><strong>Username:</strong> {user.username}</p>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
            />
            <input
                type="text"
                value={interests.join(', ')}
                onChange={(e) => setInterests(e.target.value.split(', '))}
                placeholder="Interests (comma separated)"
            />
            <label>
                <input
                    type="checkbox"
                    checked={allowOffer}
                    onChange={(e) => setAllowOffer(e.target.checked)}
                />
                Allow Offers
            </label>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleDelete}>Delete User</button>
        </div>
    );
};

export default Profile;