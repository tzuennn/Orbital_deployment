import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Zoom>
            <img src={imageUrl} alt="Enlarged view" style={{ width: '100%', maxHeight: '80vh' }} />
          </Zoom>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
