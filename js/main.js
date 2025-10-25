import {renderThumbnails} from './thumbnail.js';
import {generatePhotosArray} from './data.js';

const photos = generatePhotosArray();
renderThumbnails(photos);

