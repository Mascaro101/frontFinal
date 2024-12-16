import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Register.module.css'; // Import CSS file

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [city, setCity] = useState('');
    const [interests, setInterests] = useState('');
    const [allowOffer, setAllowOffer] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/user/register', {
                name,
                email,
                password,
                age: parseInt(age),
                city,
                interests: interests.split(',').map((interest) => interest.trim()),
                allowOffer,
            });
            console.log('Registration successful:', response.data);
            router.push('/login');
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={styles.title}>Register</h1>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.input}
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
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
                    type="text"
                    placeholder="Interests (comma separated)"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    required
                    className={styles.input}
                />
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={allowOffer}
                        onChange={(e) => setAllowOffer(e.target.checked)}
                        className={styles.checkbox}
                    />
                    Allow Offers
                </label>
                <button type="submit" className={styles.button}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
