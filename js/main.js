import {renderThumbnails} from './thumbnail.js';
import {generatePhoto} from './data.js';

const photos = generatePhoto();
renderThumbnails(photos);
