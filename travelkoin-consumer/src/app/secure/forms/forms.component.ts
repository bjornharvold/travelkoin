import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserRegistrationForm} from '../../model/user-registration-form';
import {UserSessionService} from '../../core/user-session.service';
import {FormGroup} from '@angular/forms';
import {User} from '../../model/user';
import {Router} from '@angular/router';
import {takeWhile} from 'rxjs/operators';

@Component({
    selector: 'app-secure-forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy {
    private alive = true;
    private dto: UserRegistrationForm;
    user: User;
    form: FormGroup;
    showForm = false;
    loading = false;
    updateButtonClicked = false;
    success = false;
    failure = false;

    private populateForm(user: User): void {
        this.form = new FormGroup({});
        this.dto = UserRegistrationForm.deserializeObject(user);
        this.dto.populateFormValues(this.form);
        this.showForm = true;
    }

    reset(): void {
        this.success = false;
        this.failure = false;
    }

    onSubmit(): void {
        this.loading = true;
        this.dto.updateFromFormValues(this.form);
        this.user.updateRegistrationDetails(this.dto);
        this.userSessionService.updateUser(this.user.uid, this.user).pipe(
            takeWhile(() => this.alive))
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
        this.userSessionService.getUser().pipe(
            takeWhile(() => this.alive))
            .subscribe((user: User) => {
                    if (user != null) {
                        this.loading = false;
                        this.user = User.deserializeObject(user);
                        this.populateForm(this.user);
                    }
                },
                error => this.loading = false
            );
    }

    constructor(private readonly userSessionService: UserSessionService,
                private readonly router: Router) {

    }
}
