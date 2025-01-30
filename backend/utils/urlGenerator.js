const DataUriParser = require('datauri/parser.js')
const path = require('path')
const exp = require('constants')
    //A URI (Uniform Resource Identifier) is a string used to identify a resource on the internet or within a system
const getDataUrl = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
    // combines the file extension and binary data to create a URI
    //mimetype:image/png
    //base64:iVBORw0KGgoAAAANSUhEUgAA...
    //filebuffer:binary data of image uploaded using multer
    //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
module.exports = getDataUrl