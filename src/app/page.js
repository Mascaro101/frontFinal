"use client";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

const Home = () => {
    const [webStores, setWebStores] = useState([]);
    const [groupedWebStoresByCity, setGroupedWebStoresByCity] = useState({});
    const [groupedWebStoresByActivity, setGroupedWebStoresByActivity] = useState({});
    const [selectedWebStore, setSelectedWebStore] = useState(null);
    const [error, setError] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [storeToken, setStoreToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [newReview, setNewReview] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [hasRated, setHasRated] = useState(false);
    const [enlargedImage, setEnlargedImage] = useState(null);

    useEffect(() => {
        const fetchWebStores = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/webStore");
                const sortedStores = sortWebStores(response.data, "newest");
                setWebStores(sortedStores);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchWebStores();

        const token = localStorage.getItem("token");
        const storeToken = localStorage.getItem("storeToken");

        if (token) {
            setUserToken(token);
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

    const sortWebStores = (stores, order) => {
        if (order === "city") {
            const groupedByCity = stores.reduce((acc, store) => {
                if (!acc[store.city]) acc[store.city] = [];
                acc[store.city].push(store);
                return acc;
            }, {});
            setGroupedWebStoresByCity(groupedByCity);
            return stores;
        }

        if (order === "activity") {
            const groupedByActivity = stores.reduce((acc, store) => {
                if (!acc[store.activity]) acc[store.activity] = [];
                acc[store.activity].push(store);
                return acc;
            }, {});
            setGroupedWebStoresByActivity(groupedByActivity);
            return stores;
        }

        if (order === "rating") {
            return [...stores].sort((a, b) => b.reviews.scoring - a.reviews.scoring);
        }

        return [...stores].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return order === "newest" ? dateB - dateA : dateA - dateB;
        });
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
        const sortedStores = sortWebStores(webStores, order);
        setWebStores(sortedStores);
    };

    const handleWebStoreClick = async (storeId) => {
        if (selectedWebStore?.storeId === storeId) {
            setSelectedWebStore(null);
        } else {
            try {
                const response = await axios.get(`http://localhost:3000/api/webStore/${storeId}`);
                setSelectedWebStore(response.data);
                setHasRated(false);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleAddReview = async () => {
        if (!newReview.trim() || !selectedWebStore) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to add a review.");
            return;
        }

        try {
            await axios.patch(
                `http://localhost:3000/api/webStore/${selectedWebStore.storeId}/addReview`,
                { review: newReview },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedStore = await axios.get(`http://localhost:3000/api/webStore/${selectedWebStore.storeId}`);
            setSelectedWebStore(updatedStore.data);
            setNewReview("");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRatingChange = async (change) => {
        if (hasRated) {
            alert("You have already rated this store.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to rate the store.");
            return;
        }

        try {
            await axios.patch(
                `http://localhost:3000/api/webStore/${selectedWebStore.storeId}/rate`,
                { change },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedStore = await axios.get(`http://localhost:3000/api/webStore/${selectedWebStore.storeId}`);
            setSelectedWebStore(updatedStore.data);
            setHasRated(true);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleImageClick = (image) => setEnlargedImage(image);
    const handleCloseImage = () => setEnlargedImage(null);

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

                <div className={styles.sortOptions}>
                    <label>Sort by:</label>
                    {["newest", "oldest", "city", "activity", "rating"].map((order) => (
                        <button
                            key={order}
                            onClick={() => handleSortChange(order)}
                            className={sortOrder === order ? styles.activeSortButton : styles.sortButton}
                        >
                            {order.charAt(0).toUpperCase() + order.slice(1)}
                        </button>
                    ))}
                </div>

                {sortOrder === "city" || sortOrder === "activity"
                    ? Object.entries(sortOrder === "city" ? groupedWebStoresByCity : groupedWebStoresByActivity).map(([key, stores]) => (
                          <div key={key}>
                              <h2>{key}</h2>
                              <ul>
                                  {stores.map((store) => (
                                      <li key={store.storeId}>
                                          <button onClick={() => handleWebStoreClick(store.storeId)}>
                                              {store.title || "Unnamed Store"}
                                          </button>
                                          {selectedWebStore?.storeId === store.storeId && (
                                              <StoreDetails
                                                  store={selectedWebStore}
                                                  onReviewChange={setNewReview}
                                                  onAddReview={handleAddReview}
                                                  onRate={handleRatingChange}
                                                  newReview={newReview}
                                                  hasRated={hasRated}
                                                  onImageClick={handleImageClick}
                                              />
                                          )}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      ))
                    : webStores.map((store) => (
                          <li key={store.storeId}>
                              <button onClick={() => handleWebStoreClick(store.storeId)}>
                                  {store.title || "Unnamed Store"}
                              </button>
                              {selectedWebStore?.storeId === store.storeId && (
                                  <StoreDetails
                                      store={selectedWebStore}
                                      onReviewChange={setNewReview}
                                      onAddReview={handleAddReview}
                                      onRate={handleRatingChange}
                                      newReview={newReview}
                                      hasRated={hasRated}
                                      onImageClick={handleImageClick}
                                  />
                              )}
                          </li>
                      ))}

                {enlargedImage && (
                    <div className={styles.enlargedImageModal} onClick={handleCloseImage}>
                        <img src={`http://localhost:3000/${enlargedImage}`} alt="Enlarged view" className={styles.enlargedImage} />
                    </div>
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

const StoreDetails = ({ store, onReviewChange, onAddReview, onRate, newReview, hasRated, onImageClick }) => (
    <div className={styles.storeDetails}>
        <h2>{store.title || "Unnamed Store"}</h2>
        <p><strong>Activity:</strong> {store.activity}</p>
        <p><strong>City:</strong> {store.city}</p>
        <p><strong>Resume:</strong> {store.resume}</p>

        <h3>Images:</h3>
        <div className={styles.images}>
            {store.imagesArray.map((image, index) => (
                <img
                    key={index}
                    src={`http://localhost:3000/${image}`}
                    alt={`Store Image ${index + 1}`}
                    className={styles.storeImage}
                    onClick={() => onImageClick(image)}
                />
            ))}
        </div>

        <h3>Texts:</h3>
        <ul>
            {store.textsArray.map((text, index) => (
                <li key={index}>{text}</li>
            ))}
        </ul>

        <h3>Reviews:</h3>
        <p><strong>Scoring:</strong> {store.reviews.scoring}</p>
        <p><strong>Total Ratings:</strong> {store.reviews.totalRatings}</p>
        <ul>
            {store.reviews.reviews.length > 0
                ? store.reviews.reviews.map((review, index) => <li key={index}>{review}</li>)
                : <li>No reviews available</li>}
        </ul>

        <div className={styles.addReview}>
            <h3>Add a Review:</h3>
            <textarea
                value={newReview}
                onChange={(e) => onReviewChange(e.target.value)}
                placeholder="Write your review here..."
                className={styles.reviewInput}
            />
            <button onClick={onAddReview} className={styles.reviewButton}>Submit Review</button>

            <h3>Rate this store:</h3>
            <button onClick={() => onRate(1)} className={styles.likeButton} disabled={hasRated}>👍 Like</button>
            <button onClick={() => onRate(-1)} className={styles.dislikeButton} disabled={hasRated}>👎 Dislike</button>
        </div>
    </div>
);

export default Home;
