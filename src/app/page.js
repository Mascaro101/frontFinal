"use client";
import Link from 'next/link';
import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

const Home = () => {
    const [webStores, setWebStores] = useState([]);
    const [selectedWebStore, setSelectedWebStore] = useState(null);
    const [error, setError] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [storeToken, setStoreToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [storeMenu, setStoreMenu] = useState(null);

    useEffect(() => {
        const fetchWebStores = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/webStore");
                setWebStores(response.data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchWebStores();

        // Retrieve tokens from local storage
        const token = localStorage.getItem("token");
        const storeToken = localStorage.getItem("storeToken");

        if (token) {
            setUserToken(token);

            // Decode the token to check user role
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            const decodedToken = JSON.parse(jsonPayload);

            if (decodedToken.role === "admin") {
                setIsAdmin(true);
            }
        }

        if (storeToken) {
            setStoreToken(storeToken);
        }
    }, []);

    const handleWebStoreClick = async (storeId) => {
        // Toggle selection if already selected
        if (selectedWebStore?.storeId === storeId) {
            setSelectedWebStore(null); // Collapse the details
        } else {
            try {
                const response = await axios.get(`http://localhost:3000/api/webStore/${storeId}`);
                setSelectedWebStore(response.data); // Display the details
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleStoreMenuClick = async () => {
        // Fetch and display store menu if storeToken exists
        if (storeToken) {
            try {
                const response = await axios.get("http://localhost:3000/store-menu", {
                    headers: { Authorization: `Bearer ${storeToken}` },
                });
                setStoreMenu(response.data);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.page}>
            {/* Navigation Bar */}
            <nav className={styles.nav}>
                <ul>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/register">Register</a></li>
                    {userToken && !storeToken && <li><a href="/profile">Personal Profile</a></li>}
                    {storeToken && <li><Link href="/store-menu">Store Menu</Link></li>}
                    {isAdmin && <li><a href="/stores">Stores</a></li>}
                </ul>
            </nav>

            {/* Main Content */}
            <main className={styles.main}>
                <h1>Available Web Stores</h1>
                {webStores.length > 0 ? (
                    <ul>
                        {webStores.map((webStore) => (
                            <li key={webStore.storeId}>
                                <button
                                    onClick={() => handleWebStoreClick(webStore.storeId)}
                                    className={styles.storeButton}
                                >
                                    {webStore.title || "Unnamed Store"}
                                </button>
                                {/* Show details only if this store is selected */}
                                {selectedWebStore?.storeId === webStore.storeId && (
                                    <div className={styles.storeDetails}>
                                        <h2>{selectedWebStore.title || "Unnamed Store"}</h2>
                                        <p><strong>Activity:</strong> {selectedWebStore.activity}</p>
                                        <p><strong>City:</strong> {selectedWebStore.city}</p>
                                        <p><strong>Resume:</strong> {selectedWebStore.resume}</p>

                                        <h3>Images:</h3>
                                        <div className={styles.images}>
                                            {selectedWebStore.imagesArray.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={`http://localhost:3000/${image}`}
                                                    alt={`Store Image ${index + 1}`}
                                                    className={styles.storeImage}
                                                />
                                            ))}
                                        </div>

                                        <h3>Texts:</h3>
                                        <ul>
                                            {selectedWebStore.textsArray.map((text, index) => (
                                                <li key={index}>{text}</li>
                                            ))}
                                        </ul>

                                        <h3>Reviews:</h3>
                                        <p><strong>Scoring:</strong> {selectedWebStore.reviews.scoring}</p>
                                        <p><strong>Total Ratings:</strong> {selectedWebStore.reviews.totalRatings}</p>
                                        <ul>
                                            {selectedWebStore.reviews.reviews.length > 0 ? (
                                                selectedWebStore.reviews.reviews.map((review, index) => (
                                                    <li key={index}>{review}</li>
                                                ))
                                            ) : (
                                                <li>No reviews available</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No web stores available</p>
                )}

                {/* Store Menu Section */}
                {storeMenu && (
                    <div className={styles.storeMenu}>
                        <h2>Store Menu</h2>
                        <ul>
                            {storeMenu.items.map((item, index) => (
                                <li key={index}>
                                    {item.name} - ${item.price}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <a href="#">About</a>
                <a href="#">Contact</a>
                <a href="#">Privacy</a>
            </footer>
        </div>
    );
};

export default Home;
