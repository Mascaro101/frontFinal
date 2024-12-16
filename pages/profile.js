import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/Profile.module.css'; // Importing the CSS module
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
                        Authorization: `Bearer ${token}`,
                    },
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
                    Authorization: `Bearer ${token}`,
                },
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
            await axios.put(
                'http://localhost:3000/api/user/modify',
                {
                    username,
                    email,
                    password,
                    age,
                    city,
                    interests,
                    allowOffer,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUser({ ...user, username, email, password, age, city, interests, allowOffer });
        } catch (err) {
            setError(err.message);
            console.error('Error modifying user:', err);
        }
    };

    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!user) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles['profile-container']}>
            <h1 className={styles['title']}>User Profile</h1>
            <input
                className={styles['input']}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className={styles['input']}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                className={styles['input']}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <input
                className={styles['input']}
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
            />
            <input
                className={styles['input']}
                type="text"
                value={interests.join(', ')}
                onChange={(e) => setInterests(e.target.value.split(', '))}
                placeholder="Interests (comma separated)"
            />
            <label className={styles['label']}>
                <input
                    type="checkbox"
                    checked={allowOffer}
                    onChange={(e) => setAllowOffer(e.target.checked)}
                />
                Allow Offers
            </label>
            <button className={styles['button']} onClick={handleSave}>
                Save
            </button>
            <button className={`${styles['button']} ${styles['delete']}`} onClick={handleDelete}>
                Delete User
            </button>
        </div>
    );
};

export default Profile;
