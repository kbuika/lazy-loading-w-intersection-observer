import { useState, useRef, useCallback, useEffect } from "react";
import "./App.css";
import photos from "./data/photos";

export default function App() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [nextPhotoUrl, setNextPhotoUrl] = useState(null);
  const [scrollPosition] = useState(0);
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const photoIndexRef = useRef(0);

  const handleImageLoad = useCallback((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.onload = () => {
          img.classList.remove("loading");
          img.classList.add("loaded");
        };
        img.onerror = () => img.classList.add("error");
        img.classList.add("loading");
        observer.unobserve(img);
      }
    });
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleImageLoad, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    const images = document.querySelectorAll(".lazy-image");
    images.forEach((image) => observerRef.current.observe(image));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleImageLoad]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedPhoto) {
        if (event.key === "ArrowLeft") {
          // navigate to the previous photo
          photoIndexRef.current =
            photoIndexRef.current === 0
              ? photos.length - 1
              : photoIndexRef.current - 1;
        } else if (event.key === "ArrowRight") {
          // navigate to the next photo
          photoIndexRef.current =
            photoIndexRef.current === photos.length - 1
              ? 0
              : photoIndexRef.current + 1;
        }
        setSelectedPhoto(photos[photoIndexRef.current]);
        preloadNextPhoto(); // reduces loading delay on next photo
      }
    };

    const preloadNextPhoto = () => {
      const nextIndex =
        photoIndexRef.current === photos.length - 1
          ? 0
          : photoIndexRef.current + 1;
      setNextPhotoUrl(photos[nextIndex].urls.full);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhoto]);

  useEffect(() => {
    if (selectedPhoto) {
      containerRef.current.style.overflow = "hidden";
    } else {
      containerRef.current.style.overflow = "auto";
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [selectedPhoto, scrollPosition]);

  const handlePhotoClick = (photo, index) => {
    setSelectedPhoto(photo);
    photoIndexRef.current = index;
  };

  const handleCloseFullView = () => {
    setSelectedPhoto(null);
  };

  const handlePrevPhoto = () => {
    const currentIndex = photos.findIndex(
      (photo) => photo.id === selectedPhoto.id
    );
    if (currentIndex > 0) {
      setSelectedPhoto(photos[currentIndex - 1]);
    }
  };

  const handleNextPhoto = () => {
    const currentIndex = photos.findIndex(
      (photo) => photo.id === selectedPhoto.id
    );
    if (currentIndex < photos.length - 1) {
      setSelectedPhoto(photos[currentIndex + 1]);
      setNextPhotoUrl(photos[currentIndex + 2].urls.full); // pre-load the next photo
    }
  };

  return (
    <div className="App">
      <h3>Photos courtesy of Unsplash and it&apos;s users</h3>
      <div className="container" ref={containerRef}>
        {photos.map((p, index) => (
          <div className="display-flex" key={p.id}>
            <button className="btn" onClick={() => handlePhotoClick(p, index)}>
              <img
                data-src={p.urls.thumb}
                src="https://images.unsplash.com/photo-1604147706283-d7119b5b822c"
                alt={`photo taken by ${p.user.name}`}
                className="lazy-image"
              />
            </button>
          </div>
        ))}
      </div>
      {selectedPhoto && (
        <div className="full-view">
          <button className="nav-button left" onClick={handlePrevPhoto}>
            &lt;
          </button>
          <img
            src={selectedPhoto.urls.full}
            alt={selectedPhoto.alt_description}
          />
          <button
            className="nav-button back-button"
            onClick={handleCloseFullView}
          >
            <span>&#8592;</span>
          </button>
          <button className="nav-button right" onClick={handleNextPhoto}>
            &gt;
          </button>
        </div>
      )}
      {nextPhotoUrl && (
        <img
          src={nextPhotoUrl}
          alt=""
          style={{ display: "none" }}
          className="preload-image"
        />
      )}
    </div>
  );
}
