import ftplib
import os

FTP_HOST = "w008f6b4.kasserver.com"
FTP_PORT = 21
FTP_USER = "f0184def"
FTP_PASS = "Y3jbmdDu(gS8iTgw8Vmk"

LOCAL_ROOT = r"e:\Website\premiumdowngrade"

DIRS_TO_UPLOAD = [
    "assets",
    "css",
    "js",
    "data",
    "projects",
    "project",
    "images",
]

ROOT_FILES = [
    "index.html",
    "favicon.svg",
    "footer.html",
    "imprint.json",
    "privacy.json",
    "logo.json",
]

def upload_file(ftp, local_path, filename):
    """Upload a file. Must be in the correct remote directory already."""
    try:
        with open(local_path, "rb") as f:
            ftp.storbinary(f"STOR {filename}", f)
        print(f"  ✓ {filename}")
    except Exception as e:
        print(f"  ✗ {filename}: {e}")

def ensure_remote_dir(ftp, path):
    """Create directory path step by step from root.
    cd into parent first, then mkdir with just the dirname."""
    ftp.cwd("/")
    parts = path.strip("/").split("/")
    for part in parts:
        try:
            ftp.cwd(part)
        except:
            try:
                ftp.mkd(part)
                ftp.cwd(part)
            except Exception as e:
                print(f"  ! mkdir failed for '{part}': {e}")
                return False
    return True

def upload_directory(ftp, local_dir):
    local_path = os.path.join(LOCAL_ROOT, local_dir)
    if not os.path.isdir(local_path):
        print(f"  ? {local_dir} not found locally, skipping")
        return
    
    for root, dirs, files in os.walk(local_path):
        rel_path = os.path.relpath(root, LOCAL_ROOT).replace("\\", "/")
        
        # Ensure remote directory exists and cd into it
        if rel_path != ".":
            if not ensure_remote_dir(ftp, rel_path):
                print(f"  ! Skipping {rel_path} (mkdir failed)")
                continue
        
        # Upload files in current directory
        for f in files:
            if f.startswith("."):
                continue
            local_file = os.path.join(root, f)
            upload_file(ftp, local_file, f)

def main():
    print("Connecting to FTP...")
    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, FTP_PORT)
    ftp.login(FTP_USER, FTP_PASS)
    ftp.cwd("/")
    print(f"Connected. Root: {ftp.pwd()}")
    
    print("\n--- Uploading root files ---")
    for f in ROOT_FILES:
        local = os.path.join(LOCAL_ROOT, f)
        if os.path.exists(local):
            upload_file(ftp, local, f)
        else:
            print(f"  ? {f} not found, skipping")
    
    for d in DIRS_TO_UPLOAD:
        print(f"\n--- Uploading {d}/ ---")
        upload_directory(ftp, d)
    
    print("\n✓ Upload complete!")
    ftp.quit()

if __name__ == "__main__":
    main()
