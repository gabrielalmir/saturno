import sys
import os
from rembg import remove
from PIL import Image
import argparse

def process_image(input_path, output_path=None):
    if output_path is None:
        filename, ext = os.path.splitext(input_path)
        output_path = f"{filename}_transparent{ext}"

    try:
        print(f"Processing: {input_path}")
        input_image = Image.open(input_path)
        output_image = remove(input_image)
        output_image.save(output_path)
        print(f"Saved to: {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

def main():
    parser = argparse.ArgumentParser(description="Remove background from images.")
    parser.add_argument("path", help="Path to an image file or directory")
    parser.add_argument("--suffix", help="Suffix for output files (default: _transparent)", default="_transparent")
    
    args = parser.parse_args()
    
    if os.path.isfile(args.path):
        process_image(args.path)
    elif os.path.isdir(args.path):
        for root, _, files in os.walk(args.path):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                    # Skip already processed files to avoid loops if writing to same dir
                    if args.suffix in file:
                        continue
                    
                    full_path = os.path.join(root, file)
                    filename, ext = os.path.splitext(full_path)
                    output_path = f"{filename}{args.suffix}{ext}"
                    
                    if not os.path.exists(output_path):
                        process_image(full_path, output_path)
    else:
        print("Invalid path provided.")

if __name__ == "__main__":
    main()
