/**
 * @flow
 */
export type AttribsType = {
  type: string,
  id: string,
  src: string;
  width: string;
  height: string;
}

export type NodeType = {
  name: string,
  attribs: AttribsType,
  children?: Array<NodeType>,
  type: string,
  data: string,
}

export type AttachmentType = {
  id: string,
  src: string,
  height: number,
  width: number,
}

export type AttachmentsType = {
  videos?: Array<AttachmentType>,
  images?: Array<AttachmentType>,
}

