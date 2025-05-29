import React, { useRef, useState } from "react";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { FaPlay, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Styled Components
const Container = styled.div`
  max-width: 900px;
  margin: auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  height: 100vh; /* Full viewport height */
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
  padding: 15px 20px;
  background: linear-gradient(
    90deg,
    rgba(0, 32, 135, 1) 31%,
    /* 100% opacity */ rgba(0, 32, 135, 0.69) 69%,
    /* 69% opacity */ #df0043 100%
  );
  border-radius: 8px 8px 0 0;
  color: white;
  font-size: 18px;
  font-weight: bold;
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

const GalleryPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [modalImage, setModalImage] = useState(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setShowPlayButton(false);
    }
  };
  const imageUrls = [
    "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg", // Laptop on Desk
    "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg", // Office Setup
    "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg", // Mountain View
    "https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg", // City at Night
    "https://images.pexels.com/photos/34950/pexels-photo.jpg", // Ocean View
    "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg", // Forest Path
    "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg", // Beach Scene
  ];

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
      <Banner>
        <Video ref={videoRef} controls>
          <source
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </Video>
        <PlayButton show={showPlayButton} onClick={handlePlayVideo}>
          <FaPlay />
        </PlayButton>
      </Banner>

      <GalleryGrid>
        {imageUrls.map((url, index) => (
          <GalleryItem
            key={index}
            src={url}
            alt={`Gallery Image ${index + 1}`}
            onClick={() => setModalImage(url)}
          />
        ))}
      </GalleryGrid>

      {/* Image Modal */}
      {modalImage && (
        <Modal onClick={() => setModalImage(null)}>
          <ModalContent>
            <CloseButton onClick={() => setModalImage(null)} />
            <ModalImage src={modalImage} alt="Gallery Preview" />
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default GalleryPage;
