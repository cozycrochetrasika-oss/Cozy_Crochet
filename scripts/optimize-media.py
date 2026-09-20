import os
import shutil
import subprocess
from PIL import Image

BASE_DIR = "/home/lakhyajit/Cozy_Crochet_AGY"
PUBLIC_PRODUCTS = os.path.join(BASE_DIR, "public", "products")
FOLDERS = ["Bag", "Boque", "HeadBands", "Key_Ring", "Kid_Shoe", "Rose", "Sunflower"]

def optimize_image(src_path, dest_path, max_dim=1000):
    try:
        with Image.open(src_path) as img:
            orig_size = os.path.getsize(src_path)
            w, h = img.size
            if max(w, h) > max_dim:
                scale = max_dim / float(max(w, h))
                new_w, new_h = int(w * scale), int(h * scale)
                img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            ext = os.path.splitext(src_path)[1].lower()
            if ext in [".jpg", ".jpeg"]:
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                img.save(dest_path, "JPEG", quality=82, optimize=True)
            elif ext == ".png":
                if img.mode == "RGBA":
                    alpha = img.split()[-1]
                    if alpha.getextrema() == (255, 255):
                        img = img.convert("RGB")
                img.save(dest_path, "PNG", optimize=True)
            else:
                shutil.copy2(src_path, dest_path)
            
            new_size = os.path.getsize(dest_path)
            print(f"  [IMG] {os.path.basename(src_path)}: {orig_size/1024/1024:.2f}MB -> {new_size/1024:.1f}KB ({((1 - new_size/orig_size)*100):.1f}% smaller)")
    except Exception as e:
        print(f"  [ERROR] Failed {src_path}: {e}")
        shutil.copy2(src_path, dest_path)

def optimize_video(src_path, dest_path):
    orig_size = os.path.getsize(src_path)
    cmd = [
        "ffmpeg", "-y", "-i", src_path,
        "-vf", "scale='min(720,iw)':-2",
        "-c:v", "libx264", "-crf", "28", "-preset", "fast",
        "-c:a", "aac", "-b:a", "96k",
        "-movflags", "+faststart",
        dest_path
    ]
    try:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        new_size = os.path.getsize(dest_path)
        print(f"  [VID] {os.path.basename(src_path)}: {orig_size/1024/1024:.2f}MB -> {new_size/1024/1024:.2f}MB ({((1 - new_size/orig_size)*100):.1f}% smaller)")
    except Exception as e:
        print(f"  [WARN] ffmpeg failed for {src_path}, copying directly: {e}")
        shutil.copy2(src_path, dest_path)

def main():
    print("Starting product media optimization...")
    total_orig = 0
    total_new = 0

    for folder in FOLDERS:
        src_folder = os.path.join(BASE_DIR, folder)
        dest_folder = os.path.join(PUBLIC_PRODUCTS, folder)
        
        if os.path.islink(dest_folder):
            print(f"Removing symlink: {dest_folder}")
            os.unlink(dest_folder)
        elif os.path.isdir(dest_folder):
            shutil.rmtree(dest_folder)
            
        os.makedirs(dest_folder, exist_ok=True)
        print(f"\nProcessing {folder} -> {dest_folder}...")

        if not os.path.exists(src_folder):
            print(f"Warning: {src_folder} not found!")
            continue

        for fname in os.listdir(src_folder):
            src_file = os.path.join(src_folder, fname)
            dest_file = os.path.join(dest_folder, fname)
            
            if os.path.isdir(src_file) or fname.startswith("."):
                continue
                
            orig_sz = os.path.getsize(src_file)
            total_orig += orig_sz
            
            ext = os.path.splitext(fname)[1].lower()
            if ext in [".png", ".jpg", ".jpeg"]:
                optimize_image(src_file, dest_file)
            elif ext in [".mp4", ".mov", ".webm"]:
                optimize_video(src_file, dest_file)
            else:
                shutil.copy2(src_file, dest_file)
                
            if os.path.exists(dest_file):
                total_new += os.path.getsize(dest_file)

    print("\n==========================================")
    print(f"Total original size: {total_orig / 1024 / 1024:.2f} MB")
    print(f"Total optimized size: {total_new / 1024 / 1024:.2f} MB")
    print(f"Overall reduction: {((1 - total_new / total_orig) * 100):.1f}%")
    print("Optimization complete!")

if __name__ == "__main__":
    main()
