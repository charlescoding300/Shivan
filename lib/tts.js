import path from "path";

const tempDir = "./temp";

// Function to ensure the temp directory exists
function ensureTempDir() {
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
}

// Ensure the temp directory is created
ensureTempDir();

// Function to save audio files
function saveAudioFile(file) {
    const filePath = path.join(tempDir, file);
    // Logic to save your audio file to filePath
    return filePath;
}
