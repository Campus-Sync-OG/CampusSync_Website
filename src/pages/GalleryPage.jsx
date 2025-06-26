import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { FaPlay, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchGalleryImages } from "../api/ClientApi"; // Adjust the import path as needed

// Styled Components
const Container = styled.div`
  padding: 0 15px;
  background: white;
  border-radius: 8px;

  height: 80vh; /* Full viewport height */
  overflow-y: auto; /* Enable scrolling */
  -ms-overflow-style: none; /* Hide scrollbar in Internet Explorer */
  scrollbar-width: none; /* Hide scrollbar in Firefox */

  /* Hide scrollbar for WebKit browsers */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  background: linear-gradient(90deg, #002087, #df0043);
  border-radius: 10px;
  color: white;
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins";
`;

const Icons = styled.div`
  display: flex;
  gap: 15px;
  cursor: pointer;
`;
const Divider = styled.div`
  width: 2px;
  height: 20px;
  background-color: white;
  margin: 0 10px;
`;

const Banner = styled.div`
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin: 10px 0;
`;

const Video = styled.video`
  width: 100%;
  border-radius: 8px;
`;

const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 15px;
  border-radius: 50%;
  font-size: 24px;
  border: none;
  cursor: pointer;
  display: ${(props) => (props.show ? "block" : "none")};
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const GalleryItem = styled.img`
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
  height: 100px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

// Modal Styles
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9); /* Darker background */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Ensure it's above everything */
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalImage = styled.img`
  width: auto;
  max-width: 95%;
  height: auto;
  max-height: 95%;
  border-radius: 8px;
`;

const CloseButton = styled(FaTimes)`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 28px;
  color: white;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 50%;
`;

const IconImage = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const VideoItem = styled.video`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const GalleryPage = () => {
  const navigate = useNavigate();
  const [modalMedia, setModalMedia] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const images = await fetchGalleryImages();
        setGalleryImages(images || []);
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  return (
    <Container>
      {/* Header */}
      <Header>
        <span>School Gallery</span>
        <Icons>
          <Link to="/dashboard">
            <IconImage src={home} alt="home" />
          </Link>
          <Divider />
          <Icons onClick={() => navigate(-1)}>
            <IconImage src={back} alt="back" />
          </Icons>
        </Icons>
      </Header>

      {/* Video Banner */}
      {!loading && galleryImages.length > 0 && (() => {
        const firstVideo = galleryImages.find(item =>
          item.url.endsWith(".mp4")
        );
        return firstVideo ? (
          <Banner>
            <Video controls>
              <source src={firstVideo.url} type="video/mp4" />
              Your browser does not support the video tag.
            </Video>
          </Banner>
        ) : null;
      })()}

      {/* Gallery Grid */}
      <GalleryGrid>
        {loading ? (
          <p>Loading gallery...</p>
        ) : (
          galleryImages
            .filter((item, index, arr) => {
              // Remove the first video shown in banner from the grid
              const firstVideoIndex = arr.findIndex(i => i.url.endsWith(".mp4"));
              return !(item.url.endsWith(".mp4") && index === firstVideoIndex);
            })
            .map((item, index) => {
              const isVideo = item.url.endsWith(".mp4");
              const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(item.metadata?.originalName || "");

              if (isVideo) {
                return (
                  <VideoItem
                    key={index}
                    src={item.url}
                    onClick={() => setModalMedia({ type: "video", url: item.url })}
                    controls
                  />
                );
              }

              if (isImage) {
                return (
                  <GalleryItem
                    key={index}
                    src={item.url}
                    alt={item.metadata?.originalName || `Gallery ${index + 1}`}
                    onClick={() => setModalMedia({ type: "image", url: item.url })}
                  />
                );
              }

              return null;
            })
        )}
      </GalleryGrid>

      {/* Modal */}
      {modalMedia && (
        <Modal onClick={() => setModalMedia(null)}>
          <ModalContent>
            <CloseButton onClick={() => setModalMedia(null)}>×</CloseButton>
            {modalMedia.type === "image" ? (
              <ModalImage src={modalMedia.url} alt="Preview" />
            ) : (
              <ModalVideo controls autoPlay>
                <source src={modalMedia.url} type="video/mp4" />
              </ModalVideo>
            )}
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default GalleryPage;