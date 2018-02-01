import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserRegistrationForm} from '../../model/user-registration-form';
import {UserSessionService} from '../../core/user-session.service';
import {FormGroup} from '@angular/forms';
import {User} from '../../model/user';
import {ImprovedMultimedia} from '../../model/improved-multimedia';
import {Router} from '@angular/router';

@Component({
    selector: 'app-forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy {
    private alive = true;
    private dto: UserRegistrationForm;
    private user: User;
    form: FormGroup;
    showForm = false;
    loading = false;
    updateButtonClicked = false;
    success = false;
    failure = false;
    types: Array<string> = ['BTC', 'ETH']; // Crypto options
    tags: Array<string> = ['documents']; // used to add meta data on the uploaded images

    private doRegistration(user: User): void {
        this.form = new FormGroup({});
        this.dto = UserRegistrationForm.deserializeObject(user);
        this.dto.populateFormValues(this.form);
        this.showForm = true;
    }

    reset(): void {
        this.success = false;
        this.failure = false;
    }

    multimediasChange(multimedia: Array<ImprovedMultimedia>) {
        this.dto.multimedia = multimedia;
        this.dto.populateMultimediaFormValues(this.form);
    }

    onSubmit(): void {
        this.loading = true;
        this.dto.updateFromFormValues(this.form);
        this.user.updateRegistrationDetails(this.dto);
        this.userSessionService.updateUser(this.user.uid, User.serializeObject(this.user))
            .takeWhile(() => this.alive)
            .subscribe(() => {
                    this.success = true;
                },
                error => {
                    this.loading = false;
                    this.updateButtonClicked = false;
                    this.failure = true;
                },
                () => {
                    this.loading = false;
                    this.updateButtonClicked = false;
                }
            );
    }

    showDialog() {
        this.updateButtonClicked = true;
    }

    completeDialogClose() {
        this.updateButtonClicked = false;
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.loading = true;
        this.userSessionService.getUser()
            .takeWhile(() => this.alive)
            .subscribe((user: User) => {
                    if (user != null) {
                        this.loading = false;
                        this.user = User.deserializeObject(user);
                        this.doRegistration(this.user);
                    }
                },
                error => this.loading = false
            );
    }

    constructor(private readonly userSessionService: UserSessionService,
                private readonly router: Router) {

    }
}
