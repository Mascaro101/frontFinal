"use client";
import Link from "next/link";
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
    const [newReview, setNewReview] = useState("");
    const [hasRated, setHasRated] = useState(false); // Track if the user has rated the store

    useEffect(() => {
        // Fetch web stores from the backend
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

            // Decode the token to check the user role
            try {
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
            } catch (err) {
                console.error("Error decoding token:", err);
            }
        }

        if (storeToken) {
            setStoreToken(storeToken);
        }
    }, []);

    const handleWebStoreClick = async (storeId) => {
        if (selectedWebStore?.storeId === storeId) {
            setSelectedWebStore(null); // Collapse the details
        } else {
            try {
                const response = await axios.get(`http://localhost:3000/api/webStore/${storeId}`);
                setSelectedWebStore(response.data); // Display the details
                setHasRated(false); // Reset the rating status when selecting a new store
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleAddReview = async () => {
        if (!newReview.trim() || !selectedWebStore) {
            console.log("Review is empty or no store selected");
            return;
        }

        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in to add a review.");
            return; // Stop if no token is found
        }

        console.log("Submitting review:", newReview);

        try {
            // Check request data being sent
            console.log("Request data:", { review: newReview, storeId: selectedWebStore.storeId });

            const response = await axios.patch(
                `http://localhost:3000/api/webStore/${selectedWebStore.storeId}/addReview`,
                { review: newReview },
                { headers: { Authorization: `Bearer ${token}` } } // Send token in the headers
            );
            
            console.log("Review added successfully:", response.data);

            // Fetch updated store details to show new review
            const updatedStoreResponse = await axios.get(`http://localhost:3000/api/webStore/${selectedWebStore.storeId}`);
            console.log("Updated store data after review:", updatedStoreResponse.data);

            setSelectedWebStore(updatedStoreResponse.data); // Update store with new review
            setNewReview(""); // Clear input field after review
        } catch (err) {
            console.error("Error adding review:", err.message);
            setError(err.message);  // Set the error state if something goes wrong
        }
    };

    const handleRatingChange = async (change) => {
        if (hasRated) {
            alert("You have already rated this store.");
            return; // Prevent rating if the user has already rated
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in to rate the store.");
            return; // Stop if no token is found
        }

        try {
            // Send rating change request to the backend
            const response = await axios.patch(
                `http://localhost:3000/api/webStore/${selectedWebStore.storeId}/rate`,
                { change },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Rating updated successfully:", response.data);

            // Fetch updated store details to show the new rating
            const updatedStoreResponse = await axios.get(`http://localhost:3000/api/webStore/${selectedWebStore.storeId}`);
            console.log("Updated store data after rating:", updatedStoreResponse.data);

            setSelectedWebStore(updatedStoreResponse.data); // Update store with new rating
            setHasRated(true); // Mark that the user has rated the store
        } catch (err) {
            console.error("Error updating rating:", err.message);
            setError(err.message);  // Set the error state if something goes wrong
        }
    };

    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.page}>
            <nav className={styles.nav}>
                <ul>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/register">Register</a></li>
                    {userToken && !storeToken && <li><a href="/profile">Personal Profile</a></li>}
                    {storeToken && <li><Link href="/store-menu">Store Menu</Link></li>}
                    {isAdmin && <li><a href="/stores">Stores</a></li>}
                </ul>
            </nav>

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

                                        <div className={styles.addReview}>
                                            <h3>Add a Review:</h3>
                                            <textarea
                                                value={newReview}
                                                onChange={(e) => setNewReview(e.target.value)}
                                                placeholder="Write your review here..."
                                                className={styles.reviewInput}
                                            />
                                            <button onClick={handleAddReview} className={styles.reviewButton}>
                                                Submit Review
                                            </button>

                                            <h3>Rate this store:</h3>
                                            <button onClick={() => handleRatingChange(1)} className={styles.likeButton} disabled={hasRated}>
                                                👍 Like
                                            </button>
                                            <button onClick={() => handleRatingChange(-1)} className={styles.dislikeButton} disabled={hasRated}>
                                                👎 Dislike
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No web stores available</p>
                )}
            </main>

            <footer className={styles.footer}>
                <a href="#">About</a>
                <a href="#">Contact</a>
                <a href="#">Privacy</a>
            </footer>
        </div>
    );
};

export default Home;

