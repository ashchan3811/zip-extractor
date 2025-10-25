# Extract ZIP

A Node.js utility for extracting ZIP files with built-in file filtering and duplicate detection.

## Features

- 📦 Extract single ZIP file or batch extract multiple ZIP files from a directory
- 🔍 Optional file name filtering
- ⚡ Automatic duplicate file detection (compares file size)
- 📁 Flat extraction - extracts all files without preserving folder structure
- ✅ Comprehensive logging with emoji indicators

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd extract-zip
```

2. Install dependencies:
```bash
npm install
```

## Dependencies

- [adm-zip](https://www.npmjs.com/package/adm-zip) - Fast ZIP file extraction
- [unzipper](https://www.npmjs.com/package/unzipper) - ZIP file streaming support

## Usage

### Basic Syntax

```bash
node extract-zips.js <zip-file-or-folder> <output-directory> [filter-prefix]
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `zip-file-or-folder` | ✅ Yes | Path to a single ZIP file or a directory containing multiple ZIP files |
| `output-directory` | ✅ Yes | Destination directory where files will be extracted |
| `filter-prefix` | ❌ No | Optional filename filter - only processes ZIP files starting with this prefix |

### Examples

#### Extract a single ZIP file:
```bash
node extract-zips.js C:\path\to\archive.zip C:\output\folder
```

#### Extract all ZIP files from a directory:
```bash
node extract-zips.js C:\path\to\zips C:\output\folder
```

#### Extract with file filtering:
```bash
node extract-zips.js C:\path\to\zips C:\output\folder Archive_
```
This will only extract ZIP files whose names start with "Archive_"

#### Using npm script (as configured):
```bash
npm run extract-zip
```

## Behavior

### Extraction
- All files are extracted **without preserving folder structure** (flat extraction)
- Files are extracted directly into the output directory
- Directories within ZIP files are ignored

### Duplicate Handling
- If a file already exists in the output directory, the tool compares file sizes
- If sizes match, the file is skipped (assumed to be identical)
- If sizes differ, the existing file is overwritten
- All actions are logged to the console

### Output Directory
- If the output directory doesn't exist, it will be created automatically
- If it already exists, a warning is displayed but extraction continues

## Logging

The tool provides clear console feedback with emoji indicators:

- 📁 Creating output directory
- ⚠️ Warnings (existing directory, duplicate files)
- 📂 Extracting ZIP file
- ➡️ Extracting individual file
- ✅ Successful extraction
- ❌ Extraction errors
- 📦 Found multiple ZIP files
- 🔍 File filtering active

## Error Handling

- Invalid paths or missing parameters will display usage instructions
- Failed extractions log error messages but don't stop batch processing
- Non-ZIP files in a directory are automatically ignored

## License

ISC

## Author

(Add your name/info here)

