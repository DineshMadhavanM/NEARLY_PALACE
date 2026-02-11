import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import { useState, useRef, useEffect } from "react";
import { Upload, Image as ImageIcon, Sparkles, Trash2, Camera } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";

interface ImagePreview {
  id: string;
  file?: File;
  url: string;
  isExisting: boolean;
}

const ImagesSection = () => {
  const {
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useFormContext<HotelFormData>();

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingImageUrls = watch("imageUrls") || [];
  const imageFiles = watch("imageFiles") || [];

  // Track previous state to prevent loops
  const lastStateRef = useRef<string>("");

  useEffect(() => {
    const currentStateStr = JSON.stringify({
      urls: existingImageUrls,
      files: imageFiles.map(f => `${f.name}-${f.size}`)
    });

    if (currentStateStr === lastStateRef.current) return;
    lastStateRef.current = currentStateStr;

    console.log("ImagesSection: Generating previews", {
      existing: existingImageUrls.length,
      new: imageFiles.length
    });

    const newPreviews: ImagePreview[] = [];

    // 1. Existing images
    existingImageUrls.forEach((url, index) => {
      newPreviews.push({
        id: `existing-${index}`,
        url,
        isExisting: true,
      });
    });

    // 2. New file uploads
    imageFiles.forEach((file, index) => {
      newPreviews.push({
        id: `new-${file.name}-${index}`,
        file,
        url: URL.createObjectURL(file), // Re-creating for simplicity now, stability handled by Ref check above
        isExisting: false,
      });
    });

    setImagePreviews(curr => {
      // Revoke old blob URLs before replacing
      curr.forEach(p => {
        if (!p.isExisting) URL.revokeObjectURL(p.url);
      });
      return newPreviews;
    });

  }, [existingImageUrls, imageFiles]);

  const addFiles = (newFiles: File[]) => {
    console.log("ImagesSection: addFiles triggered with", newFiles.length, "files");
    const allFiles = [...imageFiles, ...newFiles];

    if (allFiles.length + existingImageUrls.length > 6) {
      setError("imageFiles", {
        message: "Total number of images cannot be more than 6"
      });
      return;
    }

    setValue("imageFiles", allFiles, { shouldValidate: true });
    clearErrors("imageFiles");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      addFiles(Array.from(files));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    console.log("ImagesSection: handleDrop detected files:", files.length);
    if (files && files.length > 0) {
      addFiles(Array.from(files));
    }
  };

  const handleDeleteImage = (imageId: string) => {
    const imageToDelete = imagePreviews.find((img) => img.id === imageId);
    if (!imageToDelete) return;

    if (imageToDelete.isExisting) {
      const updatedUrls = existingImageUrls.filter((url) => url !== imageToDelete.url);
      setValue("imageUrls", updatedUrls);
    } else {
      const updatedFiles = imageFiles.filter((file) => file !== imageToDelete.file);
      setValue("imageFiles", updatedFiles);
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const totalImages = (existingImageUrls?.length || 0) + (imageFiles?.length || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary-600" />
          Gallery
        </Label>
        <p className="text-slate-500 font-medium">
          Showcase your property with high-quality images. Great photos significantly increase booking rates.
        </p>
      </div>

      <div className="space-y-8">
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        {/* Upload Area */}
        <div
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group relative cursor-pointer border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300
            ${isDragging
              ? "border-primary-500 bg-primary-50 ring-4 ring-primary-100 scale-[1.02]"
              : "border-slate-200 hover:border-primary-400 hover:bg-primary-50/30"
            }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`p-5 rounded-2xl transition-transform duration-300 ${isDragging ? "bg-primary-200 scale-125" : "bg-primary-100/50 group-hover:scale-110"}`}>
              <Upload className={`w-10 h-10 ${isDragging ? "text-primary-700" : "text-primary-600"}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {isDragging ? "Drop images here" : "Click or Drop Images Here"}
              </h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">
                You can upload up to 6 high-resolution images of your hotel. Supported formats: JPG, PNG, WEBP.
              </p>
            </div>
          </div>
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-slate-400" />
                Selected Images
                <span className={`text-sm font-black ml-2 px-2.5 py-0.5 rounded-full ${totalImages > 6 ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"
                  }`}>
                  {totalImages}/6
                </span>
              </h3>
              {totalImages > 6 && (
                <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Maximum 6 images allowed
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {imagePreviews.map((image) => (
                <div
                  key={image.id}
                  className="relative group aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={image.url}
                    alt="Hotel preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteImage(image.id);
                      }}
                      variant="destructive"
                      size="icon"
                      className="w-10 h-10 rounded-full shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Badge
                      className={`
                        text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border-2
                        ${image.isExisting
                          ? "bg-slate-900/80 text-white border-white/20"
                          : "bg-primary-600 text-white border-white/20"}
                      `}
                    >
                      {image.isExisting ? "Managed Content" : "Pending Upload"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.imageFiles && (
          <div className="flex items-center bg-red-50 border border-red-100 p-4 rounded-2xl">
            <Badge variant="outline" className="text-red-500 border-red-200 bg-white mr-3">
              Error
            </Badge>
            <span className="text-red-600 font-bold text-sm">
              {errors.imageFiles.message}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesSection;
