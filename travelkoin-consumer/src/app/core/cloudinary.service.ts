/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ImprovedMultimedia} from '../model/improved-multimedia';

const cloudinaryConfig = {
    cloud_name: 'traveliko',
    upload_preset: 'traveliko_default_preset'
};

@Injectable({providedIn: 'root'})
export class CloudinaryService {

    public static readonly UPLOAD_URL: string = 'https://api.cloudinary.com/v1_1/traveliko/upload';
    public static readonly REMOVE_URL: string = 'https://api.cloudinary.com/v1_1/traveliko/delete_by_token';
    public static readonly REQUIRED_UPLOAD_FIELD: string = 'file';
    public static readonly DEFAULT_IMAGE: string = 'no-image-available';
    public static readonly DEFAULT_TYPE: string = 'IMAGE';
    public static readonly SOURCE: string = 'CLOUDINARY';

    getRestrictions(): any {
        return {
            allowedExtensions: ['.gif', '.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff']
        };
    }

    getXmlHttpRequest(): any {
        return {
            name: 'X-Requested-With',
            value: 'XMLHttpRequest'
        };
    }

    getContentType(): any {
        return {
            name: 'Content-Type',
            value: 'application/json'
        };
    }

    getUploadBody(tags: Array<string>): any {
        return {
            'upload_preset': cloudinaryConfig.upload_preset,
            'tags': tags,
        };
    }

    getUploadHeaders(): HttpHeaders {
        const uploadHeaders = new HttpHeaders();
        uploadHeaders.append(this.getXmlHttpRequest().name, this.getXmlHttpRequest().value);
        return uploadHeaders;
    }

    getRemoveHeaders(): HttpHeaders {
        const removeHeaders = new HttpHeaders();
        removeHeaders.append(this.getXmlHttpRequest().name, this.getXmlHttpRequest().value);
        removeHeaders.append(this.getContentType().name, this.getContentType().value);
        return removeHeaders;
    }

    getRemoveHttpHeaders(): HttpHeaders {
        const removeHeaders = new HttpHeaders();
        removeHeaders.append(this.getXmlHttpRequest().name, this.getXmlHttpRequest().value);
        removeHeaders.append(this.getContentType().name, this.getContentType().value);
        return removeHeaders;
    }

    removeByDeleteToken(deleteToken: string): Observable<any> {
        const options = {
            headers: this.getRemoveHttpHeaders()
        };
        const body = {
            token: deleteToken
        };
        return this.httpClient.post<any>(CloudinaryService.REMOVE_URL, body, options);
    }

    extractAngleFromMeta(image_metadata): string {
        let angle: string;
        // orientations: "Horizontal (normal)", "Rotate 90 CW", "Rotate 180 CW", "Rotate 270 CW", undefined
        const orientation = (image_metadata != null && image_metadata !== undefined) ? image_metadata.Orientation : null;
        if (orientation != null && orientation !== 'Horizontal (normal)') {
            const orientationAngle = orientation.replace('Rotate', '').replace('CW', '').trim();
            if (orientationAngle != null && orientationAngle !== undefined && orientationAngle !== '') {
                angle = '-' + orientationAngle;
            }
        }
        return angle;
    }

    instantiateMultimedia(): ImprovedMultimedia {
        const multimedia = new ImprovedMultimedia();
        multimedia.identifier = CloudinaryService.DEFAULT_IMAGE;
        return multimedia;
    }

    constructor(private httpClient: HttpClient) {
    }

}
