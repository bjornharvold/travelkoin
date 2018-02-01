/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ErrorEvent, FileRestrictions, SuccessEvent, UploadEvent} from '@progress/kendo-angular-upload';
import {CloudinaryService} from '../../core/cloudinary.service';
import {ImprovedMultimedia} from '../../model/improved-multimedia';
import {FormGroup} from '@angular/forms';
import {UploadProgressEvent} from '@progress/kendo-angular-upload/dist/es/upload-events';
import {HttpHeaders} from '@angular/common/http';

@Component({
    selector: 'app-multimedia-manager',
    templateUrl: './multimedia-manager.component.html',
    styleUrls: ['./multimedia-manager.component.scss']
})
export class MultimediaManagerComponent implements OnInit, OnDestroy {
    private alive = true;

    @Input() header: string;
    @Input() readOnly = false;
    @Input() showRequired = true;
    @Input() showHelp = true;
    @Input() tags: Array<string> = [];
    @Input() multimedias: Array<ImprovedMultimedia>;
    @Output() multimediasChange: EventEmitter<Array<ImprovedMultimedia>>;
    @Output() multimediasSort: EventEmitter<Array<ImprovedMultimedia>>;
    @Output() multimediaUpload: EventEmitter<ImprovedMultimedia>;
    @Output() multimediaRemove: EventEmitter<ImprovedMultimedia>;
    @Output() multimediaUpdate: EventEmitter<ImprovedMultimedia>;

    // kendo-upload settings
    saveUrl: string;
    saveField: string;
    saveHeaders: HttpHeaders;
    restrictions: FileRestrictions;
    withCredentials: boolean;
    showFiles: boolean;

    // selected
    selectedMultimedia: ImprovedMultimedia;
    selectedMultimediaFormGroup: FormGroup;

    // sort
    sorting = false;

    // update
    updating = false;

    // failed uploads
    failedMultimedias: Array<ImprovedMultimedia> = [];

    private onUploadSuccess(fileUid, cloudinaryObject): void {
        for (const multimedia of this.multimedias) {
            if (multimedia.fileUid === fileUid) {
                multimedia.uploading = false;
                multimedia.identifier = cloudinaryObject.public_id;
                multimedia.type = cloudinaryObject.resource_type.toUpperCase();
                if (cloudinaryObject.width != null && cloudinaryObject.height != null
                    && cloudinaryObject.width > 0 && cloudinaryObject.height > 0) {
                    multimedia.width = cloudinaryObject.width;
                    multimedia.height = cloudinaryObject.height;
                }
                this.multimediaUpload.emit(multimedia);
                this.multimediasChange.emit(this.multimedias);
                return;
            }
        }
    }

    private onUploadError(fileUid): void {
        for (let i = 0; i < this.multimedias.length; i++) {
            if (this.multimedias[i].fileUid === fileUid) {
                this.failedMultimedias.push(this.multimedias[i]);
                this.multimedias.splice(i, 1);
                this.multimediasChange.emit(this.multimedias);
                return;
            }
        }
    }

    private onUploadProgress(fileUid, uploadPercent): void {
        for (let i = 0; i < this.multimedias.length; i++) {
            if (this.multimedias[i].fileUid === fileUid) {
                this.multimedias[i].uploadPercent = uploadPercent;
                return;
            }
        }
    }

    upload(e: UploadEvent): void {
        e.data = this.cloudinaryService.getUploadBody(this.tags);
        const newMultimedia: ImprovedMultimedia = this.cloudinaryService.instantiateMultimedia();
        newMultimedia.fileUid = e.files[0].uid;
        newMultimedia.fileName = e.files[0].name;
        newMultimedia.fileExt = e.files[0].extension;
        newMultimedia.fileSize = e.files[0].size;
        newMultimedia.uploading = true;
        this.multimedias.push(newMultimedia);
    }

    success(e: SuccessEvent): void {
        switch (e.operation) {
            case 'upload':
                this.onUploadSuccess(e.files[0].uid, e.response.body);
                break;
        }
    }

    error(e: ErrorEvent): void {
        // console.log(e); // Temporary: let's trap what cloudinary has to say on error event
        switch (e.operation) {
            case 'upload':
                this.onUploadError(e.files[0].uid);
                break;
        }
    }

    uploadProgress(e: UploadProgressEvent): void {
        this.onUploadProgress(e.files[0].uid, e.percentComplete);
    }

    remove(item: ImprovedMultimedia) {
        for (let i = 0; i < this.multimedias.length; i++) {
            if (this.multimedias[i].identifier === item.identifier) {
                this.multimedias.splice(i, 1);
                this.multimediaRemove.emit(item);
                break;
            }
        }
        this.multimediasChange.emit(this.multimedias);
    }

    removeFromFailedMultimedias(i) {
        this.failedMultimedias.splice(i, 1);
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.saveUrl = CloudinaryService.UPLOAD_URL;
        this.saveField = CloudinaryService.REQUIRED_UPLOAD_FIELD;
        this.saveHeaders = this.cloudinaryService.getUploadHeaders();
        this.restrictions = this.cloudinaryService.getRestrictions();
        this.withCredentials = false;
        this.showFiles = false;

        if (this.multimedias == null) {
            this.multimedias = [];
        }

    }

    constructor(private cloudinaryService: CloudinaryService) {
        this.multimediasChange = new EventEmitter(true);
        this.multimediasSort = new EventEmitter(true);
        this.multimediaUpload = new EventEmitter(true);
        this.multimediaRemove = new EventEmitter(true);
        this.multimediaUpdate = new EventEmitter(true);
    }

}
