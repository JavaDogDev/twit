const fs = require('fs');
const util = require('util');
const path = require('path');
const mongoose = require('mongoose');

const UPLOAD_TYPES = ['IMAGE'];
const UPLOAD_PATHS = {
  Images: path.join(process.cwd(), '/uploads/images/'),
};

/**
 * Deletes a file.
 * @param String path to the file
 */
function deleteFromDisk(filePath) {
  return util.promisify(fs.unlink)(filePath);
}

function createUploadModel() {
  const uploadSchema = mongoose.Schema({
    fileName: { type: String, index: { unique: true } },
    type: { type: String, enum: UPLOAD_TYPES },
  });

  /** @returns absolute path for an uploaded image */
  uploadSchema.methods.getImagePath = function getImagePath() {
    if (this.type !== 'IMAGE') {
      return new Error(`This upload isn't an image: ${this.fileName}`);
    }
    return path.join(UPLOAD_PATHS.Images, this.fileName);
  };

  uploadSchema.pre('remove', function preRemove() {
    switch (this.type) {
      case 'IMAGE':
        deleteFromDisk(path.join(UPLOAD_PATHS.Images, this.fileName))
          .catch(err => console.error(`Error while deleting image '${this.fileName}':\n\t${err}`));
        break;
      default: console.error(`Don't know how to delete upload '${this.fileName}' with type '${this.type}'.`);
    }
  });

  return mongoose.model('Upload', uploadSchema);
}

const Upload = createUploadModel();

module.exports = Upload;
