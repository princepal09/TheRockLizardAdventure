export type GalleryImageInput = {
  altText: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type GalleryImage = GalleryImageInput & {
  id: string;
  imageUrl: string;
};
