/**
 * @flow
 */

import React from 'react';
import {
  Dimensions,
} from 'react-native';

import { ImagePreview } from '../../ImagePreview';
import { Video } from '../../Video/Video';
import { ImageGallery } from '../../ImageGallery';

import type {
  AttachmentsType,
  NodeType,
} from './types';

const FALLBACK_ATTACHMENT_HEIGHT = 250;
const windowWidth = Dimensions.get('window').width;

// TODO(Vladimir) - split into multiple files, each implementing the TagTransformer interface
export default class AttachmentTagTransformer {
  attachments: AttachmentsType;

  constructor(attachments: AttachmentsType) {
    this.attachments = attachments;
  }

  canTransform(node: NodeType): boolean {
    return (node.name === 'se-attachment' && !!node.attribs);
  }

  transform(_: any, node: NodeType, style: any) : any {
    const id = node.attribs.id;

    function transformImageAttachment(attachedImage) {
      const imageWidth = (windowWidth < attachedImage.width) ? windowWidth : attachedImage.width;
      const imageScale = imageWidth / attachedImage.width;
      const { img } = style;
      const { marginLeft, marginRight } = img;
      const elementToWindowBorderDistance = marginLeft + marginRight;

      return [
        <ImagePreview
          style={style.img}
          source={{ uri: attachedImage.src }}
          width={imageWidth - elementToWindowBorderDistance}
          height={(attachedImage.height - elementToWindowBorderDistance) * imageScale}
          key={0}
        />,
      ];
    }

    function transformGalleryAttachment(galleryNode) {
      const attachedGallery = galleryNode.attribs;
      let galleryWidth = windowWidth;
      let galleryScale = 1;

      if (!!attachedGallery.width && windowWidth < attachedGallery.width) {
        galleryWidth = attachedGallery.width;
        galleryScale = galleryWidth / attachedGallery.width;
      }

      const galleryHeight = attachedGallery.height || FALLBACK_ATTACHMENT_HEIGHT;
      const { gallery } = style;
      const { marginLeft, marginRight } = gallery;
      const elementToWindowBorderDistance = marginLeft + marginRight || 0;
      const imageSources = galleryNode.children
                .filter(child => child.name === 'se-attachment' && child.attribs.type === 'image')
                .map(child => child.attribs.src)
                .filter(imageUrl => imageUrl);

      return [
        <ImageGallery
          style={style.gallery}
          sources={imageSources}
          width={galleryWidth - elementToWindowBorderDistance}
          height={(galleryHeight - elementToWindowBorderDistance) * galleryScale}
          key={0}
        />,
      ];
    }

    function transformVideoAttachment(attachedVideo) {
      let videoWidth = windowWidth;
      let videoScale = 1;

      if (!!attachedVideo.width && windowWidth < attachedVideo.width) {
        videoWidth = attachedVideo.width;
        videoScale = videoWidth / attachedVideo.width;
      }

      const videoHeight = attachedVideo.height || FALLBACK_ATTACHMENT_HEIGHT;

      const { video } = style;
      const { marginLeft, marginRight } = video;
      const elementToWindowBorderDistance = marginLeft + marginRight;

      return [
        <Video
          style={style.video}
          source={attachedVideo.src}
          width={videoWidth - elementToWindowBorderDistance}
          height={(videoHeight - elementToWindowBorderDistance) * videoScale}
          key={0}
        />,
      ];
    }

    if (node.attribs.type === 'image' && this.attachments && this.attachments.images) {
      const attachedImage = this.attachments.images.find((image) => image.id === id);
      return transformImageAttachment(attachedImage);
    }

    if (node.attribs.type === 'video' && this.attachments && this.attachments.videos) {
      const attachedVideo = this.attachments.videos.find((video) => video.id === id);
      return transformVideoAttachment(attachedVideo);
    }

    if (node.attribs.type === 'video' && node.attribs.src) {
      const attachedVideo = node.attribs;
      return transformVideoAttachment(attachedVideo);
    }

    if (node.attribs.type === 'gallery') {
      return transformGalleryAttachment(node);
    }

    return null;
  }
}

